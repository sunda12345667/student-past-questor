
import Layout from '@/components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-sm text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using iRapid's services, you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily use iRapid's services for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
            <p className="mb-6">
              All payments are processed securely through our payment partners. You agree to 
              provide accurate billing information and authorize us to charge your selected 
              payment method for any services purchased.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="mb-6">
              You are responsible for maintaining the confidentiality of your account information 
              and for all activities that occur under your account. You agree to notify us 
              immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall iRapid or its suppliers be liable for any damages arising out of 
              the use or inability to use the services, even if iRapid or its authorized 
              representative has been notified of the possibility of such damage.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@irapid.ng" className="text-primary hover:underline">
                legal@irapid.ng
              </a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
