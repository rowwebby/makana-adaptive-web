import { LightningElement, api, track } from 'lwc';

export default class ProductDetailsTemplate extends LightningElement {
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

    get product() {
        return this._content?.curation?.product || null;
    }

    get hasProduct() {
        return !!this.product;
    }

    get productImage() {
        return this.product?.image || '';
    }

    get productName() {
        return this.product?.name || '';
    }

    get productPrice() {
        return this.product?.price || '';
    }

    get productItemNumber() {
        return this.product?.itemNumber || '';
    }

    get hasItemNumber() {
        return !!this.productItemNumber;
    }

    get productRating() {
        return this.product?.rating || 0;
    }

    get hasRating() {
        return !!this.product?.rating;
    }

    get productFeatures() {
        if (this.product?.features && Array.isArray(this.product.features)) {
            return this.product.features.map((feature, index) => ({
                id: `feature-${index}`,
                name: feature.name,
                value: feature.value
            }));
        }
        return [];
    }

    get hasFeatures() {
        return this.productFeatures.length > 0;
    }

    handleAddToCart() {
        console.debug('Add to cart clicked for product:', this.product?.id);
    }

    handleFavoriteClick() {
        console.debug('Favorite clicked for product:', this.product?.id);
    }
}
