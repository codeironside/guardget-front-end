import React from 'react';

const CareersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-4">
            We're always looking for talented individuals who are passionate about technology
            and device security. Join us in making the digital world a safer place.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Why Work With Us?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Competitive salary and benefits</li>
              <li>Remote-first work environment</li>
              <li>Professional development opportunities</li>
              <li>Cutting-edge technology stack</li>
              <li>Meaningful impact on device security</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Open Positions</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-800">Senior Software Engineer</h3>
              <p className="text-gray-600 mt-2">
                Lead the development of our core security features and help scale our platform.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-800">Security Analyst</h3>
              <p className="text-gray-600 mt-2">
                Help identify and prevent security threats in our device verification system.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Product Manager</h3>
              <p className="text-gray-600 mt-2">
                Drive the product vision and roadmap for our device security solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;