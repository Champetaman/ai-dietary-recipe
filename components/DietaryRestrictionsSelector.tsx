import React, { useState } from "react";

interface DietaryRestrictionsSelectorProps {
  onSelectRestriction: (restriction: string[]) => void;
}

const DietaryRestrictionsSelector: React.FC<
  DietaryRestrictionsSelectorProps
> = ({ onSelectRestriction }) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );
  const restrictions = ["Vegetariana", "Vegana", "Sin Gluten", "Sin Lácteos"];

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
        ¿Tienes algún tipo de restricción en tu dieta?
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

export default DietaryRestrictionsSelector;
