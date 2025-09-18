// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar } from "@/components/ui/calendar";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   format,
//   addDays,
//   subDays,
//   startOfWeek,
//   endOfWeek,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   isEqual,
//   startOfDay,
// } from "date-fns";
// import { cn } from "@/lib/utils";

// interface DateRangeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (startDate: Date, endDate: Date) => void;
//   initialStartDate?: Date;
//   initialEndDate?: Date;
// }

// export const DateRangeModal: React.FC<DateRangeModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialStartDate,
//   initialEndDate,
// }) => {
//   const [startDate, setStartDate] = useState<Date>(
//     initialStartDate || new Date()
//   );
//   const [endDate, setEndDate] = useState<Date>(initialEndDate || new Date());
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
//   const [daysUpToToday, setDaysUpToToday] = useState<string>("1");
//   const [daysStartingToday, setDaysStartingToday] = useState<string>("1");

//   const quickOptions = [
//     {
//       label: "Today",
//       onClick: () => {
//         const today = new Date();
//         setStartDate(today);
//         setEndDate(today);
//       },
//     },
//     {
//       label: "Yesterday",
//       onClick: () => {
//         const yesterday = subDays(new Date(), 1);
//         setStartDate(yesterday);
//         setEndDate(yesterday);
//       },
//     },
//     {
//       label: "This Week",
//       onClick: () => {
//         const today = new Date();
//         setStartDate(startOfWeek(today, { weekStartsOn: 0 }));
//         setEndDate(endOfWeek(today, { weekStartsOn: 0 }));
//       },
//     },
//     {
//       label: "Last Week",
//       onClick: () => {
//         const lastWeek = subDays(new Date(), 7);
//         setStartDate(startOfWeek(lastWeek, { weekStartsOn: 0 }));
//         setEndDate(endOfWeek(lastWeek, { weekStartsOn: 0 }));
//       },
//     },
//     {
//       label: "This Month",
//       onClick: () => {
//         const today = new Date();
//         setStartDate(startOfMonth(today));
//         setEndDate(endOfMonth(today));
//       },
//     },
//     {
//       label: "Last Month",
//       onClick: () => {
//         const lastMonth = subMonths(new Date(), 1);
//         setStartDate(startOfMonth(lastMonth));
//         setEndDate(endOfMonth(lastMonth));
//       },
//     },
//   ];

//   const handleDateSelect = (date: Date | undefined) => {
//     if (!date) return;

//     if (!startDate || (startDate && endDate && !isEqual(startDate, endDate))) {
//       setStartDate(date);
//       setEndDate(date);
//     } else if (date < startDate) {
//       setStartDate(date);
//     } else {
//       setEndDate(date);
//     }
//   };

//   const handleDaysUpToTodayChange = (value: string) => {
//     setDaysUpToToday(value);
//     const days = parseInt(value) || 1;
//     const today = new Date();
//     setStartDate(subDays(today, days - 1));
//     setEndDate(today);
//   };

//   const handleDaysStartingTodayChange = (value: string) => {
//     setDaysStartingToday(value);
//     const days = parseInt(value) || 1;
//     const today = new Date();
//     setStartDate(today);
//     setEndDate(addDays(today, days - 1));
//   };

//   const handleSubmit = () => {
//     onSubmit(startDate, endDate);
//     onClose();
//   };

//   const CalendarMonth = ({
//     date,
//     onDateClick,
//   }: {
//     date: Date;
//     onDateClick: (date: Date) => void;
//   }) => {
//     const monthStart = startOfMonth(date);
//     const monthEnd = endOfMonth(date);
//     const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
//     const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

//     const days = [];
//     let currentDate = calendarStart;

//     while (currentDate <= calendarEnd) {
//       days.push(new Date(currentDate));
//       currentDate = addDays(currentDate, 1);
//     }

//     const isInRange = (date: Date) => {
//       return date >= startOfDay(startDate) && date <= startOfDay(endDate);
//     };

//     const isRangeStart = (date: Date) => {
//       return isEqual(startOfDay(date), startOfDay(startDate));
//     };

//     const isRangeEnd = (date: Date) => {
//       return isEqual(startOfDay(date), startOfDay(endDate));
//     };

//     const isCurrentMonth = (date: Date) => {
//       return date.getMonth() === monthStart.getMonth();
//     };

