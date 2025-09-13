import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePickerComponent = ({ 
  selected, 
  onChange, 
  placeholder = "Selecionar data",
  className,
  disabled = false
}: DatePickerProps) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        calendarClassName="bg-background border border-border shadow-lg"
        dayClassName={(date) => 
          cn(
            "hover:bg-primary/10 rounded-md p-1 text-sm",
            date.getDay() === 0 || date.getDay() === 6 ? "text-muted-foreground" : "text-foreground"
          )
        }
        weekDayClassName={() => "text-muted-foreground text-xs font-medium"}
        monthClassName={() => "text-foreground font-semibold"}
        yearClassName={() => "text-foreground font-semibold"}
        showPopperArrow={false}
        popperClassName="z-50"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
};
