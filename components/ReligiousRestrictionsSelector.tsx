import React, { useState } from "react";

interface ReligiousRestrictionsSelectorProps {
  onSelectRestriction: (restriction: string[]) => void;
}

const ReligiousRestrictionsSelector: React.FC<
  ReligiousRestrictionsSelectorProps
> = ({ onSelectRestriction }) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );
  const restrictions = ["Kosher", "Halal"];

  const handleClick = (restriction: string) => {
    const updatedRestrictions = selectedRestrictions.includes(restriction)
      ? selectedRestrictions.filter((r) => r !== restriction)
      : [...selectedRestrictions, restriction];

    setSelectedRestrictions(updatedRestrictions);
    onSelectRestriction(updatedRestrictions);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">
        ¿Tienes algún tipo de restricción religiosa?
      </h2>
      <div className="flex flex-wrap gap-2">
        {restrictions.map((restriction) => (
          <button
            key={restriction}
            className={`btn ${
              selectedRestrictions.includes(restriction) ? "btn-selected" : ""
            }`}
            onClick={() => handleClick(restriction)}
          >
            {restriction}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReligiousRestrictionsSelector;
