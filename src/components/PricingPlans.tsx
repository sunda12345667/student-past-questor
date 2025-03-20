
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Basic',
    description: 'For occasional exam preparation',
    price: {
      monthly: 999,
      yearly: 9999
    },
    features: [
      'Access to basic past questions',
      '5 downloads per month',
      'Standard search functionality',
      'Basic AI chatbot assistance',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    description: 'For serious students preparing for exams',
    price: {
      monthly: 1999,
      yearly: 19999
    },
    features: [
      'Access to all past questions',
      'Unlimited downloads',
      'Advanced search & filters',
      'Full AI chatbot capabilities',
      'Study analytics & progress tracking',
      'Priority email support',
      'One additional service included'
    ],
    cta: 'Go Premium',
    popular: true
  },
  {
    name: 'Ultimate',
    description: 'Complete solution for academic excellence',
    price: {
      monthly: 2999,
      yearly: 29999
    },
    features: [
      'Everything in Premium',
      'Exclusive model answers',
      'Personalized study plans',
      'Exam predictions & insights',
      'Live chat support',
      'All additional services included',
      'Private tutoring discounts'
    ],
    cta: 'Get Ultimate',
    popular: false
  }
];

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price / 100);
  };

  const handlePlanSelection = (planName: string) => {
    toast.success(`You've selected the ${planName} plan (${billingCycle} billing)`);
    navigate('/signup', { state: { plan: planName, billingCycle } });
  };

  const handleContactUs = () => {
    toast.info('Our sales team will contact you shortly!');
  };

  return (
    <section id="pricing" className="py-20 bg-secondary/50 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the plan that fits your exam preparation needs.
          </p>
          
          <div className="inline-flex p-1 bg-muted rounded-full">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly <span className="text-primary text-xs">Save 15%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`glass-panel rounded-2xl overflow-hidden card-hover relative ${
                plan.popular ? 'md:scale-105 md:shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-10' : ''}`}>
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-5">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price[billingCycle])}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                <Button 
                  className={`w-full mb-8 ${plan.popular ? 'bg-primary' : ''}`}
                  onClick={() => handlePlanSelection(plan.name)}
                >
                  {plan.cta}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">
            Need a custom plan for your school or organization? 
            <Button 
              variant="link" 
              className="underline"
              onClick={handleContactUs}
            >
              Contact us
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
