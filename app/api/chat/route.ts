import { NextResponse } from "next/server";

import {
  FREE_MODELS,
  createOpenRouterCompletion,
  isSupportedFreeModel,
} from "@/lib/openrouter";

type RecipeResponse = {
  title: string;
  overview: string;
  ingredients: string[];
  steps: string[];
};

function isJsonRequest(req: Request) {
  return req.headers.get("content-type")?.includes("application/json");
}

async function parseBody(req: Request) {
  try {
    return (await req.json()) as {
      model?: string;
      prompt?: string;
      language?: "es" | "en";
    };
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function extractJsonObject(content: string) {
  const fencedMatch = content.match(/```json\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return valid JSON.");
  }

  return content.slice(start, end + 1);
}

function parseRecipeContent(content: string) {
  try {
    return JSON.parse(content) as unknown;
  } catch {
    return JSON.parse(extractJsonObject(content)) as unknown;
  }
}

function normalizeRecipe(data: unknown): RecipeResponse {
  const value = data as Partial<RecipeResponse> | null | undefined;

  return {
    title:
      typeof value?.title === "string" && value.title.trim()
        ? value.title.trim()
        : "Generated dish",
    overview:
      typeof value?.overview === "string" && value.overview.trim()
        ? value.overview.trim()
        : "",
    ingredients: Array.isArray(value?.ingredients)
      ? value.ingredients
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    steps: Array.isArray(value?.steps)
      ? value.steps
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  };
}

export async function POST(req: Request) {
  try {
    if (!isJsonRequest(req)) {
      return NextResponse.json(
        { message: "Unsupported content type. Use application/json." },
        { status: 415 },
      );
    }

    const { model, prompt, language } = await parseBody(req);

    if (!model || !isSupportedFreeModel(model)) {
      return NextResponse.json({ message: "Unsupported model." }, { status: 400 });
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ message: "Missing prompt." }, { status: 400 });
    }

    if (prompt.length > 3000) {
      return NextResponse.json(
        { message: "Prompt too long. Max 3000 characters." },
        { status: 400 },
      );
    }

    if (language !== "es" && language !== "en") {
      return NextResponse.json(
        { message: "Unsupported language." },
        { status: 400 },
      );
    }

    const systemPrompt =
      language === "es"
        ? [
            "Eres chef practico y editor culinario.",
            "Debes responder solo JSON valido.",
            'Usa exactamente este objeto: {"title":"string","overview":"string","ingredients":["string"],"steps":["string"]}.',
            "No uses markdown. No uses texto fuera del JSON.",
          ].join(" ")
        : [
            "You are a practical chef and culinary editor.",
            "Return valid JSON only.",
            'Use exactly this object: {"title":"string","overview":"string","ingredients":["string"],"steps":["string"]}.',
            "Do not use markdown. Do not add text outside JSON.",
          ].join(" ");

    const fallbackModels = [
      model,
      ...FREE_MODELS.map((item) => item.id).filter((item) => item !== model),
    ].slice(0, 3);

    const completion = (await createOpenRouterCompletion({
      models: fallbackModels,
      temperature: 0.4,
      max_tokens: 900,
      provider: {
        allow_fallbacks: true,
        require_parameters: false,
      },
      response_format: {
        type: "json_object",
      },
      plugins: [{ id: "response-healing" }],
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.trim() },
      ],
    })) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
      model?: string;
    };

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        `OpenRouter returned no assistant content for models [${fallbackModels.join(", ")}].`,
      );
    }

    const recipe = normalizeRecipe(parseRecipeContent(content));

    if (!recipe.title || !recipe.ingredients.length || !recipe.steps.length) {
      throw new Error(
        `Recipe payload invalid for models [${fallbackModels.join(", ")}]. Expected title, ingredients, and steps.`,
      );
    }

    return NextResponse.json({
      recipe,
      model: completion.model ?? model,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Recipe generation failed. ${error.message}`
        : "Recipe generation failed. Unknown server error.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
