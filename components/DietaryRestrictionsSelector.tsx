import React, { useState, useCallback } from "react";

// Importing dietary restriction options from a JSON file
import restrictions from "../data/DietaryRestrictions.json";

// Define the props interface for the DietaryRestrictionsSelector component
interface DietaryRestrictionsSelectorProps {
  onSelectRestriction: (restrictions: string[] | []) => void; // Callback to handle restriction selection, allows an empty array to indicate no selection
}

// DietaryRestrictionsSelector component definition
const DietaryRestrictionsSelector: React.FC<
  DietaryRestrictionsSelectorProps
> = ({ onSelectRestriction }) => {
  // State to track the currently selected dietary restrictions
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );
  // State to track the custom restriction input by the user
  const [customRestriction, setCustomRestriction] = useState<string>("");
  // State to track if a custom restriction has been submitted
  const [isCustomRestrictionSubmitted, setCustomRestrictionSubmitted] =
    useState<boolean>(false);

  /**
   * handleSelectRestriction - Handles the selection and deselection of restrictions
   * @param restriction - The restriction selected or deselected by the user
   */
  const handleSelectRestriction = useCallback(
    (restriction: string) => {
      const isSelected = selectedRestrictions.includes(restriction);
      const newRestrictions = isSelected
        ? selectedRestrictions.filter((r) => r !== restriction) // Remove restriction if already selected
        : [...selectedRestrictions, restriction]; // Add restriction if not selected

      setSelectedRestrictions(newRestrictions);
      onSelectRestriction(newRestrictions); // Update parent component with the new restrictions array
    },
    [onSelectRestriction, selectedRestrictions] // Dependencies: onSelectRestriction, selectedRestrictions
  );

  /**
   * handleInputChange - Handles changes to the custom restriction input
   * @param event - The input change event
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Use regular expression to allow only alphabetic characters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces only
    setCustomRestriction(filteredValue); // Update the custom restriction state
  };

  /**
   * handleCustomRestrictionSubmit - Handles the submission of a custom restriction
   */
  const handleCustomRestrictionSubmit = () => {
    if (customRestriction.trim() !== "") {
      // Check if the custom restriction is not empty
      const updatedRestrictions = [...selectedRestrictions, customRestriction]; // Add custom restriction to the existing ones
      setSelectedRestrictions(updatedRestrictions);
      onSelectRestriction(updatedRestrictions); // Update parent component with the updated restrictions
      setCustomRestrictionSubmitted(true); // Mark the custom restriction as submitted
    } else {
      alert("Por favor, introduzca una restricción dietética válida."); // Alert if the input is empty or invalid
    }
  };

  /**
   * handleEditCustomRestriction - Allows the user to edit their custom restriction
   */
  const handleEditCustomRestriction = () => {
    setCustomRestrictionSubmitted(false); // Allow editing by resetting the submission state
  };

  return (
    <div className="mb-4 w-full">
      {/* Header for the dietary restriction selection section */}
      <h2 className="mb-1 text-xl text-center">{restrictions.header}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Render a button for each predefined restriction option */}
        {restrictions.options.map((restriction) => (
          <button
            key={restriction} // Unique key for each button to prevent React warnings
            onClick={() => handleSelectRestriction(restriction)} // Handle button click
            className={`px-4 py-2 rounded-md btn ${
              selectedRestrictions.includes(restriction)
                ? "btn-selected"
                : "btn-unselected"
            }`} // Style button based on selection
          >
            {restriction} {/* Display the restriction option */}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {/* Input field for custom dietary restriction */}
        <input
          type="text"
          value={customRestriction}
          onChange={handleInputChange} // Handle input change
          placeholder="Otra"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCustomRestrictionSubmitted} // Disable input if a custom restriction has been submitted
        />
        {/* Button to submit custom dietary restriction */}
        <button
          type="button"
          onClick={handleCustomRestrictionSubmit} // Handle custom restriction submission
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isCustomRestrictionSubmitted} // Disable add button if a custom restriction has been submitted
        >
          Añadir
        </button>
        {/* Button to allow editing of custom restriction if submitted */}
        {isCustomRestrictionSubmitted && (
          <button
            type="button"
            onClick={handleEditCustomRestriction} // Handle edit button click
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
const MemoizedDietaryRestrictionsSelector = React.memo(
  DietaryRestrictionsSelector
);

// Explicitly set the display name for the memoized component
MemoizedDietaryRestrictionsSelector.displayName = "DietaryRestrictionsSelector";

// Export the memoized component as default
export default MemoizedDietaryRestrictionsSelector;
