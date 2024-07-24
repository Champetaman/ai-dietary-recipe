import React, { useState } from "react";

interface TimeSelectorProps {
  onSelectTime: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onSelectTime }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const times = ["15 min", "30 min", "45 min", "1 hora", "2 horas", "+2 horas"];

  const handleClick = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">¿Cuánto tiempo tienes para preparar tus alimentos?</h2>
      <div className="flex flex-wrap gap-2">
        {times.map((time) => (
          <button
            key={time}
            className={`btn ${selectedTime === time ? 'btn-selected' : ''}`}
            onClick={() => handleClick(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;
