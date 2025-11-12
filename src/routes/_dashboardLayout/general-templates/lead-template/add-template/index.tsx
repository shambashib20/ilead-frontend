import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, MessageSquare, ArrowLeft } from "lucide-react";
import EmailPreview from "@/features/templates/components/EmailPreview";
import WhatsAppPreview from "@/features/templates/components/WhatsappPreview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/features/templates/hooks/useTemplateForm";
import EmailTemplateForm from "@/features/templates/components/EmailTemplateForm";
import WhatsappTemplateForm from "@/features/templates/components/WhatsappTemplateForm/WhatsappTemplateForm";
import SmsTemplateForm from "@/features/templates/components/SmsTemplateForm/SmsTemplateForm";

export const Route = createFileRoute(
  "/_dashboardLayout/general-templates/lead-template/add-template/"
)({
  component: TemplateBuilderPage,
});

type EmailValues = {
  title: string;
  subject: string;
  message: string; // rich html
  attachments: File[];
};

type WhatsappValues = {
  title: string;
  message: string;
  attachments: File[];
};

type SmsValues = {
  title: string;
  message: string;
  templateId: string;
};

export default function TemplateBuilderPage() {
  const [activeTab, setActiveTab] = useState("email");
  const navigate = useNavigate();
  const emailForm = useAppForm({
    defaultValues: {
      title: "",
      subject: "",
      message: "",
      attachments: [],
    } as EmailValues,
    onSubmit: async ({ value }: { value: EmailValues }) => {
      const payload = {
        type: "EMAIL",
        title: value.title,
        subject: value.subject,
        email_message: value.message, // ✅ rename as required
        attachments: value.attachments ?? [],
      };

      console.log("EMAIL payload →", payload);
    },
  });

  const whatsappForm = useAppForm({
    defaultValues: {
      title: "",
      message: "",
      attachments: [],
    } as WhatsappValues,

    onSubmit: async ({ value }: { value: WhatsappValues }) => {
      const payload = {
        type: "WHATSAPP",
        title: value.title,
        message: value.message,
        attachments: value.attachments ?? [],
      };

      console.log("WHATSAPP payload →", payload);
    },
  });

  const smsForm = useAppForm({
    defaultValues: { title: "", templateId: "" } as SmsValues,
    onSubmit: async ({ value }: { value: SmsValues }) => {
      const payload = {
        type: "SMS",
        title: value.title,
        message: value.message,
        sms_template_id: value.templateId, // ✅ rename as required
      };

      console.log("SMS payload →", payload);
    },
  });

  return (
    <section className="min-h-screen mt-7">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between bg-primary  shadow-lead rounded-sm mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Add Lead Template
        </h1>
        <Button
          variant="outline"
          onClick={()=>navigate({
            to: "/general-templates/lead-template"
          })}
          className="gap-2 w-fit bg-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div
        className={`grid ${activeTab === "sms" ? "" : "grid-cols-[1fr_420px]"} gap-7`}
      >
        {/* Form Section */}
        <div className="bg-primary shadow-lead rounded-sm p-5">
          <h2 className="font-medium mb-4 text-gray-900 dark:text-white">
            Select Template Type:
          </h2>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex gap-3 items-center justify-start bg-transparent p-0 mb-1">
              <TabsTrigger
                value="email"
                className="flex-none w-[160px] rounded-sm py-2 px-3 text-sm font-semibold border-2 border-gray-200 dark:border-gray-600 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-blue-500 dark:data-[state=inactive]:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600 transition-all duration-200 data-[state=active]:[border-image:[none] flex items-center gap-3"
              >
                <Mail size={18} className="dark:text-white" />
                <span className="hidden sm:inline dark:text-white ">Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="whatsapp"
                className="flex-none w-[160px] rounded-sm py-2 px-3 text-sm font-semibold border-2 border-gray-200 dark:border-gray-600 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-blue-500 dark:data-[state=inactive]:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600 transition-all duration-200 data-[state=active]:[border-image:[none] flex items-center gap-3"
              >
                <MessageCircle size={18} className="dark:text-white" />
                <span className="hidden sm:inline dark:text-white ">
                  WhatsApp
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="sms"
                className="flex-none w-[160px] rounded-sm py-2 px-3 text-sm font-semibold border-2 border-gray-200 dark:border-gray-600 data-[state=active]:border-transparent data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-blue-500 dark:data-[state=inactive]:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600 transition-all duration-200 data-[state=active]:[border-image:[none] flex items-center gap-3"
              >
                <MessageSquare size={18} className="dark:text-white" />
                <span className="hidden sm:inline dark:text-white">SMS</span>
              </TabsTrigger>
            </TabsList>

            <div className="border-t dark:border-gray-700 border-gray-200 pt-3">
              <TabsContent value="email" className="m-0">
                <EmailTemplateForm form={emailForm} />
              </TabsContent>

              <TabsContent value="whatsapp" className="m-0">
                <WhatsappTemplateForm form={whatsappForm} />
              </TabsContent>

              <TabsContent value="sms" className="m-0">
                <SmsTemplateForm form={smsForm} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Preview Section */}
        {activeTab !== "sms" && (
          <div className="bg-white dark:bg-gray-800 shadow-lead rounded-sm p-5 h-fit border border-gray-200 dark:border-gray-700">
            <div className="rounded-sm overflow-hidden">
              {activeTab === "email" && (
                <div className="overflow-hidden">
                  <emailForm.Subscribe selector={(s) => s.values}>
                    {(v) => <EmailPreview values={v} />}
                  </emailForm.Subscribe>
                </div>
              )}

              {activeTab === "whatsapp" && (
                <whatsappForm.Subscribe selector={(s) => s.values}>
                  {(v) => <WhatsAppPreview values={v} />}
                </whatsappForm.Subscribe>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
