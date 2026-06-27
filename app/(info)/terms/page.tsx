import React from 'react';
import styles from '../info.module.css';

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      
      <div className={styles.card}>
        <div className={styles.sectionTitle}>1. General Conditions</div>
        <p className={styles.text}>
          Welcome to SkySports. By accessing or using our website, you agree to be bound by these Terms & Conditions. We reserve the right to refuse service to anyone for any reason at any time.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>2. Products and Services</div>
        <p className={styles.text}>
          Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>3. Pricing and Payments</div>
        <p className={styles.text}>
          Prices for our products are subject to change without notice. All payments are processed upon delivery (Cash on Delivery). Please ensure you have the exact amount ready when your order arrives.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>4. Changes to Terms</div>
        <p className={styles.text}>
          You can review the most current version of the Terms & Conditions at any time on this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms & Conditions by posting updates and changes to our website.
        </p>
      </div>
    </main>
  );
}
