"use client";

import { memo } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { SelectionGroup } from "@/components/SelectionGroup";
import restrictions from "@/data/DietaryRestrictions.json";
import { getLocalizedOptions, getLocalizedText, selectorCopy } from "@/lib/i18n";

interface DietaryRestrictionsSelectorProps {
  onSelectRestriction: (restrictions: string[]) => void;
  value: string[];
}

function DietaryRestrictionsSelector({
  onSelectRestriction,
  value,
}: DietaryRestrictionsSelectorProps) {
  const { language } = useLanguage();
  const copy = selectorCopy[language].dietary;

  return (
    <SelectionGroup
      title={getLocalizedText(restrictions.header, language)}
      options={getLocalizedOptions(restrictions, language)}
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

export default memo(DietaryRestrictionsSelector);
