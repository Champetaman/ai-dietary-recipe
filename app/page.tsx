"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import TimeSelector from "../components/TimeSelector";
import FoodTypeSelector from "../components/FoodTypeSelector";
import DietaryRestrictionsSelector from "../components/DietaryRestrictionsSelector";
import ReligiousRestrictionsSelector from "../components/ReligiousRestrictionsSelector";

export default function Chat() {
  const { error, messages, isLoading, setInput, handleSubmit, reload, stop } =
    useChat({
      keepLastMessageOnError: true,
    });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState<string[]>([]);
  const [selectedReligiousRestrictions, setSelectedReligiousRestrictions] =
    useState<string[]>([]);

  const onSubmit = () => {
    if (!selectedTime || !selectedFoodType) {
      alert("Please select time and food type before submitting.");
      return;
    }

    const prompt = `Suggest a recipe with the following criteria:
    Time: ${selectedTime},
    Food Type: ${selectedFoodType},
    ${
      selectedDietaryRestrictions.length > 0
        ? `Dietary Restrictions: ${selectedDietaryRestrictions.join(", ")},`
        : ""
    }
    ${
      selectedReligiousRestrictions.length > 0
        ? `Religious Restrictions: ${selectedReligiousRestrictions.join(", ")},`
        : ""
    }`;

    setInput(prompt);
    handleSubmit(new Event("submit"));
  };

  const onReset = () => {
    setSelectedTime(null);
    setSelectedFoodType(null);
    setSelectedDietaryRestrictions([]);
    setSelectedReligiousRestrictions([]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md py-24 mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Recetario Inteligente</h1>
      </header>

      <TimeSelector onSelectTime={setSelectedTime} />
      <FoodTypeSelector onSelectFoodType={setSelectedFoodType} />
      <DietaryRestrictionsSelector
        onSelectRestriction={setSelectedDietaryRestrictions}
      />
      <ReligiousRestrictionsSelector
        onSelectRestriction={setSelectedReligiousRestrictions}
      />

      <div className="flex gap-4 mt-4">
        <button onClick={onSubmit} className="btn">
          Sugerir Receta
        </button>
        <button onClick={onReset} className="btn">
          Reiniciar
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-gray-500">
          <div>Loading...</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={stop}
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">Un error ha ocurrido.</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={() => reload()}
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-white rounded shadow w-full">
        {messages
          .filter((m) => m.role === "assistant")
          .map((m) => {
            return (
              <div key={m.id} className="whitespace-pre-wrap">
                <p className="text-lg font-medium mb-2">Respuesta del AI:</p>
                <p className="p-4 bg-gray-100 rounded-md">{m.content}</p>
              </div>
            );
          })}
      </div>

      <footer className="mt-12 text-center text-gray-500">
        © {new Date().getFullYear()}{" "}
        <a href="https://www.camilooviedo.com/" className="hover:underline">
          Camilo Oviedo
        </a>
        . Almost all Rights Reserved.
      </footer>
    </div>
  );
}
