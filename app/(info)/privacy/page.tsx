import React from 'react';
import styles from '../info.module.css';

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      
      <div className={styles.card}>
        <div className={styles.sectionTitle}>1. Information We Collect</div>
        <p className={styles.text}>
          We collect information that you provide directly to us, such as when you create an account, place an order, or contact customer support. This includes your name, email address, and shipping address.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>2. How We Use Your Information</div>
        <p className={styles.text}>
          We use the information we collect to fulfill your orders, provide customer support, and improve our services. We do not sell your personal data to third parties.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>3. Security</div>
        <p className={styles.text}>
          We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>4. Contact Us</div>
        <p className={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at support@skysports.com.
        </p>
      </div>
    </main>
  );
}
