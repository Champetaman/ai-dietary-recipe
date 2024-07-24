import React, { useState } from "react";

interface TimeSelectorProps {
  onSelectTime: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onSelectTime }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  const times = ["15 min", "30 min", "45 min", "1 hora", "2 horas", "+2 horas"];

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-2 text-xl text-center">
        ¿Cuánto tiempo tienes para preparar tus alimentos?
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => handleSelectTime(time)}
            className={`px-4 py-2 rounded-md btn ${
              selectedTime === time ? "btn-selected" : "btn-unselected"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;
