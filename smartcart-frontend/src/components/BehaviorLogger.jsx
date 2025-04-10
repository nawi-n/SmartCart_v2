import React, { useEffect } from 'react';
import { logProductInteraction } from '../services/api';

const BehaviorLogger = ({ customerId }) => {
  useEffect(() => {
    // Track page view
    logProductInteraction(customerId, 'page_view', 'view');

    // Track clicks
    const handleClick = (event) => {
      const target = event.target;
      if (target.closest('[data-product-id]')) {
        const productId = target.closest('[data-product-id]').dataset.productId;
        logProductInteraction(customerId, productId, 'click');
      }
    };

    // Track scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        logProductInteraction(customerId, 'page_bottom', 'scroll');
      }
    };

    // Track time spent
    let timeSpent = 0;
    const timeInterval = setInterval(() => {
      timeSpent += 1;
      if (timeSpent % 30 === 0) { // Log every 30 seconds
        logProductInteraction(customerId, 'time_spent', `view_${timeSpent}s`);
      }
    }, 1000);

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
      
      // Log total time spent when component unmounts
      logProductInteraction(customerId, 'time_spent', `total_${timeSpent}s`);
    };
  }, [customerId]);

  return null; // This is a utility component that doesn't render anything
};

export default BehaviorLogger; 