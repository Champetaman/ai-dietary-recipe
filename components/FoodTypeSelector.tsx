import React, { useState, useCallback } from "react";

import foodTypes from "../data/FoodOptions.json";

interface FoodTypeSelectorProps {
  onSelectFoodType: (foodType: string) => void;
}

const FoodTypeSelector: React.FC<FoodTypeSelectorProps> = ({
  onSelectFoodType,
}) => {
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);

  const handleClick = useCallback(
    (foodType: string) => {
      setSelectedFoodType(foodType);
      onSelectFoodType(foodType);
    },
    [onSelectFoodType]
  );

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
    </div>
  );
};

const MemoizedTimeSelector = React.memo(FoodTypeSelector);

MemoizedTimeSelector.displayName = "FoodTypeSelector"; // Setting the display name explicitly

export default MemoizedTimeSelector;
