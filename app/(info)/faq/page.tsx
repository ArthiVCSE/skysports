import React from 'react';
import styles from '../info.module.css';

export default function FAQPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      
      <div className={styles.card}>
        <div className={styles.faqQuestion}>How do I place an order?</div>
        <div className={styles.faqAnswer}>Browse our premium collection, add items to your cart, and proceed to checkout. Payment is Cash on Delivery.</div>
      </div>

      <div className={styles.card}>
        <div className={styles.faqQuestion}>What is the return policy?</div>
        <div className={styles.faqAnswer}>You can return items within 7 days of delivery as long as they are in their original condition and packaging.</div>
      </div>

      <div className={styles.card}>
        <div className={styles.faqQuestion}>Do you provide real-time order tracking?</div>
        <div className={styles.faqAnswer}>Yes! Once you place an order, you can visit the Orders section in your profile to track your package's journey to your doorstep.</div>
      </div>

      <div className={styles.card}>
        <div className={styles.faqQuestion}>How long does delivery take?</div>
        <div className={styles.faqAnswer}>Standard delivery typically takes 3-5 business days depending on your location. We strive to get your gear to you as fast as possible.</div>
      </div>
    </main>
  );
}
