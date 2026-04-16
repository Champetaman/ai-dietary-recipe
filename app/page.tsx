"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import DietaryRestrictionsSelector from "@/components/DietaryRestrictionsSelector";
import FoodTypeSelector from "@/components/FoodTypeSelector";
import { useLanguage } from "@/components/LanguageProvider";
import ReligiousDietsSelector from "@/components/ReligiousDietsSelector";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import TimeSelector from "@/components/TimeSelector";
import { Button } from "@/components/ui/button";
import dietaryOptions from "@/data/DietaryRestrictions.json";
import foodOptions from "@/data/FoodOptions.json";
import religiousOptions from "@/data/ReligiousDiets.json";
import timeOptions from "@/data/TimeOptions.json";
import { FREE_MODELS } from "@/lib/openrouter";
import {
  NONE_OPTION_ID,
  resolveLocalizedSelectionLabel,
  type Language,
} from "@/lib/i18n";

type RecipeResult = {
  title: string;
  overview: string;
  ingredients: string[];
  steps: string[];
};

const copy = {
  es: {
    model: "Modelo",
    controls: "Opciones",
    output: "Resultado",
    recipeButton: "Sugerir receta",
    recipeBusy: "Generando receta...",
    imageButton: "Generar imagen",
    imageBusy: "Generando imagen...",
    resetButton: "Reiniciar",
    placeholderRecipe: "La receta aparecera aqui.",
    ingredients: "Ingredientes",
    steps: "Pasos",
    overview: "Resumen",
    statusIdle: "Listo para generar.",
    errorTitle: "Algo salio mal",
    closeError: "Cerrar",
    recipeErrorFallback:
      "No fue posible generar la receta. Intenta de nuevo en unos segundos.",
    imageErrorFallback:
      "No fue posible generar la imagen. Intenta de nuevo en unos segundos.",
  },
  en: {
    model: "Model",
    controls: "Options",
    output: "Output",
    recipeButton: "Suggest recipe",
    recipeBusy: "Generating recipe...",
    imageButton: "Generate image",
    imageBusy: "Generating image...",
    resetButton: "Reset",
    placeholderRecipe: "Recipe will appear here.",
    ingredients: "Ingredients",
    steps: "Steps",
    overview: "Overview",
    statusIdle: "Ready to generate.",
    errorTitle: "Something went wrong",
    closeError: "Close",
    recipeErrorFallback:
      "Could not generate the recipe. Try again in a few seconds.",
    imageErrorFallback:
      "Could not generate the image. Try again in a few seconds.",
  },
} as const;

function getFriendlyErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function buildPrompt({
  time,
  cuisine,
  dietaryRestrictions,
  religiousDiets,
  language,
}: {
  time: string;
  cuisine: string;
  dietaryRestrictions: string[];
  religiousDiets: string[];
  language: Language;
}) {
  const translatedTime = resolveLocalizedSelectionLabel(
    time,
    timeOptions,
    language,
  );
  const translatedCuisine = resolveLocalizedSelectionLabel(
    cuisine,
    foodOptions,
    language,
  );
  const translatedDietary = dietaryRestrictions.map((item) =>
    resolveLocalizedSelectionLabel(item, dietaryOptions, language),
  );
  const translatedReligious = religiousDiets.map((item) =>
    resolveLocalizedSelectionLabel(item, religiousOptions, language),
  );

  if (language === "es") {
    return [
      "Responde en espanol.",
      `Tiempo disponible: ${translatedTime}.`,
      `Cocina principal: ${translatedCuisine}.`,
      translatedDietary.length
        ? `Restricciones dieteticas: ${translatedDietary.join(", ")}.`
        : "Restricciones dieteticas: ninguna.",
      translatedReligious.length
        ? `Contexto religioso o cultural: ${translatedReligious.join(", ")}.`
        : "Contexto religioso o cultural: ninguno.",
      "Genera receta realista y concreta.",
    ].join("\n");
  }

  return [
    "Respond in English.",
    `Available time: ${translatedTime}.`,
    `Main cuisine: ${translatedCuisine}.`,
    translatedDietary.length
      ? `Dietary restrictions: ${translatedDietary.join(", ")}.`
      : "Dietary restrictions: none.",
    translatedReligious.length
      ? `Religious or cultural context: ${translatedReligious.join(", ")}.`
      : "Religious or cultural context: none.",
    "Generate a realistic, concrete recipe.",
  ].join("\n");
}

export default function HomePage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [selectedModel, setSelectedModel] = useState(FREE_MODELS[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<
    string[]
  >([]);
  const [selectedReligiousDiets, setSelectedReligiousDiets] = useState<string[]>(
    []
  );
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [visibleRecipe, setVisibleRecipe] = useState<RecipeResult | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeBusy, setRecipeBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [status, setStatus] = useState<string>(t.statusIdle);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dietaryFilters = selectedDietaryRestrictions.filter(
    (item) => item !== NONE_OPTION_ID
  );
  const religiousFilters = selectedReligiousDiets.filter(
    (item) => item !== NONE_OPTION_ID
  );
  const hasInvalidNoneSelection =
    (selectedDietaryRestrictions.includes(NONE_OPTION_ID) &&
      selectedDietaryRestrictions.length > 1) ||
    (selectedReligiousDiets.includes(NONE_OPTION_ID) &&
      selectedReligiousDiets.length > 1);
  const canRequestRecipe =
    Boolean(selectedTime && selectedFoodType) &&
    !hasInvalidNoneSelection &&
    !recipeBusy;
  const canGenerateImage = Boolean(recipe) && !imageBusy;

  useEffect(() => {
    if (!recipe) {
      setVisibleRecipe(null);
      return;
    }

    setVisibleRecipe({
      title: "",
      overview: "",
      ingredients: [],
      steps: [],
    });

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    timers.push(
      setTimeout(() => {
        setVisibleRecipe((current) =>
          current
            ? {
                ...current,
                title: recipe.title,
              }
            : current,
        );
      }, 80),
    );

    timers.push(
      setTimeout(() => {
        setVisibleRecipe((current) =>
          current
            ? {
                ...current,
                overview: recipe.overview,
              }
            : current,
        );
      }, 220),
    );

    recipe.ingredients.forEach((item, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleRecipe((current) =>
            current
              ? {
                  ...current,
                  ingredients: [...current.ingredients, item],
                }
              : current,
          );
        }, 360 + index * 90),
      );
    });

    recipe.steps.forEach((item, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleRecipe((current) =>
            current
              ? {
                  ...current,
                  steps: [...current.steps, item],
                }
              : current,
          );
        }, 620 + recipe.ingredients.length * 90 + index * 120),
      );
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [recipe]);

  async function handleRecipeRequest() {
    if (!canRequestRecipe || !selectedTime || !selectedFoodType) {
      return;
    }

    setRecipeBusy(true);
    setRecipeImage(null);
    setStatus(t.recipeBusy);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          language,
          prompt: buildPrompt({
            time: selectedTime,
            cuisine: selectedFoodType,
            dietaryRestrictions: dietaryFilters,
            religiousDiets: religiousFilters,
            language,
          }),
        }),
      });

      const data = (await response.json()) as {
        recipe?: RecipeResult;
        message?: string;
      };

      if (!response.ok || !data.recipe) {
        throw new Error(data.message ?? "Recipe request failed.");
      }

      setRecipe(data.recipe);
      setStatus(data.recipe.title);
    } catch (error) {
      console.error(error);
      setStatus(t.statusIdle);
      setErrorMessage(getFriendlyErrorMessage(error, t.recipeErrorFallback));
    } finally {
      setRecipeBusy(false);
    }
  }

  async function handleGenerateImage() {
    if (!recipe || !canGenerateImage) {
      return;
    }

    setImageBusy(true);
    setStatus(t.imageBusy);

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe,
        }),
      });

      const data = (await response.json()) as {
        imageUrl?: string;
        message?: string;
      };

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.message ?? "Image request failed.");
      }

      setRecipeImage(data.imageUrl);
      setStatus(recipe.title);
    } catch (error) {
      console.error(error);
      setStatus(recipe.title);
      setErrorMessage(getFriendlyErrorMessage(error, t.imageErrorFallback));
    } finally {
      setImageBusy(false);
    }
  }

  function handleReset() {
    setSelectedTime(null);
    setSelectedFoodType(null);
    setSelectedDietaryRestrictions([]);
    setSelectedReligiousDiets([]);
    setRecipe(null);
    setVisibleRecipe(null);
    setRecipeImage(null);
    setStatus(t.statusIdle);
    setErrorMessage(null);
  }

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="shell-frame rounded-2xl p-5">
            <p className="section-label">{t.model}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
              <div className="min-w-0">
                <select
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-[#101010] px-4 text-sm text-foreground focus:border-accent focus:outline-none"
                  style={{ backgroundColor: "#101010", color: "#f2f2f2" }}
                >
                  {FREE_MODELS.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      style={{ backgroundColor: "#101010", color: "#f2f2f2" }}
                    >
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleRecipeRequest} disabled={!canRequestRecipe}>
                {recipeBusy ? t.recipeBusy : t.recipeButton}
              </Button>
              <Button
                variant="secondary"
                onClick={handleGenerateImage}
                disabled={!canGenerateImage}
              >
                {imageBusy ? t.imageBusy : t.imageButton}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {t.resetButton}
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted" aria-live="polite">
              {status}
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="section-label">{t.controls}</p>
              <div className="grid items-stretch gap-4 md:grid-cols-2">
                <TimeSelector onSelectTime={setSelectedTime} value={selectedTime} />
                <FoodTypeSelector
                  onSelectFoodType={setSelectedFoodType}
                  value={selectedFoodType}
                />
                <DietaryRestrictionsSelector
                  onSelectRestriction={setSelectedDietaryRestrictions}
                  value={selectedDietaryRestrictions}
                />
                <ReligiousDietsSelector
                  onSelectRestriction={setSelectedReligiousDiets}
                  value={selectedReligiousDiets}
                />
              </div>
            </div>

            <div className="border-t border-border/70 pt-8" />

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="shell-frame rounded-2xl p-5">
                <p className="section-label">{t.output}</p>
                {visibleRecipe ? (
                  <div className="mt-4 space-y-4 overflow-visible">
                    <div className="min-w-0">
                      <h2 className="break-words font-heading text-3xl font-medium heading-tight">
                        {visibleRecipe.title || "..."}
                      </h2>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">
                        {visibleRecipe.overview}
                      </p>
                    </div>
                    <details open className="rounded-2xl border border-border bg-black/10 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-accent-soft">
                        {t.ingredients}
                      </summary>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                        {visibleRecipe.ingredients.map((item) => (
                          <li key={item} className="whitespace-pre-wrap break-words">
                            - {item}
                          </li>
                        ))}
                      </ul>
                    </details>
                    <details open className="rounded-2xl border border-border bg-black/10 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-accent-soft">
                        {t.steps}
                      </summary>
                      <ol className="mt-3 space-y-2 text-sm leading-7 text-muted">
                        {visibleRecipe.steps.map((item, index) => (
                          <li
                            key={`${index + 1}-${item}`}
                            className="whitespace-pre-wrap break-words"
                          >
                            {index + 1}. {item}
                          </li>
                        ))}
                      </ol>
                    </details>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-subtle">{t.placeholderRecipe}</p>
                )}
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-border">
                  {recipeImage ? (
                  <Image
                    src={recipeImage}
                    alt={recipe?.title ?? "Dish preview"}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                    className="aspect-square w-full object-cover"
                  />
                  ) : (
                    <div className="aspect-square rounded-2xl border border-dashed border-border" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
      {errorMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="error-title"
            className="shell-frame w-full max-w-md rounded-2xl p-5"
          >
            <p id="error-title" className="font-heading text-xl text-foreground">
              {t.errorTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">{errorMessage}</p>
            <div className="mt-5 flex justify-end">
              <Button size="sm" onClick={() => setErrorMessage(null)}>
                {t.closeError}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
