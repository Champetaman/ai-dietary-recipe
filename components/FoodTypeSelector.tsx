import React, { useState } from "react";

interface FoodTypeSelectorProps {
  onSelectFoodType: (foodType: string) => void;
}

const FoodTypeSelector: React.FC<FoodTypeSelectorProps> = ({ onSelectFoodType }) => {
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const foodTypes = [
    "India",
    "Mexicana",
    "Libanesa",
    "Japonesa",
    "China",
    "Española",
    "Francesa",
    "Italiana",
  ];

  const handleClick = (foodType: string) => {
    setSelectedFoodType(foodType);
    onSelectFoodType(foodType);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">¿Qué tipo de comida te gustaría comer?</h2>
      <div className="flex flex-wrap gap-2">
        {foodTypes.map((foodType) => (
          <button
            key={foodType}
            className={`btn ${selectedFoodType === foodType ? 'btn-selected' : ''}`}
            onClick={() => handleClick(foodType)}
          >
            {foodType}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodTypeSelector;
