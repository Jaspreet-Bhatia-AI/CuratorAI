import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto text-on-surface"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-label-lg" aria-label="Go back to Home">
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Back to Home
      </Link>
      
      <h1 className="font-display-md md:font-display-lg text-primary mb-2 font-bold">Privacy Policy</h1>
      <p className="font-body-lg text-on-surface-variant mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 font-body-md leading-relaxed text-on-surface-variant">
        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">1. Information We Collect</h2>
          <p>
            When you use Curator AI, we collect only the information necessary to provide our service. 
            This includes account data (such as your email address when using Google Auth via Supabase) and your search history (saved to your personal cloud library).
          </p>
          <p className="mt-2 text-primary-container-on font-semibold bg-primary-container/20 p-3 rounded-lg border border-primary/20">
            <strong>Important Note on API Keys:</strong> Curator AI operates on a Bring Your Own Key (BYOK) model. 
            Your Google Gemini or Groq API keys are securely stored <strong>only locally</strong> on your device (in localStorage). 
            They are transmitted securely to our backend merely to proxy requests to the AI providers, but they are <strong>never</strong> logged, stored, or saved in our databases.
          </p>
        </section>

        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and maintain the Curator AI service (e.g., saving your generated curriculum roadmaps).</li>
            <li>To cache anonymized search queries in our <code>queries_cache</code> to improve response times for all users.</li>
            <li>To sync your offline media library with your cloud account across your devices.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">3. Third-Party Embeds & Services</h2>
          <p>
            Our service interfaces with third-party providers:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>YouTube:</strong> We use internal extraction tools to source audio/video. We do not embed standard YouTube trackers, but accessing public URLs is subject to YouTube's Privacy Guidelines.</li>
            <li><strong>Google Gemini / Groq:</strong> Your search queries are sent to these AI providers for processing. Please refer to their respective privacy policies regarding data retention of AI prompts.</li>
            <li><strong>Supabase:</strong> Our secure database and authentication provider.</li>
            <li><strong>Dicebear:</strong> Used for generating avatars. No personal data is shared with them.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">4. Cookies and Local Storage</h2>
          <p>
            Curator AI utilizes local storage and IndexedDB primarily for core functionality: storing your API keys locally, saving offline media files to your device, and maintaining secure login sessions. We do not use intrusive third-party advertising cookies.
          </p>
        </section>
        
        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">5. Data Deletion and Rights</h2>
          <p>
            You have the right to request the deletion of your account and all associated cloud data. You can delete items directly from the Library interface, or contact us to completely purge your account data.
          </p>
        </section>

        <section>
          <h2 className="font-title-lg text-on-surface font-bold mb-3">6. Contact Information</h2>
          <address className="not-italic bg-surface-container p-4 rounded-xl border border-outline-variant/30">
            <strong>Curator AI Operations</strong><br/>
            Email: <a href="mailto:privacy@curatorai.invalid" className="text-primary hover:underline">privacy@curatorai.invalid</a><br/>
            Business Entity: Curator Technologies LLC<br/>
            Jurisdiction: State of California, United States (Subject to CCPA)
          </address>
        </section>
      </div>
    </motion.div>
  );
}
