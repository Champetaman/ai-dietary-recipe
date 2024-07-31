"use client";

import React, { useState, useCallback } from "react";
import { useChat } from "ai/react";
import TimeSelector from "../components/TimeSelector";
import FoodTypeSelector from "../components/FoodTypeSelector";
import DietaryRestrictionsSelector from "../components/DietaryRestrictionsSelector";
import ReligiousDietsSelector from "../components/ReligiousDietsSelector";

export default function Chat() {
  const { error, messages, isLoading, setInput, handleSubmit, reload, stop } =
    useChat({
      keepLastMessageOnError: true,
    });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState<string[]>([]);
  const [selectedReligiousDiets, setselectedReligiousDiets] = useState<
    string[]
  >([]);

  const validateSelections = useCallback(() => {
    if (!selectedTime || !selectedFoodType) {
      alert(
        "Por favor selecciona al menos un tiempo estimado y la comida que te gustaría comer."
      );
      return false;
    }

    if (
      (selectedDietaryRestrictions.includes("Ninguna") &&
        selectedDietaryRestrictions.length > 1) ||
      (selectedReligiousDiets.includes("Ninguna") &&
        selectedReligiousDiets.length > 1)
    ) {
      alert(
        'No puedes seleccionar la opción: "Ninguna" con otras restricciones dietéticas.'
      );
      return false;
    }
    return true;
  }, [
    selectedTime,
    selectedFoodType,
    selectedDietaryRestrictions,
    selectedReligiousDiets,
  ]);

  const onSubmit = useCallback(() => {
    if (!validateSelections()) return;

    const prompt = `Sugiera una receta con los siguientes criterios:
      1. **Tiempo:** ${selectedTime},
      2. **Tipo de comida:** ${selectedFoodType},
      ${
        selectedDietaryRestrictions.length > 0
          ? `3. **Restricción alimentaria:** ${selectedDietaryRestrictions.join(
              ", "
            )},`
          : ""
      }
      ${
        selectedReligiousDiets.length > 0
          ? `4. **Restricción religiosa:** ${selectedReligiousDiets.join(
              ", "
            )},`
          : ""
      }
      Por favor, proporcione una receta que se ajuste a los criterios mencionados anteriormente. Incluya lo siguiente en su respuesta:
      - **Nombre de la receta**
      - **Lista de ingredientes**
      - **Instrucciones paso a paso detalladas**
      - **Preparación y tiempo de cocción**

      Asegurese de que la receta es clara, los ingredientes están en medición imperial y que sea fácil de seguir. Gracias!`;

    setInput(prompt);
    handleSubmit(new Event("submit"));
  }, [
    setInput,
    handleSubmit,
    validateSelections,
    selectedTime,
    selectedFoodType,
    selectedDietaryRestrictions,
    selectedReligiousDiets,
  ]);

  const onReset = useCallback(() => {
    setSelectedTime(null);
    setSelectedFoodType(null);
    setSelectedDietaryRestrictions([]);
    setselectedReligiousDiets([]);
    setInput("");
    window.location.reload();
  }, [setInput]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl py-24 mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Recetario Inteligente</h1>
      </header>
      <TimeSelector onSelectTime={setSelectedTime} />
      <FoodTypeSelector onSelectFoodType={setSelectedFoodType} />
      <DietaryRestrictionsSelector
        onSelectRestriction={setSelectedDietaryRestrictions}
      />
      <ReligiousDietsSelector onSelectRestriction={setselectedReligiousDiets} />

      <div className="flex w-full space-x-2 mt-5">
        <button onClick={onSubmit} className="w-full btn">
          Sugerir Receta
        </button>
        <button onClick={onReset} className="w-full btn">
          Iniciar Nuevamente
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
          .map((m) => (
            <div key={m.id} className="whitespace-pre-wrap mb-6">
              <p className="text-lg font-medium mb-2">Platillo recomendado:</p>
              <p className="p-4 bg-gray-100 rounded-md">{m.content}</p>
            </div>
          ))}
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
