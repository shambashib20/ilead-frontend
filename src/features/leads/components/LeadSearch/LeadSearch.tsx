import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeProvider";
import { useForm } from "@tanstack/react-form";
import { Calendar, Search, X } from "lucide-react";
import Select, { type StylesConfig } from "react-select";
import { useLabels } from "../../hooks/useLabels";
import { useSource } from "../../hooks/useSource";
import { useChatAgents } from "../../hooks/useChatAgents";
import { useLeads } from "../../hooks/useLeads";
import type { FilterPayload } from "../../services/Leads.service";
import { useFilteredLeads } from "../../hooks/useFilterLeads";

type LablesOptions = {
  label: string;
  value: string;
};

type AgentOption = { value: string; label: string };
type LabelOption = { value: string; label: string };
type SourceOption = { value: string; label: string };

type FormData = {
  createdBy: AgentOption[];
  assignTo: AgentOption[];
  labels: LabelOption[];
  source: SourceOption[];
  searchByDate: { value: string; label: string }[];
  searchQuery: string;
};

const defaultLabelOption: LablesOptions = {
  value: "",
  label: "All Labels",
};
const defaultAgentsOption: LablesOptions = {
  value: "",
  label: "All Agents",
};
const defaultSourcesOption: LablesOptions = {
  value: "",
  label: "All Status",
};
const defaultAssigneesOption: LablesOptions = {
  value: "",
  label: "All Assigns",
};

function LeadSearch() {
  const filtered = useFilteredLeads();
  const { theme } = useTheme();
  const { lables } = useLabels();
  const { sources } = useSource();
  const { agents } = useChatAgents();

  const labelOptions = [
    defaultLabelOption,
    ...(lables?.data?.map((lbl) => ({
      value: lbl._id,
      label: lbl.title,
    })) || []),
  ];

  const sourceOptions = [
    defaultSourcesOption,
    ...(sources?.map((source) => ({
      value: source._id,
      label: source.title,
    })) || []),
  ];

  const agentsOptions = [
    defaultAgentsOption,
    ...(agents?.data?.map((agents) => ({
      value: agents._id,
      label: agents.name,
    })) || []),
  ];

  const AssigneesOptions = [
    defaultAssigneesOption,
    ...(agents?.data?.map((assign) => ({
      value: assign._id,
      label: assign.name,
    })) || []),
  ];

  const followUpOptions = [
    { value: "today", label: "By Follow-up Date" },
    { value: "tomorrow", label: "By Next Follow-up Date" },
    { value: "this_week", label: "By Created Date" },
    { value: "next_week", label: "Next Week" },
  ];

  const form = useForm({
    defaultValues: {
      labels: [defaultLabelOption],
      createdBy: [defaultAgentsOption],
      assignTo: [defaultAssigneesOption],
      source: [defaultSourcesOption],
      searchByDate: [],
      searchQuery: "",
    } as FormData,

    onSubmit: async ({ value }: { value: FormData }) => {
      const filters: FilterPayload = {
        labelIds: value.labels.map((l) => l.value),
        assignedTo: value.assignTo.map((a) => a.value),
        sourceNames: value.source.map((s) => s.value),
        createdByIds: value.createdBy.map((a) => a.value),
        search: value.searchQuery,
        sortBy: value.searchByDate[0]?.value ?? "",
      };
      filtered.mutate(filters);

      //   console.log(value);
    },
  });

  const handleSearch = (formData: FormData) => {
    // Implement your search logic here
    console.log("Searching with:", formData);
    // Example: call API, filter data, etc.
  };

  const handleReset = () => {
    form.reset();
    console.log("Form reset");
  };

  const handleCalendarAction = () => {
    // Implement calendar functionality
    console.log("Calendar action triggered");
  };

  const colourStyles: StylesConfig<LablesOptions, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: theme === "dark" ? "#283046" : "white",
      borderColor: theme === "dark" ? "#555" : "#e6e6e6",
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
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
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: theme === "dark" ? "rgba(58,50,133,.12)" : "#e6e6e6",

        // backgroundColor: "#e6e6e6",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,

      color: theme === "dark" ? "#9089d5" : "#333",
      fontSize: "12px",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: theme === "dark" ? "#9089d5" : "#333",
    }),
  };

  return (
    <div className="w-full ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Created By Field */}
          <form.Field
            name="createdBy"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="createdBy" className="">
                  Created By
                </Label>
                <Select
                  id="createdBy"
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(Array.isArray(value) ? [...value] : [])
                  }
                  isMulti
                  name="createdBy"
                  options={agentsOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={colourStyles}
                  placeholder="Select creators..."
                />
              </div>
            )}
          />

          {/* Assign To Field */}
          <form.Field
            name="assignTo"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="assignTo" className="">
                  Assign To
                </Label>
                <Select
                  id="assignTo"
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(Array.isArray(value) ? [...value] : [])
                  }
                  isMulti
                  name="assignTo"
                  options={AssigneesOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={colourStyles}
                  placeholder="Select assignees..."
                />
              </div>
            )}
          />

          {/* Labels Field */}
          <form.Field
            name="labels"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="labels" className="">
                  Labels
                </Label>
                <Select
                  id="labels"
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(Array.isArray(value) ? [...value] : [])
                  }
                  isMulti
                  name="labels"
                  options={labelOptions || []}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={colourStyles}
                  placeholder="Select labels..."
                />
              </div>
            )}
          />

          {/* Source Field */}
          <form.Field
            name="source"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="source" className="">
                  Source
                </Label>
                <Select
                  id="source"
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(Array.isArray(value) ? [...value] : [])
                  }
                  isMulti
                  name="source"
                  options={sourceOptions || []}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={colourStyles}
                  placeholder="Select sources..."
                />
              </div>
            )}
          />

          {/* Search By Date Field */}
          <form.Field
            name="searchByDate"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="searchByDate" className="">
                  Search By Date
                </Label>
                <Select
                  id="searchByDate"
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(Array.isArray(value) ? [...value] : [])
                  }
                  isMulti
                  name="searchByDate"
                  options={followUpOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={colourStyles}
                  placeholder="Select date range..."
                />
              </div>
            )}
          />

          {/* Search Query Field */}
          <form.Field
            name="searchQuery"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="searchQuery" className="">
                  Search Query
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="searchQuery"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter search terms..."
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-600">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCalendarAction}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>

          <Button
            type="submit"
            size="sm"
            className="flex items-center gap-2 bg-[#3a3285] hover:bg-[#2d2660]"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LeadSearch;
