import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  BookOpen,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/_appLayout/publicdetails/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicDetails />;
}

const PublicDetails = () => {
  const handleBack = () => {
    window.history.back();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      value: "mail@mrgroupofcolleges.com",
      link: "mailto:mail@mrgroupofcolleges.com",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      value: "90510 44044 / 90510 22022",
      link: "tel:+919051044044",
    },
    {
      icon: MapPin,
      title: "College Address",
      value:
        "Taki Road, Near Champadali More, (Opposite Karmatritha Building), Barasat, Kolkata - 700124",
      link: null,
    },
  ];

  const collegeStats = [
    {
      icon: Users,
      title: "Students Enrolled",
      value: "5000+",
      description: "Active students across courses",
    },
    {
      icon: BookOpen,
      title: "Courses Offered",
      value: "50+",
      description: "UG, PG & Diploma programs",
    },
    {
      icon: Globe,
      title: "Establishment",
      value: "2005",
      description: "Years of educational excellence",
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
              <Globe className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Public Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">MR</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                MR Group of Colleges
              </h1>
              <p className="text-slate-400 text-lg mt-2">
                Excellence in Education Since 2005
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          {/* College Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {collegeStats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-700/30 rounded-xl p-6 text-center border border-slate-600 hover:border-blue-400/30 transition-all duration-200"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <h3 className="text-slate-300 font-semibold text-sm mb-2">
                  {stat.title}
                </h3>
                <p className="text-slate-400 text-xs">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {/* About College */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                About MR Group of Colleges
              </h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  MR Group of Colleges is a premier educational institution
                  committed to providing quality education and shaping the
                  future of young minds. Established in 2005, we have been at
                  the forefront of academic excellence in West Bengal.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our institution offers a wide range of undergraduate,
                  postgraduate, and diploma programs across various disciplines,
                  ensuring comprehensive educational opportunities for students
                  from diverse backgrounds.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Contact Information
              </h2>
              <div className="grid gap-4">
                {contactInfo.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                      <contact.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {contact.title}
                      </h3>
                      {contact.link ? (
                        <a
                          href={contact.link}
                          className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-slate-300 text-sm">
                          {contact.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Campus Facilities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Campus Facilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Modern Classrooms with Digital Learning Tools",
                  "Well-equipped Laboratories for Practical Training",
                  "Extensive Library with Digital Resources",
                  "Computer Centers with High-speed Internet",
                  "Sports Complex and Recreation Facilities",
                  "Cafeteria with Hygienic Food Services",
                  "Medical Room with First Aid Facilities",
                  "Transportation Services Available",
                ].map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-300 text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic Programs */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Academic Programs
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                    <h3 className="text-white font-semibold mb-3 text-sm">
                      Undergraduate
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• B.A. (Bachelor of Arts)</li>
                      <li>• B.Sc. (Bachelor of Science)</li>
                      <li>• B.Com. (Bachelor of Commerce)</li>
                      <li>• BBA (Bachelor of Business Administration)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                    <h3 className="text-white font-semibold mb-3 text-sm">
                      Postgraduate
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• M.A. (Master of Arts)</li>
                      <li>• M.Sc. (Master of Science)</li>
                      <li>• M.Com. (Master of Commerce)</li>
                      <li>• MBA (Master of Business Administration)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                    <h3 className="text-white font-semibold mb-3 text-sm">
                      Diploma Courses
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Computer Applications</li>
                      <li>• Business Management</li>
                      <li>• Technical Courses</li>
                      <li>• Vocational Training</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Office Hours */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Office Hours & Administration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">Working Hours</h3>
                  </div>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="text-white">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="text-white">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-red-400">Closed</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-5 h-5 text-green-400" />
                    <h3 className="text-white font-semibold">
                      Admission Enquiry
                    </h3>
                  </div>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p>Admissions open for academic year 2024-25</p>
                    <p className="text-blue-400">Contact: 90510 44044</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Visit campus for detailed counseling and guidance
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Contact Section */}
          <div className="mt-12 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Quick Contact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-3">
                  For admissions, course information, or any other queries, feel
                  free to contact our administration office during working
                  hours.
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-400">
                    Email:{" "}
                    <span className="text-blue-400">
                      mail@mrgroupofcolleges.com
                    </span>
                  </p>
                  <p className="text-slate-400">
                    Phone:{" "}
                    <span className="text-green-400">
                      90510 44044 / 90510 22022
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <a
                  href="mailto:mail@mrgroupofcolleges.com"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-dblue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-dblue-700 transition-all duration-200"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDetails;
