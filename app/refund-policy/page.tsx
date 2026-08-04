import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | Innovateria',
  description: 'Refund and cancellation policy for software development services at Innovateria.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Client Guarantee
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Refund & <span className="text-gradient-brand">Cancellation Policy</span>
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 text-xs text-gray-300 leading-relaxed">
        <div className="flex items-center space-x-3 text-brand-500 pb-2 border-b border-white/10">
          <RefreshCw size={24} />
          <h2 className="text-lg font-bold text-white">Terms of Refund & Milestone Cancellation</h2>
        </div>

        <p>
          Innovateria takes immense pride in delivering high quality software engineering, mobile applications, and web development solutions. Because our services involve custom design, software development, and technical resource allocation, our refund policy is structured around project milestones:
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Milestone-Based Refund Terms</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
          <li>
            <strong className="text-white">Pre-Development Cancellation:</strong> If a client cancels a project prior to the commencement of design and development work, a full refund minus administrative processing fees will be issued.
          </li>
          <li>
            <strong className="text-white">In-Development Milestones:</strong> Once a project milestone has been completed, reviewed, and approved by the client, funds allocated to that milestone are non-refundable.
          </li>
          <li>
            <strong className="text-white">Custom Source Code & Licenses:</strong> Upon final delivery and transfer of source code or customized software licenses, payments are final.
          </li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">Resolution Process</h3>
        <p>
          If you encounter any technical issues, discrepancies, or scope questions during development, please reach out to our team at innovateria.in@gmail.com or +91 77629 74716 so we can address your concerns immediately.
        </p>
      </div>
    </div>
  );
}
