"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeveritySelectProps {
  value: "soft" | "normal" | "strict";
  onChange: (val: "soft" | "normal" | "strict") => void;
}

export function SeveritySelect({ value, onChange }: SeveritySelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Строгость:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Выберите" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="soft">Мягкая</SelectItem>
          <SelectItem value="normal">Стандарт</SelectItem>
          <SelectItem value="strict">Дотошная</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}