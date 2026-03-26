function ServicesSec() {
  return (
    <section className="  bg-white" style={{ paddingBlock: "50px" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center " style={{ marginBottom: "40px" }}>
          <h6 className="badge fade-up">
            <i className="fas fa-link"></i> Service We Are Offering
          </h6>
          <h2 className="text-[20px]  md:text-[28px]  font-[family-name:var(--font-display-semibold)] text-gray-900 leading-tight">
            We Provided Everything You Need in a Smart CRM Platform
            <br />
          </h2>
          <p
            className="text-[20px]  md:text-3xl font-[family-name:var(--font-text)] inline-block mt-1"
            style={{ marginTop: "2px" }}
          >
            Smart Features That Drive Conversions
          </p>
        </div>

        {/* Service Cards */}
        <div className="flex flex-wrap gap-10 justify-center mt-20">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSec;

interface Service {
  icon: string;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: "/img/Contact & Customer Management.png",
    title: "Contact & Customer Management",
    description:
      "Centralize and organize all customer data in one secure platform for easy and smarter relationship management.",
  },
  {
    icon: "img/Lead Inquiry Management.png",
    title: "Lead/Inquiry Management",
    description:
      "Capture, track and nurture every lead efficiently to ensure faster follow-ups and higher conversion rates.",
  },
  {
    icon: "img/Email & Calendar Integration.png",
    title: "Email & Calendar Integration",
    description:
      "Sync emails and schedules seamlessly to streamline communication without switching platforms.",
  },
  {
    icon: "img/Sales Analytics & Insights.png",
    title: "Sales Analytics & Insights",
    description:
      "Gain real-time reports and performance insights to improve data-driven decisions and revenue growth.",
  },
  {
    icon: "img/Multi-Platform Connectivity.png",
    title: "Multi-Platform Connectivity",
    description:
      "Connect effortlessly with multiple channels and tools to manage customer interactions from a unified dashboard.",
  },
  {
    icon: "img/WhatsApp Business API Integration.png",
    title: "WhatsApp Business API Integration",
    description:
      "Engage customers instantly with automated messaging and updates through direct WhatsApp communication.",
  },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className="flex justify-center
     items-center text-center bg-white rounded-xl shadow-[0_0_20px_10px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_0_20px_10px_rgba(0,0,0,0.1)] transition-shadow duration-300 p-6 flex-1 min-w-[300px] min-h-[200px] cursor-pointer "
      style={{ paddingBlock: "40px" }}
    >
      <div
        className="flex flex-col items-center text-center gap-5"
        style={{ paddingInline: "35px" }}
      >
        <div
          className=" flex items-center justify-center flex-shrink-0"
          style={{ marginBottom: "5px" }}
        >
          <img
            src={service.icon || ""}
            alt={service.title.split(" ").join("-").toLowerCase()}
          />
        </div>
        <h3
          className="font-bold text-gray-900 text-lg leading-tight mb-2 "
          style={{ paddingInline: "0px", width: "200px" }}
        >
          {service.title}
        </h3>

        <p
          className="text-gray-500 leading-relaxed "
          style={{ minHeight: "60px", fontSize: "14px" }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}
