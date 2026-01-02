


function Touch() {
  return (
    <section className="touch">
      <div className="container">
        <div className="content">
          <h6 className="badge fade-up">
            <i className="fas fa-link"></i> Connect With Us
          </h6>
          <h3 className="fade-up">What kind of photos do I need to upload?</h3>
          <p className="fade-up">
            Submit your details and our team will guide you through the photo
            requirements for your specific needs.
          </p>

          <div className="photo-hint fade-up">
            <i className="fas fa-info-circle"></i>
            <span className="hint-text">
              View photo requirements & guidelines
            </span>
          </div>
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
