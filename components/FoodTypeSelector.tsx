import React, { useState, useCallback } from "react";

// Importing food type options from a JSON file
import foodTypes from "../data/FoodOptions.json";

// Define the props interface for the FoodTypeSelector component
interface FoodTypeSelectorProps {
  onSelectFoodType: (foodType: string | null) => void; // Callback to handle food type selection, allows null to indicate no selection
}

// FoodTypeSelector component definition
const FoodTypeSelector: React.FC<FoodTypeSelectorProps> = ({
  onSelectFoodType,
}) => {
  // State to track the currently selected food type
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  // State to track the custom food type input by the user
  const [customFoodType, setCustomFoodType] = useState<string>("");
  // State to track if a custom food type has been submitted
  const [isCustomFoodTypeSubmitted, setIsCustomFoodTypeSubmitted] =
    useState<boolean>(false);

  /**
   * handleClick - Handles the selection of predefined food types
   * @param foodType - The food type option selected by the user
   */
  const handleClick = useCallback(
    (foodType: string) => {
      if (selectedFoodType === foodType) {
        // If the same food type is clicked again, unselect it
        setSelectedFoodType(null);
        onSelectFoodType(null); // Update parent component with null to indicate no selection
      } else {
        // Select the new food type and update parent component
        setSelectedFoodType(foodType);
        onSelectFoodType(foodType);
        setIsCustomFoodTypeSubmitted(false); // Reset custom submission state if a predefined type is selected
      }
    },
    [selectedFoodType, onSelectFoodType] // Dependencies: selectedFoodType, onSelectFoodType
  );

  /**
   * handleInputChange - Handles changes to the custom food type input
   * @param event - The input change event
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Use regular expression to allow only alphabetic characters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
    setCustomFoodType(filteredValue); // Update the custom food type state
  };

  /**
   * handleCustomFoodTypeSubmit - Handles the submission of a custom food type
   */
  const handleCustomFoodTypeSubmit = () => {
    if (customFoodType.trim() !== "") {
      // Check if the custom food type is not empty
      setSelectedFoodType(customFoodType); // Set the selected food type to the custom input
      onSelectFoodType(customFoodType); // Update parent component with the custom food type
      setIsCustomFoodTypeSubmitted(true); // Mark custom food type as submitted
    } else {
      alert("Por favor, introduzca un tipo de alimento válido."); // Alert if the input is empty or invalid
    }
  };

  /**
   * handleEditCustomFoodType - Allows the user to edit their custom food type
   */
  const handleEditCustomFoodType = () => {
    setIsCustomFoodTypeSubmitted(false); // Allow editing by resetting the submission state
  };

  return (
    <div className="mb-6 w-full">
      {/* Header for the food type selection section */}
      <h2 className="text-lg font-semibold mb-2 text-center">
        {foodTypes.header}
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Render a button for each predefined food type option */}
        {foodTypes.options.map((foodType) => (
          <button
            key={foodType} // Unique key for each button to prevent React warnings
            className={`px-4 py-2 rounded-md btn ${
              selectedFoodType === foodType ? "btn-selected" : "btn-unselected"
            }`} // Style button based on selection
            onClick={() => handleClick(foodType)} // Handle button click
          >
            {foodType} {/* Display the food type option */}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {/* Input field for custom food type */}
        <input
          type="text"
          value={customFoodType}
          onChange={handleInputChange} // Handle input change
          placeholder="Otra"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCustomFoodTypeSubmitted} // Disable input if a custom type has been submitted
        />
        {/* Button to submit custom food type */}
        <button
          type="button"
          onClick={handleCustomFoodTypeSubmit} // Handle custom type submission
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isCustomFoodTypeSubmitted} // Disable add button if a custom type has been submitted
        >
          Añadir
        </button>
        {/* Button to allow editing of custom food type if submitted */}
        {isCustomFoodTypeSubmitted && (
          <button
            type="button"
            onClick={handleEditCustomFoodType} // Handle edit button click
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

// Explicitly set the display name for the memoized component
MemoizedFoodTypeSelector.displayName = "FoodTypeSelector";

// Export the memoized component as default
export default MemoizedFoodTypeSelector;
