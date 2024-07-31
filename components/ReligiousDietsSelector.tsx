import React, { useState, useCallback } from "react";

import ReligiousDiets from "../data/ReligiousDiets.json";

interface ReligiousDietsSelectorProps {
  onSelectRestriction: (restrictions: string[]) => void;
}

const ReligiousDietsSelector: React.FC<ReligiousDietsSelectorProps> = ({
  onSelectRestriction,
}) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  const handleSelectRestriction = useCallback(
    (restriction: string) => {
      const isSelected = selectedRestrictions.includes(restriction);
      const newRestrictions = isSelected
        ? selectedRestrictions.filter((r) => r !== restriction)
        : [...selectedRestrictions, restriction];

      setSelectedRestrictions(newRestrictions);
      onSelectRestriction(newRestrictions);
    },
    [onSelectRestriction, selectedRestrictions]
  );

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-1 text-xl text-center">{ReligiousDiets.header}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {ReligiousDiets.options.map((restriction) => (
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

const MemoizedTimeSelector = React.memo(ReligiousDietsSelector);

MemoizedTimeSelector.displayName = "ReligiousDietsSelector"; // Setting the display name explicitly

export default MemoizedTimeSelector;
