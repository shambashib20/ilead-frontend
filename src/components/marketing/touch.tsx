


function Touch() {
  return (
    <section className="touch">
      <div className="container">
        <div className="content">
          <h6 className="badge fade-up">
            <i className="fas fa-link"></i> Connect With Us
          </h6>
          <h4 className="fade-up text-[28px] font-[family-name:var(--font-display-semibold)]  leading-tight">
          <h4
            className="fade-up text-[20px] md:text-[28px] font-[family-name:var(--font-display-semibold)]  leading-tight max-w-[300px] md:max-w-full w-full md:w-full "
            style={{ marginInline: "auto" }}
          >
            Manage Leads, Calls and Follow-Ups without the Mess
          </h4>
          <p className="fade-up">
            Capture leads instantly, manage calls and Follow-ups efficiently
            without confusion or missed chances. With ETC CRM, organize every
            lead, streamline follow-ups and convert inquiries into real business
            growth — all from one powerful, easy-to-use centralized platform.
          </p>
        </div>

        <div className="form">
          <form action="">
            <div className="grid">
              <label className="fade-up">
                Name
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Your full name" />
              </label>
              <label className="fade-up">
                Email
                <i className="fas fa-envelope icon"></i>
                <input type="email" placeholder="your.email@example.com" />
              </label>
              <label className="fade-up">
                Phone No.
                <i className="fas fa-phone icon"></i>
                <input type="tel" placeholder="+1 (123) 456-7890" />
              </label>
              <label className="fade-up">
                City
                <i className="fas fa-city icon"></i>
                <input type="text" placeholder="Your city" />
              </label>
              <label className="fade-up">
                Message
                <i className="fas fa-comment icon"></i>
                <textarea placeholder="Tell us about your project and photo requirements..."></textarea>
              </label>
            </div>
            <div className="text-center">
              <button className="btn btn-primary zoom-in">
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Touch;
