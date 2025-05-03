import React from 'react';
import { Shield, Users, Clock, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Protecting Digital Assets Worldwide
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            We're dedicated to making device protection and verification accessible to everyone,
            ensuring a safer digital world for all.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2023, we've made it our mission to revolutionize how people protect and
              verify their digital devices. Through innovative technology and user-friendly solutions,
              we're building a more secure digital ecosystem.
            </p>
            <p className="text-lg text-gray-600">
              Our platform serves thousands of users worldwide, helping them safeguard their
              devices and maintain peace of mind in an increasingly connected world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, label: 'Protected Devices', value: '50K+' },
              { icon: Users, label: 'Active Users', value: '10K+' },
              { icon: Clock, label: 'Years of Service', value: '5+' },
              { icon: Globe, label: 'Countries Served', value: '25+' },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Security First',
                description: 'We prioritize the protection of our users\' devices and data above all else.'
              },
              {
                title: 'Innovation',
                description: 'Constantly evolving our technology to stay ahead of emerging threats.'
              },
              {
                title: 'User Trust',
                description: 'Building lasting relationships through transparency and reliability.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;