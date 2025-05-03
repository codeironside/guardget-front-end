import React from 'react';
import { HelpCircle } from 'lucide-react';

const FaqPage = () => {
  const faqs = [
    {
      question: "What is Device Registry?",
      answer: "Device Registry is a secure platform that helps you register, track, and manage your devices. It provides a centralized system for device ownership verification and transfer."
    },
    {
      question: "How do I register my device?",
      answer: "You can register your device by logging into your account, navigating to the 'Register Device' section in your dashboard, and following the step-by-step registration process."
    },
    {
      question: "What happens if I lose my device?",
      answer: "If you lose your device, you should immediately report it through our 'Report Device' feature in the dashboard. This will mark your device as lost in our system and help prevent unauthorized transfers."
    },
    {
      question: "How can I transfer device ownership?",
      answer: "Device ownership can be transferred through our secure transfer system. Navigate to 'Transfer Ownership' in your dashboard, enter the new owner's details, and follow the verification process."
    },
    {
      question: "Is my device information secure?",
      answer: "Yes, we implement industry-standard security measures to protect your device information. All data is encrypted and stored securely in our database."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-2 text-lg text-gray-600">Find answers to common questions about Device Registry</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;