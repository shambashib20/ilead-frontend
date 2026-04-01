import { useState } from "react";
import { useSubmitMarketingLead } from "@/features/leads/hooks/useSubmitMarketingLead";
import type { MarketingLeadPayload } from "@/features/leads/services/LeadSubmission.service";

const EMPTY_FORM: MarketingLeadPayload = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  comment: "",
};

function Touch() {
  const [form, setForm] = useState<MarketingLeadPayload>(EMPTY_FORM);
  const { submitLead, isSubmitting, isSuccess, reset } =
    useSubmitMarketingLead();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitLead(form);
      setForm(EMPTY_FORM);
    } catch {
      // error already surfaced via toast in the hook's onError
    }
  };

  const handleSendAnother = () => {
    reset();
    setForm(EMPTY_FORM);
  };

  return (
    <section className="touch">
      <div className="container">
        <div className="content">
          <h6 className="badge fade-up">
            <i className="fas fa-link"></i> Connect With Us
          </h6>
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
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <i className="fas fa-check-circle text-green-400 text-4xl"></i>
              <p className="text-lg font-semibold">Message sent successfully!</p>
              <p className="text-sm text-muted-foreground">
                We'll get back to you shortly.
              </p>
              <button className="btn btn-primary mt-2" onClick={handleSendAnother}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid">
                <label className="fade-up">
                  Name
                  <i className="fas fa-user icon"></i>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>
                <label className="fade-up">
                  Email
                  <i className="fas fa-envelope icon"></i>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </label>
                <label className="fade-up">
                  Phone No.
                  <i className="fas fa-phone icon"></i>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </label>
                <label className="fade-up">
                  City
                  <i className="fas fa-city icon"></i>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Your city"
                  />
                </label>
                <label className="fade-up">
                  Message
                  <i className="fas fa-comment icon"></i>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Tell us about your project and photo requirements..."
                  ></textarea>
                </label>
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary zoom-in"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Touch;
