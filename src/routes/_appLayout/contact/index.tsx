// app/routes/_appLayout/contact.tsx (or wherever your TanStack route lives)
import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Globe,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_appLayout/contact/")({
  component: RouteComponent,
});

function RouteComponent(): React.JSX.Element {
  return (
    <ContactUsSection
      heading="Contact Us"
      blurb="Have questions or need assistance? Fill the form and we’ll get back to you."
      address={{
        line1: "2047, Silver Business Point, Near VIP Circle",
        line2: "Uttran, Surat — 394105",
      }}
      phones={["+91 9913299890", "+91 9913299865"]}
      emails={[
        "contact@365leadmanagement.com",
        "support@365leadmanagement.com",
      ]}
      socials={[{ label: "Website", href: "https://example.com" }]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
    />
  );
}

/* ---------- Types ---------- */

type Address = {
  line1: string;
  line2?: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type ContactUsProps = {
  heading?: string;
  blurb?: string;
  address?: Address;
  phones?: string[];
  emails?: string[];
  socials?: SocialLink[];
  mapEmbedUrl?: string;
};

type ContactFormData = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

/* ---------- Component ---------- */

export default function ContactUsSection({
  heading = "Contact Us",
  blurb = "We’re here to help you make the most of our product — let’s connect.",
  address = {
    line1: "Company Address line 1",
    line2: "City, State, ZIP",
  },
  phones = [],
  emails = [],
  socials = [],
  mapEmbedUrl,
}: ContactUsProps): React.JSX.Element {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<
      string,
      FormDataEntryValue
    >;

    const cleaned: ContactFormData = {
      name: (payload.name as string) || "",
      phone: (payload.phone as string) || "",
      email: (payload.email as string) || "",
      message: (payload.message as string) || "",
    };

    // Hook this to your API call
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(cleaned) })
    // For demo:
    // eslint-disable-next-line no-console
    console.log("Contact form submitted:", cleaned);
    alert("Thanks! We’ll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <section className="relative">
      {/* Top banner */}
      <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-blue-900/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            {heading}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            {blurb}
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-blue-200/60 bg-white/80 backdrop-blur-sm shadow-sm dark:border-blue-800/40 dark:bg-slate-900/60">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquareText className="h-5 w-5" />
                Get in Touch
              </h2>
              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Mobile Number
                    </label>
                    <div className="mt-1 flex rounded-xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-700 dark:bg-slate-900">
                      <span className="inline-flex items-center px-3 text-slate-500">
                        +91
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="98765 43210"
                        className="w-full rounded-r-xl bg-transparent px-3 py-2 text-slate-900 outline-none dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="How can we help?"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm transition active:scale-[0.99] hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Send className="h-4 w-4" />
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-blue-200/60 bg-white/80 backdrop-blur-sm shadow-sm dark:border-blue-800/40 dark:bg-slate-900/60">
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Address
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {address?.line1}
                  {address?.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                </p>
              </div>

              {phones.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Phone className="h-5 w-5" /> Phone
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {phones.map((p) => (
                      <li key={p}>
                        <a
                          href={`tel:${p.replace(/\s/g, "")}`}
                          className="hover:underline"
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {emails.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Mail className="h-5 w-5" /> E-mail
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {emails.map((m) => (
                      <li key={m}>
                        <a
                          href={`mailto:${m}`}
                          className="hover:underline break-all"
                        >
                          {m}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {socials.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Globe className="h-5 w-5" /> Social Media
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {socials.map((s) => {
                      const Icon = s.icon ?? Globe;
                      return (
                        <a
                          key={s.href}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200/60 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-blue-50 dark:border-blue-800/40 dark:bg-slate-800 dark:text-slate-200 hover:dark:bg-slate-700"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{s.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional Map */}
        {mapEmbedUrl && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200/60 bg-white/80 shadow-sm dark:border-blue-800/40 dark:bg-slate-900/60">
            <div className="aspect-[16/9] w-full">
              <iframe
                title="Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
