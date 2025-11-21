import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth/hooks/useUser";

function WapMonkeyIntegration() {
  const [apiKey, setApiKey] = useState("");

const {data}=useUser()
  console.log(data, "hook data");

  const form = useForm({
    defaultValues: {
      key: apiKey || "",
    },
    onSubmit: async ({ value }) => {
      console.log("Saving API key:", value.key);
      // TODO → API call to save key
    },
  });

  const handleDelete = () => {
    setApiKey("");
    form.setFieldValue("key", "");
  };

  const handleRefreshCredit = () => {
    console.log("Refreshing credit...");
    // TODO → API call for credit refresh
  };

  return (
    <div className="bg-primary p-5 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        WhatsApp Integration
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex items-center gap-3"
      >
        <form.Field
          name="key"
          children={(field) => (
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter WhatsApp API Key"
              className="flex-1 bg-primary border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          )}
        />

        {/* DELETE BUTTON */}
        <Button
          type="button"
          onClick={handleDelete}
          variant={"destructive"}
          size={"icon"}
        >
          <Trash2 size={18} />
        </Button>

        <Button
          type="button"
          onClick={handleRefreshCredit}
          variant={"outline"}
          size={"icon"}
        >
          <RotateCcw size={18} />
        </Button>
      </form>

      {/* CREDIT DISPLAY */}
      <div className="mt-3 text-gray-300">
        <span className="text-sm">Credit</span>
        <div className="text-lg font-semibold">3,797</div>
      </div>
    </div>
  );
}

export default WapMonkeyIntegration;
