import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeProvider';
import { useForm } from '@tanstack/react-form';
import { Calendar, Search, X } from 'lucide-react';
import Select, { type StylesConfig } from 'react-select';

type ColourOption = {
    label: string;
    value: string;
    color: string;
};

const COLOUR_OPTIONS: ColourOption[] = [
    { value: "red", label: "Red", color: "#FF5630" },
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "yellow", label: "Yellow", color: "#FFAB00" },
    { value: "green", label: "Green", color: "#36B37E" },
]

type FormData = {
    createdBy: ColourOption[]
    assignTo: ColourOption[]
    labels: ColourOption[]
    source: ColourOption[]
    searchByDate: ColourOption[]
    searchQuery: string
}

function LeadSearch() {
    const { theme } = useTheme()
    const form = useForm({
        defaultValues: {
            createdBy: [{ value: "green", label: "Green", color: "#36B37E" }],
            assignTo: [{ value: "green", label: "Green", color: "#36B37E" }],
            labels: [{ value: "green", label: "Green", color: "#36B37E" }],
            source: [{ value: "green", label: "Green", color: "#36B37E" }],
            searchByDate: [{ value: "green", label: "Green", color: "#36B37E" }],
            searchQuery: "",
        },
        onSubmit: async ({ value }: { value: FormData }) => {
            // Handle form submission here
            console.log("Form submitted with values:", value)

            // You can add your search logic here
            // For example, call an API or filter data
            handleSearch(value)
        },
    })

    const handleSearch = (formData: FormData) => {
        // Implement your search logic here
        console.log("Searching with:", formData)
        // Example: call API, filter data, etc.
    }

    const handleReset = () => {
        form.reset()
        console.log("Form reset")
    }

    const handleCalendarAction = () => {
        // Implement calendar functionality
        console.log("Calendar action triggered")
    }


    const colourStyles: StylesConfig<ColourOption, true> = {
        control: (styles) => ({ ...styles, backgroundColor: theme === "dark" ? "#283046" : "white", borderColor: theme === "dark" ? "#555" : "#e6e6e6", }),
        option: (styles, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            fontSize: '14px',
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? '#3a3285'
                    : isFocused
                        ? '#f0f0f0'
                        : undefined,
            color: isFocused || isSelected ? '#3a3285' : '#333',

            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: isSelected ? '#3a3285' : '#e8e8e8',
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
            fontSize: '12px',

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
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
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
                                    onChange={(value) => field.handleChange(Array.isArray(value) ? [...value] : [])}
                                    isMulti
                                    name="createdBy"
                                    options={COLOUR_OPTIONS}
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
                                    onChange={(value) => field.handleChange(Array.isArray(value) ? [...value] : [])}
                                    isMulti
                                    name="assignTo"
                                    options={COLOUR_OPTIONS}
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
                                    onChange={(value) => field.handleChange(Array.isArray(value) ? [...value] : [])}
                                    isMulti
                                    name="labels"
                                    options={COLOUR_OPTIONS}
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
                                    onChange={(value) => field.handleChange(Array.isArray(value) ? [...value] : [])}
                                    isMulti
                                    name="source"
                                    options={COLOUR_OPTIONS}
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
                                    onChange={(value) => field.handleChange(Array.isArray(value) ? [...value] : [])}
                                    isMulti
                                    name="searchByDate"
                                    options={COLOUR_OPTIONS}
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
                    <Button type="button" variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
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

                    <Button type="submit" size="sm" className="flex items-center gap-2 bg-[#3a3285] hover:bg-[#2d2660]">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                </div>
            </form>

            {/* Debug Info (remove in production) */}
            {/* <form.Subscribe
                selector={(state) => [state.values]}
                children={([values]) => (
                    <details className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <summary className="cursor-pointer  text-gray-600">Form Values (Debug)</summary>
                        <pre className="mt-2 text-xs text-gray-600 overflow-auto">{JSON.stringify(values, null, 2)}</pre>
                    </details>
                )}
            /> */}
        </div>
    )
}

export default LeadSearch