//     return (
//       <div className="p-4">
//         <h3 className="text-center font-medium mb-4 text-muted-foreground">
//           {format(date, "MMM yyyy")}
//         </h3>
//         <div className="grid grid-cols-7 gap-1 mb-2">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//             <div
//               key={day}
//               className="text-center text-sm font-medium text-muted-foreground p-2"
//             >
//               {day}
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 gap-1">
//           {days.map((day, index) => (
//             <button
//               key={index}
//               onClick={() => onDateClick(day)}
//               className={cn(
//                 "w-10 h-10 text-sm rounded-md transition-colors",
//                 "hover:bg-muted",
//                 !isCurrentMonth(day) && "text-muted-foreground opacity-50",
//                 isRangeStart(day) &&
//                   "bg-selected text-selected-foreground hover:bg-selected",
//                 isRangeEnd(day) &&
//                   !isRangeStart(day) &&
//                   "bg-selected text-selected-foreground hover:bg-selected",
//                 isInRange(day) &&
//                   !isRangeStart(day) &&
//                   !isRangeEnd(day) &&
//                   "bg-selected/20"
//               )}
//             >
//               {day.getDate()}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl p-0 gap-0">
//         <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
//           <div className="flex items-center justify-between">
//             <DialogTitle className="text-lg font-medium">
//               Date Range
//             </DialogTitle>
//             <button
//               onClick={onClose}
//               className="text-primary-foreground hover:bg-primary-hover rounded p-1"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </DialogHeader>

//         <div className="flex">
//           {/* Left sidebar */}
//           <div className="w-64 border-r bg-muted/30 p-4">
//             <div className="space-y-1 mb-6">
//               {quickOptions.map((option, index) => (
//                 <button
//                   key={index}
//                   onClick={option.onClick}
//                   className="w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="number"
//                   value={daysUpToToday}
//                   onChange={(e) => handleDaysUpToTodayChange(e.target.value)}
//                   className="w-16 h-8 text-sm"
//                   min="1"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   days up to today
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="number"
//                   value={daysStartingToday}
//                   onChange={(e) =>
//                     handleDaysStartingTodayChange(e.target.value)
//                   }
//                   className="w-16 h-8 text-sm"
//                   min="1"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   days starting today
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Main content */}
//           <div className="flex-1 p-6">
//             {/* Date inputs */}
//             <div className="flex space-x-4 mb-6">
//               <Input
//                 value={format(startDate, "MMM d, yyyy")}
//                 readOnly
//                 className="flex-1"
//               />
//               <Input
//                 value={format(endDate, "MMM d, yyyy")}
//                 readOnly
//                 className="flex-1"
//               />
//             </div>

//             {/* Calendar navigation */}
//             <div className="flex items-center justify-between mb-4">
//               <button
//                 onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
//                 className="p-2 hover:bg-muted rounded-md"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>

//               <div className="flex space-x-4">
//                 <select
//                   value={format(currentMonth, "MMMM")}
//                   onChange={(e) => {
//                     const monthIndex = new Date(
//                       `${e.target.value} 1, ${currentMonth.getFullYear()}`
//                     ).getMonth();
//                     setCurrentMonth(
//                       new Date(currentMonth.getFullYear(), monthIndex)
//                     );
//                   }}
//                   className="bg-background border border-border rounded px-2 py-1 text-sm"
//                 >
//                   {Array.from({ length: 12 }, (_, i) => {
//                     const month = new Date(2000, i);
//                     return (
//                       <option key={i} value={format(month, "MMMM")}>
//                         {format(month, "MMMM")}
//                       </option>
//                     );
//                   })}
//                 </select>

//                 <select
//                   value={currentMonth.getFullYear()}
//                   onChange={(e) => {
//                     setCurrentMonth(
//                       new Date(
//                         parseInt(e.target.value),
//                         currentMonth.getMonth()
//                       )
//                     );
//                   }}
//                   className="bg-background border border-border rounded px-2 py-1 text-sm"
//                 >
//                   {Array.from({ length: 10 }, (_, i) => {
//                     const year = new Date().getFullYear() - 5 + i;
//                     return (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               <button
//                 onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
//                 className="p-2 hover:bg-muted rounded-md"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Dual calendar */}
//             <div className="flex">
//               <CalendarMonth
//                 date={currentMonth}
//                 onDateClick={handleDateSelect}
//               />
//               <CalendarMonth
//                 date={addMonths(currentMonth, 1)}
//                 onDateClick={handleDateSelect}
//               />
//             </div>

//             {/* Action buttons */}
//             <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 className="bg-primary hover:bg-primary-hover"
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
