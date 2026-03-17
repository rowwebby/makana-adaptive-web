import { LightningElement, api } from 'lwc';

export default class Header extends LightningElement {
    @api show = false;

    AGENT_LOGO_IMAGE_URL = 'https://zzpq-010.dx.commercecloud.salesforce.com/on/demandware.static/Sites-nto-Site/-/default/dw9814f411/images/favicons/favicon-32x32.png';

    handleMinimize() {
        // Dispatch custom event for pure UI toggle (doesn't affect conversation state)
        this.dispatchEvent(new CustomEvent('toggleminimize', {
            bubbles: true,
            composed: true
        }));
    }

    handleNewConversation() {
        window.AdaptiveWebsite.startNewConversation();
    }

    handleCloseConversation() {
        // End the conversation via controller
        window.AdaptiveWebsite.endConversation();
        
        // Also dispatch event to toggle UI to SearchBar
        this.dispatchEvent(new CustomEvent('closeconversation', {
            bubbles: true,
            composed: true
        }));
    }
}
