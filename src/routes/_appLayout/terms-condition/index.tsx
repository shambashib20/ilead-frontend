import { createFileRoute } from "@tanstack/react-router";
import { Shield, ArrowLeft, FileText, Mail } from "lucide-react";

export const Route = createFileRoute("/_appLayout/terms-condition/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TermsAndConditions />;
}

const TermsAndConditions = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Legal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">
              Terms and Conditions
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-slate-300 leading-relaxed">
              By accessing this webpage, you are agreeing to be bound by these
              Terms and Conditions ("Terms") in a legally binding agreement
              between us ("Merchant" or "us" or "we" or "our") and the User
              ("you" or "your"). Please read these Terms carefully before
              accessing or using the Website. If you do not agree to the Terms,
              you may not access the Platform.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              We reserve the right to update and change the Terms and Conditions
              by posting updates and changes to the Platform. You are advised to
              check the Terms and Conditions from time to time for any updates
              or changes that may impact you. If at any point such amendments
              are not acceptable to you, we advise you to cease using the
              Platform at such time.
            </p>
          </section>

          <div className="grid gap-12">
            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                ELIGIBILITY
              </h2>
              <p className="text-slate-300 leading-relaxed">
                You hereby represent and warrant that you have the right, power,
                and authority to agree to the Terms, to become a party to a
                legally binding agreement and to perform your obligations here
                under.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                DEFINITIONS
              </h2>
              <div className="space-y-4">
                {[
                  {
                    term: "Payment Instrument",
                    definition:
                      "Includes credit card, debit card, bank account, prepaid payment instrument, Unified Payment Interface (UPI), Immediate Payment Service (IMPS) or any other methods of payments which shall be developed or added or deployed by banks and financial institutions from time to time.",
                  },
                  {
                    term: "Platform",
                    definition:
                      "Refers to the website or platform where the Merchant offers its products or services and where the Transaction may be initiated.",
                  },
                  {
                    term: "Transaction",
                    definition:
                      "Shall refer to the order or request placed by the User with the Merchant to purchase the products and/or services listed on the Platform by paying the Transaction Amount to the Merchant.",
                  },
                  {
                    term: "Transaction Amount",
                    definition:
                      "Shall mean the amount paid by the User in connection with a Transaction.",
                  },
                  {
                    term: "User/Users",
                    definition:
                      "Means any person availing the products and/or services offered on the Platform.",
                  },
                  {
                    term: "Website",
                    definition:
                      "Shall mean www.instamojo.com or the mobile application.",
                  },
                ].map((item, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="text-blue-400 font-semibold mb-1">
                      {item.term}
                    </h3>
                    <p className="text-slate-300 text-sm">{item.definition}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Merchant's Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                MERCHANT'S RIGHTS
              </h2>
              <p className="text-slate-300 leading-relaxed">
                You agree that we may collect, store, and share the information
                provided by you in order to deliver the products and/or services
                availed by you on our Platform and/or contact you in relation to
                the same.
              </p>
            </section>

            {/* Your Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                YOUR RESPONSIBILITIES
              </h2>
              <p className="text-slate-300 leading-relaxed">
                You agree to provide us with true, complete and up-to-date
                information about yourself as may be required for the purpose of
                completing the Transactions. This information includes but is
                not limited to the personal details such as name, email address,
                phone number, delivery address, age, and gender (or any other
                information that we may deem necessary for us to fulfil the
                Transaction) as well as the accurate payment information
                required for the transaction.
              </p>
            </section>

            {/* Prohibited Actions */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                PROHIBITED ACTIONS
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  You may not access or use the Platform for any purpose other
                  than that for which we make the Platform available. The
                  Platform may not be used in connection with any commercial
                  endeavors except those that are specifically endorsed or
                  approved by us.
                </p>
                <p className="text-slate-300 font-semibold">
                  As a User of the Platform, you agree not to:
                </p>
                <div className="grid gap-3">
                  {[
                    "Systematically retrieve data or other content from the Platform to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.",
                    "Make any unauthorized use of the Platform, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.",
                    "Circumvent, disable, or otherwise interfere with security-related features of the Platform.",
                    "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.",
                    "Make improper use of our support services or submit false reports of abuse or misconduct.",
                    "Engage in any automated use of the system, such as using scripts to send comments or messages.",
                    "Interfere with, disrupt, or create an undue burden on the Platform or the networks or services connected to the Platform.",
                    "Attempt to impersonate another user or person or use the username of another user.",
                    "Use any information obtained from the Platform in order to harass, abuse, or harm another person.",
                    "Use the Platform as part of any effort to compete with us or otherwise use the Platform for any revenue-generating endeavor.",
                    "Decipher, decompile, disassemble, or reverse engineer any of the software comprising the Platform.",
                    "Attempt to bypass any measures of the Platform designed to prevent or restrict access.",
                    "Harass, annoy, intimidate, or threaten any of our employees or agents.",
                    "Copy or adapt the Platform's software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.",
                    "Upload or transmit viruses, Trojan horses, or other material that interferes with any party's use of the Platform.",
                    "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Platform.",
                    "Use the Platform in a manner inconsistent with any applicable laws or regulations.",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                LIMITATION OF LIABILITY
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  The User agrees that the only recourse that the User has in
                  the event of receiving a defective product and/or deficiency
                  in service or a product and/or service which does not match
                  the provided description is to initiate the refund process
                  which will be subject to the terms for refund under this
                  agreement.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  We hereby expressly disclaim any liability to them for any
                  losses. The User shall indemnify and hold harmless the
                  Merchant and its affiliates, agents and representatives from
                  and against any and all claims, demands, causes of action,
                  obligations, liabilities, losses, damages, injuries, costs and
                  expenses incurred or sustained by reason of or arising out of
                  any breach or alleged breach of any of the terms herein by the
                  User.
                </p>
              </div>
            </section>

            {/* Guidelines for Reviews */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                GUIDELINES FOR REVIEWS
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  We may provide you areas on the Platform to leave reviews or
                  ratings. When posting a review, you must comply with the
                  following criteria:
                </p>
                <div className="grid gap-3">
                  {[
                    "You should have firsthand experience with the person/entity being reviewed.",
                    "Your reviews should not contain offensive profanity, or abusive, racist, offensive, or hate language.",
                    "Your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability.",
                    "Your reviews should not contain references to illegal activity.",
                    "You should not be affiliated with competitors if posting negative reviews.",
                    "You should not make any conclusions as to the legality of conduct.",
                    "You may not post any false or misleading statements.",
                    "You may not organize a campaign encouraging others to post reviews, whether positive or negative.",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  We may accept, reject, or remove reviews in our sole
                  discretion. We have absolutely no obligation to screen reviews
                  or to delete reviews, even if anyone considers reviews
                  objectionable or inaccurate.
                </p>
              </div>
            </section>

            {/* Governing Laws & Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                GOVERNING LAWS & DISPUTE RESOLUTION
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Please note that these terms of use, their subject matter and
                  their formation, are governed by the laws of India. You and we
                  both agree that the courts of India will have exclusive
                  jurisdiction over any dispute.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Any dispute or claim arising out of or in connection with or
                  relating to these Terms or their breach, termination or
                  invalidity hereof ("Dispute") shall be referred to and finally
                  resolved by arbitration in Bengaluru in accordance with the
                  Arbitration and Conciliation Act, 1996.
                </p>
              </div>
            </section>

            {/* Grievance Redressal */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                GRIEVANCE REDRESSAL
              </h2>
              <p className="text-slate-300 leading-relaxed">
                You agree that if you have any question or complaint with regard
                to any product and/or service availed on our Platform, or
                pertaining to the Transaction, including but not limited to,
                double debit of Transaction Amount, fraudulent Transaction,
                unauthorized Transaction, refund requests, etc., you may reach
                out to our support team.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                DISCLAIMER
              </h2>
              <div className="space-y-4">
                {[
                  "That upon initiating a Transaction, you as a User are entering into a legally binding and enforceable contract with us to purchase the products and/or services.",
                  "That you shall provide accurate payment details to the secure payment system for making purchase on the Platform.",
                  "That all payments undertaken by you are subject to your own risk and volition.",
                  "If you receive a User identification code, order ID, password or any other piece of information as part of our security procedures, you must treat such information as confidential.",
                  "The content on our Platform is provided for general information only.",
                  "Where our Platform contains links to other websites and resources provided by third parties, these links are provided for your information only.",
                  "This Platform includes information and materials uploaded by other Users of the Platform.",
                  "We do not guarantee that our Platform will be secure or free from bugs or viruses.",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Questions?</h3>
            </div>
            <p className="text-slate-300 text-sm">
              If you have any questions about these Terms and Conditions, please
              contact our legal team at{" "}
              <a
                href="mailto:legal@novalaunch.com"
                className="text-blue-400 hover:text-blue-300"
              >
                legal@novalaunch.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
