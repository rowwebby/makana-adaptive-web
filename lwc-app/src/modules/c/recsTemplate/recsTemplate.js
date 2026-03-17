import { LightningElement, api, track } from 'lwc';

export default class RecsTemplate extends LightningElement {
    @api 
    get content() {
        return this._content;
    }
    set content(value) {
        if (typeof value === 'string') {
            try {
                this._content = JSON.parse(value);
            } catch {
                this._content = {};
            }
        } else {
            this._content = value || {};
        }
    }
    
    @track _content = {};

    get products() {
        const curation = this._content?.curation;
        if (curation && Array.isArray(curation.products)) {
            return curation.products.map((product, index) => ({
                ...product,
                id: product.id || `product-${index}`
            }));
        }
        return [];
    }

    get hasProducts() {
        return this.products.length > 0;
    }
}
