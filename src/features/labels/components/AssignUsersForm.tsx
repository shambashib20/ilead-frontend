"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/store/useModalStore";
import { useChatAgents } from "@/features/leads/hooks/useChatAgents";
import { useUpdateLabel } from "../hooks/useUpdateLable";
import { useTheme } from "@/contexts/ThemeProvider";

interface User {
  id: string;
  name: string;
  email: string;
}

export interface AssignedUser {
  agent_id: {
    _id: string;
    name: string;
    email: string;
  };
  assigned_at: string; // ISO Date string
}

function AssignUsersForm({
  selectedId,
  users,
}: {
  selectedId: string;
  users: AssignedUser[];
}) {
  const { agents, isLoading } = useChatAgents();
  const { setFormActions, closeModal } = useModalStore();
  const { theme } = useTheme();
  const { updateLabel, isPending } = useUpdateLabel();
  const form = useForm({
    defaultValues: {
      selectedUsers: [] as User[],
    },

    onSubmit: async ({ value }) => {
      //console.log("Form submitted with:", value);
      await updateLabel({
        id: selectedId,
        chatAgentIds: value.selectedUsers.map((item) => {
          return { id: item.id };
        }),
      });
      closeModal();

      //   alert(`Assigned ${value.selectedUsers.length} users successfully!`);
    },
  });

  // Fetch users when component mounts

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit,
      isSubmitting: isPending,
    });
    useModalStore.getState().setSubmitLabel?.("Assign");
  }, [form.state.canSubmit, isPending]);

  // Transform users for react-select
  const userOptions = agents.data?.map((agent) => ({
    value: agent._id,
    label: agent.name,
    user: {
      id: agent._id,
      name: agent.name,
    } as User,
  }));

  useEffect(() => {
    if (users?.length) {
      const preSelectedUsers: User[] = users.map((u) => ({
        id: u.agent_id._id,
        name: u.agent_id.name,
        email: u.agent_id.email,
      }));

      form.setFieldValue("selectedUsers", preSelectedUsers);
    }
  }, [users]);

  //console.log(users);

  return (
    <div className="w-full ">
      <div className="px-6 py-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="selectedUsers"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="select-members" className="">
                  Select Members: <span className="text-red-500">*</span>
                </Label>

                {isLoading ? (
                  <div className="flex items-center justify-center p-4 border border-primary rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading users...
                    </span>
                  </div>
                ) : (
                  <Select
                    id="select-members"
                    isMulti
                    options={userOptions}
                    value={field.state.value.map((user) => ({
                      value: user.id,
                      label: user.name,
                      user: user,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedUsers = selectedOptions
                        ? selectedOptions.map((option) => option.user)
                        : [];
                      field.handleChange(selectedUsers);
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select members..."
                    styles={{
                      control: (styles: any) => ({
                        ...styles,
                        backgroundColor: theme === "dark" ? "#283046" : "white",
                        borderColor: theme === "dark" ? "#555" : "#e6e6e6",
                      }),
                      option: (
                        styles: any,
                        { isDisabled, isFocused, isSelected }: any
                      ) => ({
                        ...styles,
                        fontSize: "14px",
                        backgroundColor: isDisabled
                          ? undefined
                          : isSelected
                            ? "#3a3285"
                            : isFocused
                              ? "#f0f0f0"
                              : undefined,
                        color: isFocused || isSelected ? "#3a3285" : "#333",
                        cursor: isDisabled ? "not-allowed" : "default",
                        ":active": {
                          ...styles[":active"],
                          backgroundColor: isSelected ? "#3a3285" : "#e8e8e8",
                        },
                      }),
                      multiValue: (styles: any) => ({
                        ...styles,
                        backgroundColor:
                          theme === "dark" ? "rgba(58,50,133,.12)" : "#e6e6e6",
                      }),
                      multiValueLabel: (styles: any) => ({
                        ...styles,
                        color: theme === "dark" ? "#9089d5" : "#333",
                        fontSize: "12px",
                      }),
                      multiValueRemove: (styles: any) => ({
                        ...styles,
                        color: theme === "dark" ? "#9089d5" : "#333",
                      }),
                    }}
                  />
                )}

                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {field.state.value.length} member(s) selected
                </p>
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
}

export default AssignUsersForm;
