"use client";

import { memo } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import { SelectionGroup } from "@/components/SelectionGroup";
import foodTypes from "@/data/FoodOptions.json";
import { getLocalizedOptions, getLocalizedText, selectorCopy } from "@/lib/i18n";

interface FoodTypeSelectorProps {
  onSelectFoodType: (foodType: string | null) => void;
  value: string | null;
}

function FoodTypeSelector({ onSelectFoodType, value }: FoodTypeSelectorProps) {
  const { language } = useLanguage();
  const copy = selectorCopy[language].food;

  return (
    <SelectionGroup
      title={getLocalizedText(foodTypes.header, language)}
      options={getLocalizedOptions(foodTypes, language)}
      value={value}
      onChange={(nextValue) => {
        const valueOrNull =
          typeof nextValue === "string" || nextValue === null ? nextValue : null;
        onSelectFoodType(valueOrNull);
      }}
      selectionMode="single"
      allowCustom
      customPlaceholder={copy.customPlaceholder}
      addLabel={copy.addCustom}
      editLabel={copy.editCustom}
      optionClassName="w-28"
    />
  );
}

export default memo(FoodTypeSelector);
