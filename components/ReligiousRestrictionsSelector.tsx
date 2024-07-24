import React, { useState } from "react";

interface ReligiousRestrictionsSelectorProps {
  onSelectRestriction: (restrictions: string[]) => void;
}

const ReligiousRestrictionsSelector: React.FC<
  ReligiousRestrictionsSelectorProps
> = ({ onSelectRestriction }) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  const handleSelectRestriction = (restriction: string) => {
    const isSelected = selectedRestrictions.includes(restriction);
    const newRestrictions = isSelected
      ? selectedRestrictions.filter((r) => r !== restriction)
      : [...selectedRestrictions, restriction];

    setSelectedRestrictions(newRestrictions);
    onSelectRestriction(newRestrictions);
  };

  const restrictions = ["Halal", "Kosher", "Hindu", "Buddhist"];

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-2 text-xl text-center">
        ¿Tienes alguna restricción religiosa?
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {restrictions.map((restriction) => (
          <button
            key={restriction}
            onClick={() => handleSelectRestriction(restriction)}
            className={`px-4 py-2 rounded-md btn ${
              selectedRestrictions.includes(restriction)
                ? "btn-selected"
                : "btn-unselected"
            }`}
          >
            {restriction}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReligiousRestrictionsSelector;
