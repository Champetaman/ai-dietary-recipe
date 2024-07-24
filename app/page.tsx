"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import TimeSelector from "../components/TimeSelector";
import FoodTypeSelector from "../components/FoodTypeSelector";
import DietaryRestrictionsSelector from "../components/DietaryRestrictionsSelector";
import ReligiousRestrictionsSelector from "../components/ReligiousRestrictionsSelector";
import Image from "next/image";

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
    }
    Please include an image of the recipe.`;

    setInput(prompt);
    handleSubmit(new Event("submit"));
  };

  const parseImageUrl = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    console.log(urlMatch);
    return urlMatch ? urlMatch[0] : null;
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
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

      <button onClick={onSubmit} className="btn">
        Sugerir Receta
      </button>

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

      <div className="mt-4 p-4 bg-white rounded shadow">
        {messages
          .filter((m) => m.role === "assistant")
          .map((m) => {
            const imageUrl = parseImageUrl(m.content);
            const textWithoutImageUrl = imageUrl
              ? m.content.replace(imageUrl, "").trim()
              : m.content;
            return (
              <div key={m.id} className="whitespace-pre-wrap">
                {textWithoutImageUrl}
                {/* {imageUrl && (
                  <div className="mt-4 relative w-full h-64">
                    <Image
                      src={imageUrl}
                      alt="Recipe"
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                )} */}
              </div>
            );
          })}
      </div>

      <footer className="mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} Camilo Oviedo. Almost all Rights Reserved.
      </footer>
    </div>
  );
}
