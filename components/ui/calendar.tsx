'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DateRange } from 'react-day-picker';

interface CalendarProps {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  numberOfMonths?: number;
  locale?: any;
  className?: string;
}

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function Calendar({
  mode = 'single',
  selected,
  onSelect,
  numberOfMonths = 1,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date: Date) => {
    if (mode === 'single' && selected instanceof Date) {
      return isSameDay(date, selected);
    }
    if (mode === 'range' && selected && typeof selected === 'object' && 'from' in selected) {
      const range = selected as DateRange;
      if (range.from && isSameDay(date, range.from)) return true;
      if (range.to && isSameDay(date, range.to)) return true;
      if (range.from && range.to) {
        return date >= range.from && date <= range.to;
      }
    }
    return false;
  };

  const isRangeStart = (date: Date) => {
    if (mode === 'range' && selected && typeof selected === 'object' && 'from' in selected) {
      const range = selected as DateRange;
      return range.from && isSameDay(date, range.from);
    }
    return false;
  };

  const isRangeEnd = (date: Date) => {
    if (mode === 'range' && selected && typeof selected === 'object' && 'from' in selected) {
      const range = selected as DateRange;
      return range.to && isSameDay(date, range.to);
    }
    return false;
  };

  const handleDayClick = (date: Date) => {
    if (mode === 'single') {
      onSelect?.(date);
    } else if (mode === 'range') {
      const range = (selected && typeof selected === 'object' && 'from' in selected ? selected : { from: undefined, to: undefined }) as DateRange;
      
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined });
      } else if (date < range.from) {
        onSelect?.({ from: date, to: range.from });
      } else {
        onSelect?.({ from: range.from, to: date });
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderMonth = (monthOffset: number = 0) => {
    const displayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = getDaysInMonth(displayDate);
    const weeks: (Date | null)[][] = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div key={monthOffset} className="flex-1 min-w-[280px]">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={goToPreviousMonth}
              className="h-8 w-8 rounded-md border border-border hover:bg-accent inline-flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {monthOffset > 0 && <div className="w-8" />}
          
          <h3 className="text-sm font-semibold capitalize">
            {MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
          </h3>
          
          {monthOffset === numberOfMonths - 1 && (
            <button
              onClick={goToNextMonth}
              className="h-8 w-8 rounded-md border border-border hover:bg-accent inline-flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {monthOffset < numberOfMonths - 1 && <div className="w-8" />}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-xs font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="h-10 w-full">
                  {day ? (
                    <button
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        'h-10 w-full rounded-md text-sm font-medium transition-colors hover:bg-accent',
                        isToday(day) && 'font-bold ring-2 ring-primary/30',
                        isSelected(day) && !isRangeStart(day) && !isRangeEnd(day) && 'bg-accent/50',
                        (isRangeStart(day) || isRangeEnd(day)) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        !isSelected(day) && 'hover:bg-accent'
                      )}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <div className="h-10 w-full" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('p-4', className)}>
      <div className="flex gap-8">
        {Array.from({ length: numberOfMonths }).map((_, i) => renderMonth(i))}
      </div>
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
export type { CalendarProps };
