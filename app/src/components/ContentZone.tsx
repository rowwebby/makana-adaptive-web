import React, { useEffect, useState } from 'react';
import styles from './ContentZone.module.css';
import { type StaticContentMessageTextPayload } from 'adaptive-web-controller';
import { getMessagePayloadFromConversationEntry } from '../helpers/messagePayload';

const Recs = React.lazy(() => import('./templates/Recs'));
const Comparison = React.lazy(() => import('./templates/Comparison'));
const ProductDetails = React.lazy(() => import('./templates/ProductDetails'));

const ContentZone: React.FC<{ show: boolean }> = ({ show }) => {
  const [contentZoneContent, setContentZoneContent] = useState<StaticContentMessageTextPayload>();
  
  useEffect(() => {
    window.addEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_CONTENT_RECEIVED, handleContentReceived);
    window.addEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_LIST_CONVERSATION_ENTRIES, handleListConversationEntries);
    return () => {
      window.removeEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_CONTENT_RECEIVED, handleContentReceived);
      window.removeEventListener(window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_LIST_CONVERSATION_ENTRIES, handleListConversationEntries);
    }
  }, [])

  const handleContentReceived = (event: WindowEventMap[typeof window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_CONTENT_RECEIVED]) => {
    setContentZoneContent(event.detail.content)
  }

  const handleListConversationEntries = (event: WindowEventMap[typeof window.AdaptiveWebsite.Events.ON_EMBEDDED_MESSAGING_LIST_CONVERSATION_ENTRIES]) => {
    const entries = event.detail.entries;
    
    // Find the last entry that:
    // 1. Is not sent by the user (is sent by agent/bot)
    // 2. Is a static content message
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      
      // Check if it's a static content message and not from the end user
      if (
        window.AdaptiveWebsite.util.isConversationEntryStaticContentMessage(entry) &&
        !window.AdaptiveWebsite.util.isMessageFromEndUser(entry)
      ) {
        // Try to extract the payload
        const payload = getMessagePayloadFromConversationEntry(entry);
        if (payload) {
          setContentZoneContent(payload);
          return;
        }
      }
    }
  }

  return (
    <>
    {show && (
      <div className={styles.contentZoneContainer}>
        <div className={styles.contentZoneContent}>
          {contentZoneContent ? (
            (() => {
              const template = contentZoneContent.template;
              if (template && Array.isArray(template) && template.length > 0) {
                const firstTemplate = template[0];
                const templateName = typeof firstTemplate === 'object' && firstTemplate !== null && 'name' in firstTemplate 
                  ? (firstTemplate as { name: string }).name 
                  : null;
                
                if (templateName === 'Recs') {
                  return <Recs content={contentZoneContent} />;
                } else if (templateName === 'Comparison') {
                  return <Comparison content={contentZoneContent} />;
                } else if (templateName === 'ProductDetails') {
                  return <ProductDetails content={contentZoneContent} />;
                }
              }
              return <Placeholder />;
            })()
          ) : <Placeholder />}
        </div>
      </div>
    )}
    </>
  );
};

const Placeholder: React.FC = () => {
  return (
    <div className={styles.blankContent}>
      <div className={styles.typingIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default ContentZone;