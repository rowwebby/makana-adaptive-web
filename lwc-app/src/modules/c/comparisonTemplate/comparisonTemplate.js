import { LightningElement, api, track } from 'lwc';

export default class ComparisonTemplate extends LightningElement {
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

    get displayProducts() {
        const curation = this._content?.curation;
        if (curation && Array.isArray(curation.products)) {
            return curation.products.slice(0, 3).map((product, index) => ({
                ...product,
                id: product.id || `product-${index}`,
                featureRows: this.getFeatureRowsForProduct(product)
            }));
        }
        return [];
    }

    get allFeatures() {
        const featureSet = new Set();
        const curation = this._content?.curation;
        if (curation && Array.isArray(curation.products)) {
            curation.products.slice(0, 3).forEach(product => {
                if (product.features) {
                    product.features.forEach(feature => {
                        featureSet.add(feature.name);
                    });
                }
            });
        }
        return Array.from(featureSet).slice(0, 5);
    }

    getFeatureRowsForProduct(product) {
        return this.allFeatures.map((featureName, index) => {
            const feature = product.features?.find(f => f.name === featureName);
            return {
                id: `${product.id}-feature-${index}`,
                name: featureName,
                value: feature?.value || '—'
            };
        });
    }

    get hasProducts() {
        return this.displayProducts.length > 0;
    }

    get hasFeatures() {
        return this.allFeatures.length > 0;
    }
}
