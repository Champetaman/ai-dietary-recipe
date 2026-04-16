import { NextResponse } from "next/server";

import { createOpenRouterCompletion } from "@/lib/openrouter";

type RecipePayload = {
  title: string;
  overview: string;
  ingredients: string[];
  steps: string[];
};

const IMAGE_PROMPT_MODEL =
  process.env.OPENROUTER_IMAGE_PROMPT_MODEL ?? "openai/gpt-oss-120b:free";
const IMAGE_RENDER_MODEL =
  process.env.OPENROUTER_IMAGE_RENDER_MODEL ??
  "google/gemini-3.1-flash-image-preview";

function isJsonRequest(req: Request) {
  return req.headers.get("content-type")?.includes("application/json");
}

async function parseBody(req: Request) {
  try {
    return (await req.json()) as {
      description?: string;
      recipe?: Partial<RecipePayload>;
      title?: string;
    };
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function normalizeRecipe(recipe?: Partial<RecipePayload> | null) {
  return {
    title: typeof recipe?.title === "string" ? recipe.title.trim() : "",
    overview:
      typeof recipe?.overview === "string" ? recipe.overview.trim() : "",
    ingredients: Array.isArray(recipe?.ingredients)
      ? recipe.ingredients
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    steps: Array.isArray(recipe?.steps)
      ? recipe.steps
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  };
}

function buildRecipeSummary(recipe: RecipePayload, fallbackDescription?: string) {
  return [
    recipe.title && `Dish: ${recipe.title}.`,
    recipe.overview && `Overview: ${recipe.overview}.`,
    recipe.ingredients.length &&
      `Ingredients: ${recipe.ingredients.join(", ")}.`,
    recipe.steps.length && `Method: ${recipe.steps.join(" ")}`,
    fallbackDescription?.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

async function enhanceImagePrompt(recipe: RecipePayload, fallbackDescription?: string) {
  const recipeSummary = buildRecipeSummary(recipe, fallbackDescription);

  const promptResponse = (await createOpenRouterCompletion({
    model: IMAGE_PROMPT_MODEL,
    temperature: 0.4,
    max_tokens: 220,
    messages: [
      {
        role: "system",
        content:
          "Turn recipe input into one concise food photography prompt for the exact same dish. Use title, ingredients, and cooking method to preserve fidelity. Mention plated dish, realistic ingredients, lighting, camera angle, texture, and appetizing presentation. Return plain text only.",
      },
      {
        role: "user",
        content: recipeSummary,
      },
    ],
  })) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return (
    promptResponse.choices?.[0]?.message?.content?.trim() ||
    recipeSummary
  );
}

async function generateImage(prompt: string) {
  const response = (await createOpenRouterCompletion({
    model: IMAGE_RENDER_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    modalities: ["image", "text"],
    image_config: {
      aspect_ratio: "1:1",
    },
  })) as {
    choices?: Array<{
      message?: {
        images?: Array<{
          image_url?: {
            url?: string;
          };
          imageUrl?: {
            url?: string;
          };
        }>;
      };
    }>;
  };

  return (
    response.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
    response.choices?.[0]?.message?.images?.[0]?.imageUrl?.url ??
    null
  );
}

export async function POST(req: Request) {
  try {
    if (!isJsonRequest(req)) {
      return NextResponse.json(
        { message: "Unsupported content type. Use application/json." },
        { status: 415 },
      );
    }

    const { description, recipe, title } = await parseBody(req);
    const normalizedRecipe = normalizeRecipe(recipe);
    const effectiveRecipe = {
      ...normalizedRecipe,
      title: normalizedRecipe.title || (typeof title === "string" ? title.trim() : ""),
    };

    if (
      !effectiveRecipe.title &&
      !effectiveRecipe.overview &&
      !effectiveRecipe.ingredients.length &&
      !effectiveRecipe.steps.length &&
      (!description || typeof description !== "string")
    ) {
      return NextResponse.json(
        { message: "Missing recipe details for image generation." },
        { status: 400 },
      );
    }

    if (description && description.length > 2000) {
      return NextResponse.json(
        { message: "Image description too long. Max 2000 characters." },
        { status: 400 },
      );
    }

    const enhancedPrompt = await enhanceImagePrompt(effectiveRecipe, description);
    const imageUrl = await generateImage(enhancedPrompt);

    if (!imageUrl) {
      return NextResponse.json(
        {
          message:
            "OpenRouter returned no image. Check that the configured image model supports image output.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ imageUrl, fallback: false });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
