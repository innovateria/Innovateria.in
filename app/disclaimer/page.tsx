import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer | Innovateria',
  description: 'Legal disclaimer for Innovateria web application and software services.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Legal Terms
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Website <span className="text-gradient-brand">Disclaimer</span>
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 text-xs text-gray-300 leading-relaxed">
        <div className="flex items-center space-x-3 text-brand-500 pb-2 border-b border-white/10">
          <Shield size={24} />
          <h2 className="text-lg font-bold text-white">General Information & Warranties</h2>
        </div>

        <p>
          All the information on this website (https://innovateria.in) is published in good faith and for general information purpose regarding Innovateria&apos;s software development, mobile application development, and digital marketing services. Innovateria makes no warranties about the completeness, reliability, or absolute accuracy of this information.
        </p>

        <p>
          Any action you take upon the information you find on this website is strictly at your own risk. Innovateria will not be liable for any losses or damages in connection with the use of our website or software demonstrations.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">External Hyperlinks</h3>
        <p>
          From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. Links to external websites do not imply a recommendation for all the content found on these sites.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Payment Security Advisory</h3>
        <p>
          Payments for software development or technical consulting must only be made using the official bank details or secure online payment gateway links provided directly by authorized Innovateria representatives (+91 77629 74716 / innovateria.in@gmail.com).
        </p>
      </div>
    </div>
  );
}
