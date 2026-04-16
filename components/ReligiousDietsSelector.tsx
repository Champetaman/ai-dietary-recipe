"use client";

import { memo } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { SelectionGroup } from "@/components/SelectionGroup";
import religiousDiets from "@/data/ReligiousDiets.json";
import { getLocalizedOptions, getLocalizedText, selectorCopy } from "@/lib/i18n";

interface ReligiousDietsSelectorProps {
  onSelectRestriction: (restrictions: string[]) => void;
  value: string[];
}

function ReligiousDietsSelector({
  onSelectRestriction,
  value,
}: ReligiousDietsSelectorProps) {
  const { language } = useLanguage();
  const copy = selectorCopy[language].religious;

  return (
    <SelectionGroup
      title={getLocalizedText(religiousDiets.header, language)}
      options={getLocalizedOptions(religiousDiets, language)}
      value={value}
      onChange={(nextValue) => {
        onSelectRestriction(Array.isArray(nextValue) ? nextValue : []);
      }}
      selectionMode="multiple"
      allowCustom
      customPlaceholder={copy.customPlaceholder}
      addLabel={copy.addCustom}
      editLabel={copy.editCustom}
      optionClassName="w-28"
    />
  );
}

export default memo(ReligiousDietsSelector);
