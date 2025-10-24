import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaywallMiniProps = {
  title?: string;
  message?: string;
  onUpgrade: () => void;
  onClose?: () => void;
  ctaLabel?: string;
  secondaryLabel?: string;
  // Optional: surface a tiny reason like "limit reached" or "pro feature"
  hint?: string;
};

export default function PaywallUI({}: PaywallMiniProps) {
  return (
    <div className="container mx-auto px-4 pt-12 py-4 max-w-6xl h-[400px] overflow-y-auto">
      <header className="text-center mb-14 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Unlock Premium Content
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get unlimited access to all our premium features, exclusive content,
          and more with our flexible pricing plans.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-gradient-light dark:card-gradient-dark rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Basic
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Perfect for getting started
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              $9
            </span>
            <span className="text-gray-600 dark:text-gray-300">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Access to basic articles
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Limited downloads
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Standard support
            </li>
          </ul>
          <Button className="w-full">Get Started</Button>
        </div>

        <div className="relative card-gradient-light dark:card-gradient-dark rounded-2xl p-8 shadow-2xl transform scale-105 border-2 border-blue-500 animate-slide-up">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
              Most Popular
            </span>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              For power users and professionals
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              $19
            </span>
            <span className="text-gray-600 dark:text-gray-300">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Unlimited access to all content
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Unlimited downloads
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Priority support
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Early access to new features
            </li>
          </ul>
          <Button className="w-full">Get Started</Button>
        </div>

        <div className="card-gradient-light dark:card-gradient-dark rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Enterprise
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              For teams and organizations
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              $49
            </span>
            <span className="text-gray-600 dark:text-gray-300">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Everything in Pro
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Multiple user accounts
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Custom integrations
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Dedicated account manager
            </li>
          </ul>
          <Button className="w-full">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
