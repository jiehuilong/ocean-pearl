import { t } from '@/lib/messages';

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-zinc">
      <h1 className="text-3xl font-light text-ocean mb-8">Privacy Policy</h1>
      <p className="text-sm text-zinc-400 mb-6">Last updated: July 2026</p>

      <h2>1. Information We Collect</h2>
      <p>When you create an account, place an order, or contact us, we collect: your name, email address, shipping address, phone number, and payment information. Payment data is processed by Stripe and never stored on our servers.</p>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to process orders, send order confirmations, respond to inquiries, improve our services, and comply with legal obligations. We do not sell your personal data to third parties.</p>

      <h2>3. Data Storage & Security</h2>
      <p>Your data is stored securely using industry-standard encryption. We retain your information only as long as necessary to provide our services or as required by law.</p>

      <h2>4. Your Rights (GDPR)</h2>
      <p>If you are in the EU/EEA, you have the right to: access your personal data, correct inaccurate data, delete your data (<a href={`/${locale}/account`} className="text-gold">request via your account</a>), restrict processing, data portability, and withdraw consent at any time.</p>

      <h2>5. Cookies</h2>
      <p>We use essential cookies for authentication and cart functionality. We do not use tracking cookies or third-party analytics cookies without your explicit consent.</p>

      <h2>6. Third-Party Services</h2>
      <p>We use Stripe for payment processing and may use Resend for transactional emails. These services have their own privacy policies governing data handling.</p>

      <h2>7. Contact</h2>
      <p>For privacy-related inquiries, email us at privacy@oceanpearl.com.</p>
    </div>
  );
}
