import React, { useState } from 'react';
import styles from './Recs.module.css';
import { type StaticContentMessageTextPayload } from 'adaptive-web-controller';
import ProductCard, { type Product } from '../shared/ProductCard';
import logger from '../../helpers/logger';

interface RecsProps {
  content: StaticContentMessageTextPayload;
}

interface RecsData {
  bannerImage?: string;
  products?: Product[];
}

const Recs: React.FC<RecsProps> = ({ content }) => {
  // Extract data from curation field
  const recsData = (content?.curation || {}) as RecsData;
  const products = recsData?.products || [];
  const bannerImage = recsData?.bannerImage;

  const MAX_COMPARE_PRODUCTS = 3
  
  // Refs to track checkbox elements
  const [compareCheckboxesSelected, setCompareCheckboxesSelected] = useState<string[]>([]);

  const handleCompareChange = (id: string) => {
    if (compareCheckboxesSelected.includes(id)) {
      setCompareCheckboxesSelected(compareCheckboxesSelected.filter(refId => refId !== id));
    } else {
      setCompareCheckboxesSelected([...compareCheckboxesSelected, id]);
    }
  };

  const handleCompareProducts = () => {
    // TODO: Implement compare products functionality
    logger.debug('Comparing products:', compareCheckboxesSelected);
  };

  const shouldDisableCompareCheckbox = (id: string): boolean => {
    return compareCheckboxesSelected.length >= MAX_COMPARE_PRODUCTS && !compareCheckboxesSelected.includes(id);
  };

  return (
    <div className={styles.recsTemplate}>
      {bannerImage && (
        <div className={styles.recsBanner}>
          <img src={bannerImage} alt="Banner" />
        </div>
      )}
      <div className={styles.recsProductsGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCompare={true}
            compareDisabled={shouldDisableCompareCheckbox(product.id)}
            onCompareChange={handleCompareChange}
          />
        ))}
      </div>
      {/* Show compare button if at least 2 products are selected */}
      {compareCheckboxesSelected.length >= MAX_COMPARE_PRODUCTS && (
        <div className={styles.compareButtonContainer}>
          <button 
            className={styles.compareButton}
            onClick={handleCompareProducts}
          >
            Compare Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Recs;

