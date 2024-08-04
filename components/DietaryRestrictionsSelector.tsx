import React, { useState, useCallback } from "react";

import restrictions from "../data/DietaryRestrictions.json";

interface DietaryRestrictionsSelectorProps {
  onSelectRestriction: (restrictions: string[] | []) => void; // Allow [] to indicate no selection
}

const DietaryRestrictionsSelector: React.FC<
  DietaryRestrictionsSelectorProps
> = ({ onSelectRestriction }) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );
  const [customRestriction, setCustomRestriction] = useState<string>("");
  const [isCustomRestrictionSubmitted, setCustomRestrictionSubmitted] =
    useState<boolean>(false);

  // Handle the selection and deselection of restrictions
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

  // Handle custom restriction input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Use regular expression to allow only alphabetic characters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces only
    setCustomRestriction(filteredValue);
  };

  // Handle custom restriction submission
  const handleCustomRestrictionSubmit = () => {
    if (customRestriction.trim() !== "") {
      const updatedRestrictions = [...selectedRestrictions, customRestriction];
      setSelectedRestrictions(updatedRestrictions);
      onSelectRestriction(updatedRestrictions);
      setCustomRestrictionSubmitted(true); // Mark the custom restriction as submitted
    } else {
      alert("Por favor, introduzca una restricción dietética válida.");
    }
  };

  // Allow the user to edit their custom restriction
  const handleEditCustomRestriction = () => {
    setCustomRestrictionSubmitted(false); // Allow editing by resetting the submission state
  };

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-1 text-xl text-center">{restrictions.header}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {restrictions.options.map((restriction) => (
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
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          value={customRestriction}
          onChange={handleInputChange}
          placeholder="Otro"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCustomRestrictionSubmitted} // Disable input if a custom restriction has been submitted
        />
        <button
          type="button"
          onClick={handleCustomRestrictionSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isCustomRestrictionSubmitted} // Disable add button if a custom restriction has been submitted
        >
          Añadir
        </button>
        {isCustomRestrictionSubmitted && (
          <button
            type="button"
            onClick={handleEditCustomRestriction}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

const MemoizedDietaryRestrictionsSelector = React.memo(
  DietaryRestrictionsSelector
);

MemoizedDietaryRestrictionsSelector.displayName = "DietaryRestrictionsSelector"; // Setting the display name explicitly

export default MemoizedDietaryRestrictionsSelector;
