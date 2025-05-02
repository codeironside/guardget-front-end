import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: April 29, 2023
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              At Guardget, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our device protection service.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree
              with the terms of this privacy policy, please do not access the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Personal identification information (Name, email address, phone
                number)
              </li>
              <li>
                Device information (IMEI numbers, serial numbers, device models)
              </li>
              <li>Location data (when reporting a lost or stolen device)</li>
              <li>
                Payment information (processed through secure third-party
                payment processors)
              </li>
              <li>
                Communications between you and Guardget (customer support
                inquiries, feedback, and other communications)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Verify device ownership and status</li>
              <li>Respond to comments, questions, and requests</li>
              <li>
                Send technical notices, updates, security alerts, and support
                messages
              </li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our services
              </li>
              <li>
                Detect, investigate, and prevent fraudulent transactions and
                other illegal activities
              </li>
              <li>
                Personalize and improve the services and provide content or
                features that match user profiles
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Sharing of Information
            </h2>
            <p className="mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>With Law Enforcement:</strong> We may share device
                information with law enforcement agencies when a device is
                reported stolen or missing, to assist in recovery efforts.
              </li>
              <li>
                <strong>With Service Providers:</strong> We may share your
                information with third-party vendors, consultants, and other
                service providers who need access to such information to carry
                out work on our behalf.
              </li>
              <li>
                <strong>For Legal Reasons:</strong> We may disclose your
                information if we believe it is necessary to comply with any
                applicable law, regulation, legal process, or governmental
                request.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information with your consent or at your direction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process. However, despite our safeguards and
              efforts to secure your information, no electronic transmission
              over the Internet or information storage technology can be
              guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The right to access the personal information we have about you
              </li>
              <li>
                The right to request that we correct any inaccurate personal
                information
              </li>
              <li>
                The right to request that we delete your personal information
              </li>
              <li>
                The right to withdraw consent at any time, where we rely on your
                consent to process your information
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date at the top of this Privacy
              Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please
              contact us at:
              <br />
              <a
                href="mailto:privacy@guardget.com"
                className="text-primary hover:underline"
              >
                privacy@guardget.com
              </a>
            </p>

            <Link href="/contact">
              <Button>Contact Us</Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
