"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NONE_OPTION_ID } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SelectionOption = {
  value: string;
  label: string;
};

interface SelectionGroupProps {
  title: string;
  options: SelectionOption[];
  value: string | null | string[];
  onChange: (value: string | null | string[]) => void;
  selectionMode: "single" | "multiple";
  allowCustom?: boolean;
  customPlaceholder?: string;
  addLabel?: string;
  editLabel?: string;
  optionClassName?: string;
  optionsContainerClassName?: string;
}

function normalizeCustomValue(value: string) {
  return value
    .replace(/[^\p{L}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function SelectionGroup({
  title,
  options,
  value,
  onChange,
  selectionMode,
  allowCustom = false,
  customPlaceholder = "Write an option",
  addLabel = "Add",
  editLabel = "Edit",
  optionClassName,
  optionsContainerClassName,
}: SelectionGroupProps) {
  const optionValues = options.map((option) => option.value);
  const selectedValues =
    selectionMode === "multiple"
      ? (value as string[])
      : value
        ? [value as string]
        : [];

  const customSelection =
    selectedValues.find((item) => !optionValues.includes(item)) ?? "";

  const updateSelection = (nextValues: string[]) => {
    if (selectionMode === "multiple") {
      onChange(nextValues);
      return;
    }

    onChange(nextValues[0] ?? null);
  };

  const toggleOption = (option: string) => {
    const isActive = selectedValues.includes(option);

    if (selectionMode === "single") {
      updateSelection(isActive ? [] : [option]);
      return;
    }

    if (option === NONE_OPTION_ID) {
      updateSelection(isActive ? [] : [NONE_OPTION_ID]);
      return;
    }

    const nextSelectedValues = selectedValues.filter(
      (selected) => selected !== NONE_OPTION_ID,
    );

    updateSelection(
      isActive
        ? selectedValues.filter((selected) => selected !== option)
        : [...nextSelectedValues, option],
    );
  };

  const addCustomSelection = (rawValue: string) => {
    const nextCustomValue = normalizeCustomValue(rawValue);

    if (!nextCustomValue) {
      return;
    }

    if (selectionMode === "single") {
      onChange(nextCustomValue);
      return;
    }

    const withoutPreviousCustom = selectedValues.filter((item) =>
      optionValues.includes(item),
    );
    onChange([...withoutPreviousCustom, nextCustomValue]);
  };

  const clearCustomSelection = () => {
    if (selectionMode === "single") {
      onChange(null);
      return;
    }

    onChange(selectedValues.filter((item) => item !== customSelection));
  };

  return (
    <Card interactive className="flex min-h-full flex-col">
      <div>
        <p className="font-heading text-lg sm:text-xl font-semibold leading-[1.1] tracking-[-0.04em] text-foreground">
          {title}
        </p>
      </div>

      <div
        className={cn(
          "mt-5 flex flex-wrap justify-center gap-2.5",
          optionsContainerClassName,
        )}
      >
        {options.map((option) => {
          const isActive = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-1.5 text-center text-[0.8125rem] font-medium leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f680]",
                isActive
                  ? "border-accent bg-accent/10 text-accent-soft"
                  : "border-border bg-black/15 text-muted hover:border-accent/35 hover:text-foreground",
                optionClassName,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {allowCustom ? (
        <CustomEntry
          customSelection={customSelection}
          customPlaceholder={customPlaceholder}
          addLabel={addLabel}
          editLabel={editLabel}
          onAddCustomSelection={addCustomSelection}
          onClearCustomSelection={clearCustomSelection}
        />
      ) : null}
    </Card>
  );
}

interface CustomEntryProps {
  customSelection: string;
  customPlaceholder: string;
  addLabel: string;
  editLabel: string;
  onAddCustomSelection: (value: string) => void;
  onClearCustomSelection: () => void;
}

function CustomEntry({
  customSelection,
  customPlaceholder,
  addLabel,
  editLabel,
  onAddCustomSelection,
  onClearCustomSelection,
}: CustomEntryProps) {
  return (
    <form
      className="mt-5 grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextValue = String(formData.get("customSelection") ?? "");
        onAddCustomSelection(nextValue);
      }}
    >
      <Input
        key={customSelection || "empty-custom"}
        name="customSelection"
        defaultValue={customSelection}
        placeholder={customPlaceholder}
        disabled={Boolean(customSelection)}
        className="h-9 text-[0.8125rem] sm:text-[0.8125rem]"
      />
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        className="h-9 w-full px-3 text-[0.8125rem] sm:w-auto"
        disabled={Boolean(customSelection)}
      >
        {addLabel}
      </Button>
      {customSelection ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-full px-3 text-[0.8125rem] sm:w-auto"
          onClick={onClearCustomSelection}
        >
          {editLabel}
        </Button>
      ) : null}
    </form>
  );
}
