"use client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Search } from "lucide-react";
import Select from "react-select";
import type { FilterPayload } from "../../services/Leads.service";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLabels } from "../../hooks/useLabels";
import { useSource } from "../../hooks/useSource";
import { useChatAgents } from "../../hooks/useChatAgents";

// Your existing default options
const defaultLabelOption = { value: "", label: "All Labels" };
const defaultSourcesOption = { value: "", label: "All Sources" };
const defaultAgentsOption = { value: "", label: "All Agents" };
const defaultAssigneesOption = { value: "", label: "All Assignees" };

type OptionType = { value: string; label: string };

type FormData = {
  labels: OptionType[];
  createdBy: OptionType[];
  assignTo: OptionType[];
  source: OptionType[];
  searchByDate: OptionType[];
  searchQuery: string;
};
type LeadSearchParams = {
  labelIds?: string;
  assignedTo?: string;
  sourceNames?: string;
  createdByIds?: string;
  search?: string;
  sortBy?: string;
};

function LeadSearch() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/_dashboardLayout/lead" }) as {
    labelIds?: string;
    assignedTo?: string;
    sourceNames?: string;
    createdByIds?: string;
    search?: string;
    sortBy?: string;
  }; // Adjust route as needed

  // Parse filters from URL search params
  const getFiltersFromSearch = (): FilterPayload => {
    return {
      labelIds: searchParams?.labelIds ? searchParams.labelIds.split(",") : [],
      assignedTo: searchParams?.assignedTo
        ? searchParams.assignedTo.split(",")
        : [],
      sourceNames: searchParams?.sourceNames
        ? searchParams.sourceNames.split(",")
        : [],
      createdByIds: searchParams?.createdByIds
        ? searchParams.createdByIds.split(",")
        : [],
      search: searchParams?.search || "",
      sortBy: searchParams?.sortBy || "",
    };
  };

  const currentFilters = getFiltersFromSearch();
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
    ...(agents?.data?.map((agent) => ({
      value: agent._id,
      label: agent.name,
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

  // Convert current filters to form values
  const getFormValuesFromFilters = (filters: FilterPayload): FormData => {
    return {
      labels:
        (filters.labelIds ?? []).length > 0
          ? (filters.labelIds ?? []).map(
              (id) =>
                labelOptions.find((opt) => opt.value === id) ||
                defaultLabelOption
            )
          : [defaultLabelOption],
      createdBy:
        (filters.createdByIds ?? []).length > 0
          ? (filters.createdByIds ?? []).map(
              (id) =>
                agentsOptions.find((opt) => opt.value === id) ||
                defaultAgentsOption
            )
          : [defaultAgentsOption],
      assignTo:
        (filters.assignedTo ?? []).length > 0
          ? (filters.assignedTo ?? []).map(
              (id) =>
                AssigneesOptions.find((opt) => opt.value === id) ||
                defaultAssigneesOption
            )
          : [defaultAssigneesOption],
      source:
        (filters.sourceNames ?? []).length > 0
          ? (filters.sourceNames ?? []).map(
              (id) =>
                sourceOptions.find((opt) => opt.value === id) ||
                defaultSourcesOption
            )
          : [defaultSourcesOption],
      searchByDate: filters.sortBy
        ? [
            followUpOptions.find((opt) => opt.value === filters.sortBy) ||
              followUpOptions[0],
          ]
        : [],
      searchQuery: filters.search,
    };
  };

  const form = useForm({
    defaultValues: getFormValuesFromFilters(currentFilters),
    onSubmit: async ({ value }: { value: FormData }) => {
      const filters: FilterPayload = {
        labelIds: value.labels.map((l) => l.value).filter((v) => v !== ""),
        assignedTo: value.assignTo.map((a) => a.value).filter((v) => v !== ""),
        sourceNames: value.source.map((s) => s.value).filter((v) => v !== ""),
        createdByIds: value.createdBy
          .map((a) => a.value)
          .filter((v) => v !== ""),
        search: value.searchQuery,
        sortBy: value.searchByDate[0]?.value ?? "",
      };

      // Update URL search params
      const searchParams: LeadSearchParams = {};
      if ((filters.labelIds ?? []).length > 0)
        searchParams.labelIds = (filters.labelIds ?? []).join(",");
      if ((filters.assignedTo ?? []).length > 0)
        searchParams.assignedTo = (filters.assignedTo ?? []).join(",");
      if ((filters.sourceNames ?? []).length > 0)
        searchParams.sourceNames = (filters.sourceNames ?? []).join(",");
      if ((filters.createdByIds ?? []).length > 0)
        searchParams.createdByIds = (filters.createdByIds ?? []).join(",");
      if (filters.search) searchParams.search = filters.search;
      if (filters.sortBy) searchParams.sortBy = filters.sortBy;

      console.log(filters);

      navigate({
        // @ts-ignore: Unreachable code error
        search: searchParams,
      });
    },
  });

  const handleReset = () => {
    form.reset();
    navigate({
      search: true,
    });
  };

  // const handleCalendarAction = () => {
  //   console.log("Calendar action triggered");
  // };

  const colourStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: theme === "dark" ? "#283046" : "white",
      borderColor: theme === "dark" ? "#555" : "#e6e6e6",
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
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
      backgroundColor: theme === "dark" ? "rgba(58,50,133,.12)" : "#e6e6e6",
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
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Created By Field */}
          <form.Field
            name="createdBy"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="createdBy">Created By</Label>
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
                <Label htmlFor="assignTo">Assign To</Label>
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
                <Label htmlFor="labels">Labels</Label>
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
                <Label htmlFor="source">Source</Label>
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
                <Label htmlFor="searchByDate">Search By Date</Label>
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
                <Label htmlFor="searchQuery">Search Query</Label>
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
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
          {/* <Button
            type="button"
            size="sm"
            onClick={handleCalendarAction}
            className="flex items-center gap-2 "
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button> */}
          <Button type="submit" size="sm" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LeadSearch;
