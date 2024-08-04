import React, { useState, useCallback } from "react";

import foodTypes from "../data/FoodOptions.json";

interface FoodTypeSelectorProps {
  onSelectFoodType: (foodType: string | null) => void; // Allow null to indicate no selection
}

const FoodTypeSelector: React.FC<FoodTypeSelectorProps> = ({
  onSelectFoodType,
}) => {
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [customFoodType, setCustomFoodType] = useState<string>("");
  const [isCustomFoodTypeSubmitted, setIsCustomFoodTypeSubmitted] = useState<boolean>(false);

  // Handle button click for predefined food types
  const handleClick = useCallback(
    (foodType: string) => {
      if (selectedFoodType === foodType) {
        // Unselect the option if it's already selected
        setSelectedFoodType(null);
        onSelectFoodType(null);
      } else {
        setSelectedFoodType(foodType);
        onSelectFoodType(foodType);
        setIsCustomFoodTypeSubmitted(false); // Reset custom submission state if a predefined type is selected
      }
    },
    [selectedFoodType, onSelectFoodType]
  );

  // Handle custom food type input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Use regular expression to allow only alphabetic characters
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
    setCustomFoodType(filteredValue);
  };

  // Handle custom food type submission
  const handleCustomFoodTypeSubmit = () => {
    if (customFoodType.trim() !== "") {
      setSelectedFoodType(customFoodType);
      onSelectFoodType(customFoodType);
      setIsCustomFoodTypeSubmitted(true); // Mark custom food type as submitted
    } else {
      alert("Por favor, introduzca un tipo de alimento válido.");
    }
  };

  // Allow the user to edit their custom food type
  const handleEditCustomFoodType = () => {
    setIsCustomFoodTypeSubmitted(false); // Allow editing by resetting the submission state
  };

  return (
    <div className="mb-6 w-full">
      <h2 className="text-lg font-semibold mb-2 text-center">
        {foodTypes.header}
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {foodTypes.options.map((foodType) => (
          <button
            key={foodType}
            className={`px-4 py-2 rounded-md btn ${
              selectedFoodType === foodType ? "btn-selected" : "btn-unselected"
            }`}
            onClick={() => handleClick(foodType)}
          >
            {foodType}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          value={customFoodType}
          onChange={handleInputChange}
          placeholder="Otro"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCustomFoodTypeSubmitted} // Disable input if a custom type has been submitted
        />
        <button
          type="button"
          onClick={handleCustomFoodTypeSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isCustomFoodTypeSubmitted} // Disable add button if a custom type has been submitted
        >
          Añadir
        </button>
        {isCustomFoodTypeSubmitted && (
          <button
            type="button"
            onClick={handleEditCustomFoodType}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

// Memoizing the component to prevent unnecessary re-renders
const MemoizedFoodTypeSelector = React.memo(FoodTypeSelector);

MemoizedFoodTypeSelector.displayName = "FoodTypeSelector"; // Setting the display name explicitly

export default MemoizedFoodTypeSelector;
