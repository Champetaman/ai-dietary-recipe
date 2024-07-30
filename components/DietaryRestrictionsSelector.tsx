import React, { useState } from "react";

interface DietaryRestrictionsSelectorProps {
  onSelectRestriction: (restrictions: string[]) => void;
}

const DietaryRestrictionsSelector: React.FC<
  DietaryRestrictionsSelectorProps
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

  const restrictions = [
    "Vegetariano",
    "Vegano",
    "Sin gluten",
    "Sin lactosa",
    "Keto",
    "Paleo",
    "Ninguna",
  ];

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-1 text-xl text-center">
        ¿Tienes alguna restricción con tu alimentación?
      </h2>
      <p className="mb-2 text-sm text-center text-gray-600">
        *No es necesario seleccionar alguna restricción
      </p>
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

export default DietaryRestrictionsSelector;
