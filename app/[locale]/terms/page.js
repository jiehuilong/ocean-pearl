export default async function TermsPage({ params }) {
  const { locale } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-zinc">
      <h1 className="text-3xl font-light text-ocean mb-8">Terms of Service</h1>
      <p className="text-sm text-zinc-400 mb-6">Last updated: July 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using Ocean Pearl, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

      <h2>2. Products & Pricing</h2>
      <p>All products are subject to availability. Prices are listed in USD and may change without notice. We reserve the right to correct pricing errors after an order is placed.</p>

      <h2>3. Orders & Payment</h2>
      <p>When you place an order, you agree to pay the total amount indicated. Payment is processed securely through Stripe. We reserve the right to cancel any order for suspected fraud or unauthorized transactions.</p>

      <h2>4. Shipping & Returns</h2>
      <p>Shipping times are estimates and not guaranteed. Returns are accepted within 30 days of delivery for unused items in original packaging. Customers are responsible for return shipping costs unless the item is defective.</p>

      <h2>5. Intellectual Property</h2>
      <p>All content on this website, including product images, descriptions, and branding, is the property of Ocean Pearl and may not be reproduced without permission.</p>

      <h2>6. Limitation of Liability</h2>
      <p>Ocean Pearl is not liable for indirect damages arising from the use of our products or services. Our total liability is limited to the amount paid for the product in question.</p>

      <h2>7. Governing Law</h2>
      <p>These terms are governed by the laws of Singapore. Any disputes shall be resolved through arbitration in Singapore.</p>
    </div>
  );
}
