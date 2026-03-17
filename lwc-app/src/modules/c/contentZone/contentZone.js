import { LightningElement, api, track } from 'lwc';

export default class ContentZone extends LightningElement {
    @api show = false;
    @track contentZoneContent = null;
    @track currentTemplate = null;

    _handleContentReceived;
    _handleListEntries;

    connectedCallback() {
        this._handleContentReceived = this.handleContentReceived.bind(this);
        this._handleListEntries = this.handleListConversationEntries.bind(this);

        window.addEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_CONTENT_RECEIVED, this._handleContentReceived);
        window.addEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_LIST_CONVERSATION_ENTRIES, this._handleListEntries);
    }

    disconnectedCallback() {
        window.removeEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_CONTENT_RECEIVED, this._handleContentReceived);
        window.removeEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_LIST_CONVERSATION_ENTRIES, this._handleListEntries);
    }

    handleContentReceived(event) {
        this.contentZoneContent = event.detail.content;
        this.updateCurrentTemplate();
    }

    handleListConversationEntries(event) {
        const entries = event.detail.entries;
        
        // Find the last entry that is sent by agent/bot and is a static content message
        for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[i];
            
            if (
                window.AdaptiveWebsite.util.isConversationEntryStaticContentMessage(entry) &&
                !window.AdaptiveWebsite.util.isMessageFromEndUser(entry)
            ) {
                const payload = this.getMessagePayload(entry);
                if (payload) {
                    this.contentZoneContent = payload;
                    this.updateCurrentTemplate();
                    return;
                }
            }
        }
    }

    getMessagePayload(entry) {
        try {
            if (window.AdaptiveWebsite.util.isConversationEntryStaticContentMessage(entry)) {
                const textContent = window.AdaptiveWebsite.util.getTextMessageContent(entry);
                if (textContent) {
                    // Use parseJsonInAgentResponse to handle ```json blocks
                    const json = window.AdaptiveWebsite.util.parseJsonInAgentResponse(textContent);
                    
                    if (json !== undefined && typeof json === 'object' && json !== null) {
                        // Valid JSON payload
                        return json;
                    } else {
                        // Plain text response (not JSON)
                        return { text: textContent };
                    }
                }
            }
        } catch (e) {
            console.error('Error getting message payload:', e);
        }
        return null;
    }

    updateCurrentTemplate() {
        if (this.contentZoneContent && this.contentZoneContent.template) {
            const template = this.contentZoneContent.template;
            if (Array.isArray(template) && template.length > 0) {
                const firstTemplate = template[0];
                if (typeof firstTemplate === 'object' && firstTemplate !== null && 'name' in firstTemplate) {
                    this.currentTemplate = firstTemplate.name;
                    return;
                }
            }
        }
        this.currentTemplate = null;
    }

    // Computed properties for template conditions
    get showRecs() {
        return this.currentTemplate === 'Recs';
    }

    get showComparison() {
        return this.currentTemplate === 'Comparison';
    }

    get showProductDetails() {
        return this.currentTemplate === 'ProductDetails';
    }

    get showJsonViewer() {
        return this.currentTemplate === 'JsonViewer';
    }

    get showPlaceholder() {
        return !this.contentZoneContent || !this.currentTemplate;
    }

    get contentJson() {
        return this.contentZoneContent ? JSON.stringify(this.contentZoneContent) : '{}';
    }
}
