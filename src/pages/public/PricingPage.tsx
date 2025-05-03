import React from 'react';
import { CreditCard, Check } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      description: 'Perfect for individual device owners',
      features: [
        'Register up to 2 devices',
        'Basic device tracking',
        'Email support',
        'Monthly status reports'
      ]
    },
    {
      name: 'Pro',
      price: '$24.99',
      description: 'Ideal for small businesses',
      features: [
        'Register up to 10 devices',
        'Advanced device tracking',
        'Priority support',
        'Real-time alerts',
        'Detailed analytics',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited device registration',
        'Advanced security features',
        'Dedicated account manager',
        'Custom integration options',
        '24/7 premium support',
        'Bulk device management'
      ]
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect plan for your device management needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col hover:border-blue-500 transition-colors duration-300"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  )}
                </p>
                <p className="mt-6 text-gray-500">{plan.description}</p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white transition duration-200"
              >
                <span className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Get Started
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;