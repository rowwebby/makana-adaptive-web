import React from 'react';
import styles from './Comparison.module.css';
import { type StaticContentMessageTextPayload } from 'adaptive-web-controller';
import ProductCard, { type Product } from '../shared/ProductCard';

interface ComparisonProps {
  content: StaticContentMessageTextPayload;
}

interface ProductFeature {
  name: string;
  value: string;
}

interface ComparisonProduct extends Product {
  features?: ProductFeature[];
}

interface ComparisonData {
  products?: Product[];
}

const Comparison: React.FC<ComparisonProps> = ({ content }) => {
  // Extract data from curation field
  const comparisonData = (content?.curation || {}) as ComparisonData;
  const products = comparisonData?.products || [];

  // Limit to 3 max
  const displayProducts = products.slice(0, 3) as ComparisonProduct[];

  // Get all unique feature names across all products (up to 5)
  const getAllFeatures = (): string[] => {
    const featureSet = new Set<string>();
    displayProducts.forEach(product => {
      product.features?.forEach(feature => {
        featureSet.add(feature.name);
      });
    });
    return Array.from(featureSet).slice(0, 5);
  };

  const allFeatures = getAllFeatures();

  // Get feature value for a specific product
  const getFeatureValue = (product: ComparisonProduct, featureName: string): string => {
    const feature = product.features?.find(f => f.name === featureName);
    return feature?.value || '—';
  };

  return (
    <div className={styles.comparisonTemplate}>
      <div className={styles.comparisonGrid}>
        {displayProducts.map((product) => (
          <div key={product.id} className={styles.comparisonColumn}>
            {/* Product Card Section */}
            <ProductCard product={product} />
            {/* Features Section */}
            {allFeatures.length > 0 && (
              <div className={styles.featuresSection}>
                {allFeatures.map((featureName, index) => (
                  <div key={index} className={styles.featureRow}>
                    <div className={styles.featureName}>{featureName}</div>
                    <div className={styles.featureValue}>{getFeatureValue(product, featureName)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;

