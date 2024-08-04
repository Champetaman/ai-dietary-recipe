import React, { useState, useCallback } from "react";

// Importing time options from a JSON file
import times from "../data/TimeOptions.json";

// Define the props interface for the TimeSelector component
interface TimeSelectorProps {
  onSelectTime: (time: string | null) => void; // Callback to handle time selection, allows null to indicate no selection
}

// TimeSelector component definition
const TimeSelector: React.FC<TimeSelectorProps> = ({ onSelectTime }) => {
  // State to track the currently selected time option
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /**
   * handleSelectTime - Handles time selection logic
   * @param time - The time option selected by the user
   */
  const handleSelectTime = useCallback(
    (time: string) => {
      if (selectedTime === time) {
        // If the same time is clicked again, unselect it
        setSelectedTime(null);
        onSelectTime(null); // Update parent component with null to indicate no selection
      } else {
        // Select the new time and update parent component
        setSelectedTime(time);
        onSelectTime(time);
      }
    },
    [selectedTime, onSelectTime] // Dependencies: selectedTime, onSelectTime
  );

  return (
    <div className="mb-4 w-full">
      {/* Header for the time selection section */}
      <h2 className="mb-2 text-xl text-center">{times.header}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Render a button for each time option */}
        {times.options.map((time) => (
          <button
            key={time} // Unique key for each button to prevent React warnings
            onClick={() => handleSelectTime(time)} // Handle button click
            className={`px-4 py-2 rounded-md btn ${
              selectedTime === time ? "btn-selected" : "btn-unselected"
            }`} // Style button based on selection
          >
            {time} {/* Display the time option */}
          </button>
        ))}
      </div>
    </div>
  );
};

// Memoize the TimeSelector component to avoid unnecessary re-renders
const MemoizedTimeSelector = React.memo(TimeSelector);

// Explicitly set the display name for the memoized component
MemoizedTimeSelector.displayName = "TimeSelector";

// Export the memoized component as default
export default MemoizedTimeSelector;
