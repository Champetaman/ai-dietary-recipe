"use client";

import { memo } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { SelectionGroup } from "@/components/SelectionGroup";
import times from "@/data/TimeOptions.json";
import { getLocalizedOptions, getLocalizedText } from "@/lib/i18n";

interface TimeSelectorProps {
  onSelectTime: (time: string | null) => void;
  value: string | null;
}

function TimeSelector({ onSelectTime, value }: TimeSelectorProps) {
  const { language } = useLanguage();

  return (
    <SelectionGroup
      title={getLocalizedText(times.header, language)}
      options={getLocalizedOptions(times, language)}
      value={value}
      onChange={(nextValue) => {
        const valueOrNull =
          typeof nextValue === "string" || nextValue === null ? nextValue : null;
        onSelectTime(valueOrNull);
      }}
      selectionMode="single"
      optionClassName="w-28"
    />
  );
}

export default memo(TimeSelector);
