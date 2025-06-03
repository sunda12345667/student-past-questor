
import Layout from '@/components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About iRapid</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              iRapid is Nigeria's leading digital platform for bill payments, airtime top-ups, and educational resources. 
              We're committed to making digital transactions simple, secure, and accessible to everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-6">
              To revolutionize how Nigerians handle their daily transactions and access quality educational materials, 
              providing a seamless digital experience that saves time and money.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Instant airtime and data top-ups for all networks</li>
              <li>Convenient bill payments for electricity, TV subscriptions, and more</li>
              <li>Comprehensive study materials and past questions</li>
              <li>Secure wallet system with cashback rewards</li>
              <li>24/7 customer support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Why Choose iRapid?</h2>
            <p className="mb-6">
              With over 100,000 satisfied customers, iRapid has established itself as a trusted platform for digital services. 
              Our commitment to security, reliability, and customer satisfaction sets us apart in the industry.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              Have questions or need support? Reach out to us at{' '}
              <a href="mailto:support@irapid.ng" className="text-primary hover:underline">
                support@irapid.ng
              </a>{' '}
              or call our customer service line at +234 800 123 4567.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
