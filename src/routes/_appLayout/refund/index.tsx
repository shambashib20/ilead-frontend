import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  RefreshCw,
  XCircle,
  Mail,
  Clock,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/_appLayout/refund/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RefundCancellation />;
}

const RefundCancellation = () => {
  const handleBack = () => {
    window.history.back();
  };

  const refundPolicyPoints = [
    {
      icon: Clock,
      title: "3-Day Refund Window",
      description: "Requests must be submitted within 3 days of transaction",
    },
    {
      icon: Shield,
      title: "Product/Service Mismatch",
      description: "Refunds only if product doesn't match description",
    },
    {
      icon: RefreshCw,
      title: "Discretionary Approval",
      description: "We reserve the right to approve refund requests",
    },
    {
      icon: Mail,
      title: "Documentation Required",
      description: "Provide clear reasons and proof for refund requests",
    },
  ];

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
              <RefreshCw className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Refund Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <RefreshCw className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">
              Refund & Cancellation Policy
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Clear guidelines for transaction cancellations and refund requests
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          {/* Policy Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {refundPolicyPoints.map((point, index) => (
              <div
                key={index}
                className="bg-slate-700/30 rounded-xl p-6 border border-slate-600 hover:border-blue-400/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <point.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">
                    {point.title}
                  </h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {/* Transaction Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Transaction Agreement
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Upon completing a Transaction, you are entering into a legally
                binding and enforceable agreement with us to purchase the
                product and/or service. After this point the User may cancel the
                Transaction unless it has been specifically provided for on the
                Platform.
              </p>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Cancellation Policy
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  In cases where cancellation is specifically provided for on
                  the Platform, the cancellation will be subject to the terms
                  mentioned on the Platform. We shall retain the discretion in
                  approving any cancellation requests and we may ask for
                  additional details before approving any requests.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      <strong>Note:</strong> Cancellation is subject to
                      Platform-specific terms and our discretion. Additional
                      information may be required for approval.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Refund Eligibility
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Once you have received the product and/or service, the only
                  event where you can request for a replacement or a return and
                  a refund is if the product and/or service does not match the
                  description as mentioned on the Platform.
                </p>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    Refund Timeframe
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Any request for refund must be submitted within{" "}
                    <strong>three days</strong> from the date of the Transaction
                    or such number of days prescribed on the Platform, which
                    shall in no event be less than three days.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Request a Refund */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                How to Request a Refund
              </h2>
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed">
                  A User may submit a claim for a refund for a purchase made, by
                  raising a ticket or contacting us and providing a clear and
                  specific reason for the refund request, including the exact
                  terms that have been violated, along with any proof, if
                  required.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Methods */}
                  <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" />
                      Contact Methods
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">
                          Raise a Ticket:
                        </p>
                        <a
                          href="#"
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          Click here to raise a support ticket
                        </a>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Email:</p>
                        <a
                          href="mailto:seller+3be92c3a670d4d5988c17509c5601c03@instamojo.com"
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          seller+3be92c3a670d4d5988c17509c5601c03@instamojo.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Required Information */}
                  <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-400" />
                      Required Information
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Transaction ID",
                        "Clear reason for refund",
                        "Specific terms violated",
                        "Supporting proof/documentation",
                        "Contact information",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 text-slate-300 text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Approval Process */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Refund Approval Process
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Whether a refund will be provided will be determined by us,
                  and we may ask for additional details before approving any
                  requests. Our decision will be based on the information
                  provided and compliance with this policy.
                </p>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-200 text-sm font-semibold mb-1">
                        Processing Timeline
                      </p>
                      <p className="text-blue-200 text-sm">
                        Refund requests are typically processed within 5-7
                        business days after approval. The actual credit to your
                        account may take additional time depending on your
                        payment method and financial institution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Important Notes
              </h2>
              <div className="space-y-3">
                {[
                  "All refund requests are subject to verification and approval",
                  "Approval does not guarantee immediate refund - processing times apply",
                  "Digital products/services may have different refund conditions",
                  "Subscription-based services follow their specific cancellation terms",
                  "Chargebacks may result in account suspension",
                ].map((note, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300 text-sm">{note}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Support Section */}
          <div className="mt-12 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">
                Need Help with Refunds?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-3">
                  Contact our support team for assistance with refund requests
                  or if you have questions about our cancellation policy.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">
                    Email:{" "}
                    <span className="text-blue-400">
                      support@novalaunch.com
                    </span>
                  </p>
                  <p className="text-slate-400">
                    Response Time:{" "}
                    <span className="text-blue-400">Within 24 hours</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-600 transition-all duration-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;
