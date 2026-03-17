import React from 'react';
import styles from './ProductDetails.module.css';
import { type StaticContentMessageTextPayload } from 'adaptive-web-controller';
import { type Product } from '../shared/ProductCard';
import ProductStars from '../shared/ProductStars';
import logger from '../../helpers/logger';

interface ProductDetailsProps {
  content: StaticContentMessageTextPayload;
}

interface ProductFeature {
  name: string;
  value: string;
}

interface ProductDetailsData extends Product {
  itemNumber?: string;
  features?: ProductFeature[];
}

interface ProductDetailsDataWrapper {
  product?: ProductDetailsData;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ content }) => {
  // Extract data from curation field
  const detailsData = (content?.curation || {}) as ProductDetailsDataWrapper;
  const product = detailsData?.product;

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    logger.debug('Add to cart clicked for product:', product.id);
  };

  const handleFavoriteClick = () => {
    logger.debug('Favorite clicked for product:', product.id);
  };

  return (
    <div className={styles.productDetailsTemplate}>
      <div className={styles.productDetailsContainer}>
        {/* Product Image Section */}
        <div className={styles.productImageSection}>
          <div className={styles.productImageContainer}>
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        {/* Product Info Section */}
        <div className={styles.productInfoSection}>
          {product.itemNumber && (
            <div className={styles.itemNumber}>ITEM NO.: {product.itemNumber}</div>
          )}
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.productPrice}>{product.price}</div>
          {product.rating && <ProductStars rating={product.rating} size="large" />}
          
          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              className={styles.addToCartButton}
              onClick={handleAddToCart}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              ADD TO CART
            </button>
            <button 
              className={styles.favoriteButton}
              onClick={handleFavoriteClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Features Section */}
          {product.features && product.features.length > 0 && (
            <div className={styles.featuresSection}>
              <h2 className={styles.featuresTitle}>FEATURES</h2>
              <ul className={styles.featuresList}>
                {product.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <span className={styles.featureName}>{feature.name}:</span>
                    <span className={styles.featureValue}>{feature.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

