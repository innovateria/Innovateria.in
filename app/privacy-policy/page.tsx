import { FileText, Lock, Eye } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Innovateria',
  description: 'Privacy policy for Innovateria regarding data collection, protection, and security.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Data Governance
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Privacy <span className="text-gradient-brand">Policy</span>
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 text-xs text-gray-300 leading-relaxed">
        <div className="flex items-center space-x-3 text-brand-500 pb-2 border-b border-white/10">
          <Lock size={24} />
          <h2 className="text-lg font-bold text-white">Data Protection Commitment</h2>
        </div>

        <p>
          At Innovateria (accessible from https://innovateria.in), one of our main priorities is the privacy of our visitors and clients. This Privacy Policy document outlines the types of information collected and how we utilize and protect it.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Information We Collect</h3>
        <p>
          When you fill out a contact form, request a quote, or interact with our software, we may request your Name, Email address, Phone number, and project requirement details.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">How We Use Your Information</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>Provide, operate, and maintain our software services and client portals</li>
          <li>Improve, personalize, and expand our software applications</li>
          <li>Understand and analyze how you interact with our platforms</li>
          <li>Develop new software products, features, and functionality</li>
          <li>Communicate with you regarding project updates, security alerts, and technical support</li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">Data Security</h3>
        <p>
          We employ industry-standard encryption protocols (SSL/TLS), firewalls, and secure access controls to ensure your client data and proprietary project files remain confidential and protected against unauthorized access.
        </p>
      </div>
    </div>
  );
}
