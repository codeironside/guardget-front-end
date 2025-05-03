import React from 'react';
import { Users } from 'lucide-react';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Leading our mission to revolutionize device security and management.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Driving innovation in blockchain-based device verification.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Security',
      bio: 'Ensuring robust protection for all registered devices.'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      bio: 'Architecting our cutting-edge device management platform.'
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the experts behind our mission to create a safer digital world through innovative device verification.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We're always looking for talented individuals who share our passion for innovation and security.
          </p>
          <a 
            href="/careers" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;