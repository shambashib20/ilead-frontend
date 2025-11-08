import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";

// shadcn/ui components (assumes you scaffolded shadcn and generated these components)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  template: z.string().min(1, "Select a template"),
  automationType: z.string().min(1),
  deviceType: z.string().min(1),
  leadLabel: z.string().optional(),
  automationStatus: z.string().min(1),
  leadStatus: z.string().min(1),
  whatsappType: z.string().min(1),
});

type FormValues = z.infer<typeof FormSchema>;

type Values = {
  template: string;
  automationType: string;
  deviceType: string;
  leadLabel: string;
  automationStatus: string;
  leadStatus: string;
  whatsappType: string;
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className="text-sm text-red-600 mt-1">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
      {field.state.meta.isValidating ? (
        <p className="text-sm text-gray-500 mt-1">Validating...</p>
      ) : null}
    </>
  );
}

function WhatsappAutomationFilter() {
  const form = useForm({
    defaultValues: {
      template: "all-automation",
      automationType: "Lead Automation",
      deviceType: "Staff Device",
      leadLabel: "All Label",
      automationStatus: "Active Status",
      leadStatus: "New",
      whatsappType: "Normal Type",
    },
    onSubmit: async ({ value }) => {
      // replace this with your API call
      console.log("SUBMIT ->", value);
      // Example:
      // await fetch('/api/filters', { method: 'POST', body: JSON.stringify(value) })
    },
  });

  const triggerSubmit = () => {
    // form.handleSubmit will run validation and call onSubmit if valid
    form.handleSubmit();
  };

  return (
    <Card className="bg-primary shadow rounded-lg p-6">
      <h2 className="text-2xl font-medium mb-4 mt-4">
        Whatsapp Automation Rules
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Template */}
          <div className="md:col-span-1">
            <Label className="mb-2">Select Template</Label>
            <div className="flex gap-2">
              <form.Field name="template">
                {(field) => (
                  <div className="flex-1">
                    <Select
                      value={field.state.value ?? "all-automation"}
                      onValueChange={(val) => {
                        field.handleChange(val);
                        field.handleBlur();
                        triggerSubmit();
                      }}
                    >
                      <SelectTrigger className=" text-[14px] w-full dark:border-gray-600 rounded dark:text-purple-100 h-[50px] ">
                        <SelectValue placeholder="-- choose --" />
                      </SelectTrigger>
                      <SelectContent className="border-[#291e8d] border mt-2 p-0">
                        <SelectItem
                          value="all-automation"
                          className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                        >
                          All Automation Type
                        </SelectItem>
                        <SelectItem
                          value="lead-automation"
                          className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                        >
                          Lead Automation
                        </SelectItem>
                        <SelectItem
                          value="meeting-automation"
                          className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                        >
                          Meeting Automation
                        </SelectItem>
                        <SelectItem
                          value="invoice-automation"
                          className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                        >
                          Invoice Automation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Automation Type */}
          <div>
            <Label className="mb-2">Select Automation Type</Label>
            <form.Field name="automationType">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Lead Automation"
                    >
                      Lead Automation
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Email Automation"
                    >
                      Email Automation
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Task Automation"
                    >
                      Task Automation
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          {/* Device Type */}
          <div>
            <Label className="mb-2">Select Device Type</Label>
            <form.Field name="deviceType">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Staff Device"
                    >
                      Staff Device
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Bulk Device"
                    >
                      Bulk Device
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          {/* Lead Label */}
          <div>
            <Label className="mb-2">Select Lead Label</Label>
            <form.Field name="leadLabel">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="All Label"
                    >
                      All Label
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Hot"
                    >
                      Hot
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Cold"
                    >
                      Cold
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          {/* Automation Status */}
          <div>
            <Label className="mb-2">Select Automation Status</Label>
            <form.Field name="automationStatus">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Active Status"
                    >
                      Active Status
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Inactive"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          {/* Lead Status */}
          <div>
            <Label className="mb-2">Select Lead Status</Label>
            <form.Field name="leadStatus">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="New"
                    >
                      New
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Contacted"
                    >
                      Contacted
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Converted"
                    >
                      Converted
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          {/* WhatsApp Type */}
          <div>
            <Label className="mb-2">Select WhatsApp Type</Label>
            <form.Field name="whatsappType">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    field.handleChange(val);
                    field.handleBlur();
                    triggerSubmit();
                  }}
                >
                  <SelectTrigger className=" dark:border-gray-600 rounded dark:text-purple-100 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#291e8d] border mt-2 p-0">
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Normal Type"
                    >
                      Normal Type
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-[#3a3285] focus:text-white dark:focus:bg-[#f7f7f7] dark:focus:text-[#3a3285] dark:focus:font-semibold"
                      value="Broadcast"
                    >
                      Broadcast
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-3">
          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting]}
            children={() => (
              <>
                <Button
                  type="button"
                  onClick={() => form.reset()}
                  variant="outline"
                >
                  Reset
                </Button>
              </>
            )}
          />
        </div>
      </form>
    </Card>
  );
}

export default WhatsappAutomationFilter;
