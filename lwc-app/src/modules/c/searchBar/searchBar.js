import { LightningElement, api, track } from 'lwc';

export default class SearchBar extends LightningElement {
    @api show = false;
    @track searchText = '';
    @track hasSentInitialMessage = false;

    AGENT_LOGO_IMAGE_URL = 'https://zzpq-010.dx.commercecloud.salesforce.com/on/demandware.static/Sites-nto-Site/-/default/dw9814f411/images/favicons/favicon-32x32.png';

    searchActions = [
        { text: 'Shop Hiking Boots', value: 'Shop Hiking Boots' },
        { text: 'Find Jackets', value: 'Find Jackets' },
        { text: 'Browse Backpacks', value: 'Browse Backpacks' }
    ];

    handleInputChange(event) {
        this.searchText = event.target.value;
    }

    handleSearch(event) {
        event.preventDefault();
        
        // Get the text from either the input or the button
        const formData = new FormData(event.target);
        const textToSend = formData.get('searchText') || formData.get('buttonText');
        
        if (!textToSend) return;

        if (!this.hasSentInitialMessage) {
            // Dispatch custom event to parent
            this.dispatchEvent(new CustomEvent('initialmessage', {
                detail: { text: textToSend },
                bubbles: true,
                composed: true
            }));
            this.hasSentInitialMessage = true;
        } else {
            window.AdaptiveWebsite.sendTextMessage(textToSend);
        }
        window.AdaptiveWebsite.maximize();
    }

    handleExpand() {
        // Dispatch custom event for pure UI toggle (doesn't affect conversation state)
        this.dispatchEvent(new CustomEvent('togglemaximize', {
            bubbles: true,
            composed: true
        }));
    }
}
