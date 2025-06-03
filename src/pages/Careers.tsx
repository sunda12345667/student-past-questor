
import Layout from '@/components/Layout';

const Careers = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Careers at iRapid</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Join our team of passionate professionals who are revolutionizing digital payments 
              and education in Nigeria. We're always looking for talented individuals to help us 
              build the future of fintech.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Competitive salary and benefits package</li>
              <li>Flexible work arrangements</li>
              <li>Professional development opportunities</li>
              <li>Health insurance and wellness programs</li>
              <li>Performance bonuses and stock options</li>
              <li>Modern office environment in Lagos</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Current Openings</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-2">Software Engineer - Frontend</h3>
              <p className="text-muted-foreground mb-2">Lagos, Nigeria • Full-time</p>
              <p className="mb-4">
                We're looking for a skilled frontend developer to help build and maintain our 
                user-facing applications using React, TypeScript, and modern web technologies.
              </p>
              <a href="mailto:careers@irapid.ng?subject=Frontend Engineer Application" 
                 className="text-primary hover:underline">
                Apply Now →
              </a>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-2">Backend Engineer</h3>
              <p className="text-muted-foreground mb-2">Lagos, Nigeria • Full-time</p>
              <p className="mb-4">
                Join our backend team to build scalable APIs and services that power our 
                payment platform. Experience with Node.js, Python, or Go preferred.
              </p>
              <a href="mailto:careers@irapid.ng?subject=Backend Engineer Application" 
                 className="text-primary hover:underline">
                Apply Now →
              </a>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-2">Product Manager</h3>
              <p className="text-muted-foreground mb-2">Lagos, Nigeria • Full-time</p>
              <p className="mb-4">
                Lead product strategy and development for our fintech platform. Help define 
                the roadmap and work closely with engineering and design teams.
              </p>
              <a href="mailto:careers@irapid.ng?subject=Product Manager Application" 
                 className="text-primary hover:underline">
                Apply Now →
              </a>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Don't See Your Role?</h2>
            <p className="mb-6">
              We're always interested in hearing from talented individuals, even if we don't 
              have a specific opening that matches your skills. Send us your resume and let 
              us know how you'd like to contribute to iRapid's mission.
            </p>
            
            <p>
              Ready to join our team? Send your application to{' '}
              <a href="mailto:careers@irapid.ng" className="text-primary hover:underline">
                careers@irapid.ng
              </a>{' '}
              with your resume and a cover letter explaining why you'd be a great fit for iRapid.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
