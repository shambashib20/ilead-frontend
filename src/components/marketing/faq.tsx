import { useState, useEffect } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

function Faq() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const faqItems: AccordionItem[] = [
    {
      question: "What kind of photos do I need to upload?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus aut ullam exercitationem minus vitae. Minima dignissimos, provident tempore assumenda ipsum odit consectetur quis nam est exercitationem officiis libero cum sapiente!",
    },
    {
      question: "How do I integrate etcCRM with my existing tools?",
      answer:
        "Our platform offers seamless integration with popular tools like Slack, Google Workspace, Microsoft Office, and many more through our API. Setup is straightforward with our step-by-step integration guide.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start. After the trial, you can choose from our flexible pricing plans that scale with your business needs.",
    },
    {
      question: "What kind of customer support do you provide?",
      answer:
        "We provide 24/7 customer support through multiple channels including live chat, email, and phone. All our customers also get access to comprehensive documentation and video tutorials.",
    },
    {
      question: "Can I customize etcCRM for my specific business needs?",
      answer:
        "Absolutely! etcCRM is highly customizable. You can create custom fields, workflows, reports, and dashboards tailored to your specific business processes. Our enterprise plans even include custom development options.",
    },
    {
      question: "How secure is my data with etcCRM?",
      answer:
        "We take data security seriously. Our platform uses enterprise-grade encryption, regular security audits, and complies with GDPR and other privacy regulations. We also offer advanced security features like two-factor authentication and role-based access control.",
    },
  ];

  // Handle accordion click - open one, close others
  const handleAccordionClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  // Initialize first accordion as open on component mount
  useEffect(() => {
    setActiveIndex(0);
  }, []);

  return (
    <section className="faq">
      <div className="container">
        <div className="content text-center">
          <h6 className="badge">FAQ</h6>
          <h3>Frequently Asked Questions</h3>
          <p>
            No switching tabs, no copy-paste chaos. etcCRM fits into your
            workflow.
          </p>
        </div>

        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`accord ${activeIndex === index ? "active" : ""}`}
            >
              <h3 onClick={() => handleAccordionClick(index)}>
                {item.question}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-up"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </span>
              </h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
