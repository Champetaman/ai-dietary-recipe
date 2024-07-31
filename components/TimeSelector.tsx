import React, { useState, useCallback } from "react";

import times from "../data/TimeOptions.json";
interface TimeSelectorProps {
  onSelectTime: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onSelectTime }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectTime = useCallback(
    (time: string) => {
      setSelectedTime(time);
      onSelectTime(time);
    },
    [onSelectTime]
  );

  return (
    <div className="mb-4 w-full">
      <h2 className="mb-2 text-xl text-center">{times.header}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {times.options.map((time) => (
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

const MemoizedTimeSelector = React.memo(TimeSelector);

MemoizedTimeSelector.displayName = "TimeSelector"; // Setting the display name explicitly

export default MemoizedTimeSelector;
