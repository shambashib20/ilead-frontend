import { useState, useEffect } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

function Faq() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const faqItems: AccordionItem[] = [
    {
      question: "What is ETC CRM and how does it help businesses in India?",
      answer:
        "ETC CRM is a modern, cloud-based CRM software in India designed to simplify lead management, customer communication and sales tracking for growing businesses. Our platform brings all your leads, calls, emails, WhatsApp chats, follow-ups and team activities into one centralized dashboard.Instead of juggling spreadsheets or switching between multiple tools, ETC CRM provides a structured system that helps businesses respond faster, track better and close more deals efficiently.",
    },
    {
      question:
        "Why is ETC CRM considered one of the best CRM software in India?",
      answer:
        "ETC CRM is recognized among the best CRM software in India because it combines simplicity with powerful automation. We focus on solving real business problems — missed follow-ups, scattered customer data, untracked calls and unclear sales pipelines.With smart reminders, real-time reporting, WhatsApp integration and customizable workflows, ETC CRM ensures your team works in an organized and accountable manner while improving overall productivity",
    },
    {
      question: "What industries can benefit from ETC CRM?",
      answer:
        "Our customer relationship management software is designed for multiple industries including real estate, education, healthcare, finance, travel, IT services, retail, and B2B sales organizations. Any business that handles inquiries, manages prospects, or nurtures customer relationships can benefit from our CRM solution in India.Whether you generate leads through websites, ads, calls, or social media, ETC CRM helps you manage them systematically.",
    },
    {
      question: "How does ETC CRM capture and manage leads?",
      answer:
        "ETC CRM automatically captures leads from multiple sources such as website forms, emails, phone calls and WhatsApp. All inquiries are stored in one centralized database, ensuring no opportunity is lost. This CRM management software allows you to assign leads to team members, set priorities, track progress and monitor conversion stages in a structured sales pipeline.",
    },
    {
      question: "Is ETC CRM cloud-based and secure?",
      answer:
        "Yes, ETC CRM is a secure, cloud-based CRM software in India. Your data is protected through encrypted systems, secure login access and regular backups. Being cloud-based also means you can access your CRM from anywhere, enabling remote work and seamless collaboration.",
    },
    {
      question: "Can ETC CRM integrate with WhatsApp and other tools?",
      answer:
        "Yes, ETC CRM offers WhatsApp Business API integration along with email and other third-party tool integrations. This allows businesses to communicate directly with customers while automatically logging conversations into the system.Our goal is to make ETC CRM a complete customer relationship management software that connects with your existing workflow.",
    },
    {
      question: "Is ETC CRM suitable for small and medium businesses?",
      answer:
        "Absolutely. ETC CRM is built to be scalable. Startups and SMEs can use essential features to manage leads efficiently, while growing enterprises can leverage advanced automation and analytics. Our CRM management software in India adapts as your business expands.",
    },
    {
      question: "Does ETC CRM help reduce manual work?",
      answer:
        "Yes. Manual data entry, scattered spreadsheets, and missed updates slow down teams. ETC CRM automates repetitive tasks, centralizes data and organizes workflows. This makes it one of the best CRM software in India for businesses aiming to improve efficiency without increasing operational costs.",
    },
    {
      question: "How customizable is ETC CRM?",
      answer:
        "ETC CRM offers customizable sales stages, fields, dashboards and workflows. Every business has a unique process and our CRM solution ensures you can tailor the system to match your operational needs",
    },
    {
      question: "Can multiple team members use ETC CRM?",
      answer:
        "Yes. ETC CRM supports multi-user access with role-based permissions. Managers can monitor performance, assign leads and track activities, while team members can manage their tasks efficiently within this structured CRM software.",
    },
    {
      question: "How does ETC CRM help improve customer relationships?",
      answer:
        "Our customer relationship management software maintains a complete communication history for every client. This helps your team understand customer needs, respond personally and build long-term trust instead of transactional interactions.",
    },
    {
      question: "Is ETC CRM easy to use?",
      answer:
        "Yes. ETC CRM is built with a clean, intuitive interface so that your team can start using it with minimal training. Unlike overly complicated systems, our CRM solution focuses on simplicity and efficiency.",
    },
    {
      question: "How quickly can we implement ETC CRM?",
      answer:
        "Implementation is smooth and guided by our support team. Most businesses can get started quickly, making ETC CRM a practical and efficient CRM solution in India for immediate deployment.",
    },
    {
      question: "What business problems does ETC CRM solve?",
      answer:
        "ETC CRM eliminates lost leads, missed follow-ups, scattered data, unclear pipelines, and poor coordination. As one of the best CRM software in India, it brings structure, visibility and automation to your sales operations.",
    },
    {
      question:
        "Why should we choose ETC CRM over other CRM software in India?",
      answer: `ETC CRM combines affordability, powerful automation, seamless integrations and real-time analytics into one centralized platform. Our focus is not just on managing data but on helping businesses grow systematically. If you are looking for a reliable, scalable, and easy-to-use CRM solution in India, ETC CRM is built to support your long-term success.`,
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
          <h4>Frequently Asked Questions</h4>
        </div>

        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`accord ${activeIndex === index ? "active" : ""}`}
            >
              <h5 onClick={() => handleAccordionClick(index)}>
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
              </h5>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
