# AI Recipe Studio

AI Recipe Studio is a bilingual web application for generating recipe recommendations and visual dish previews from a small set of cooking preferences. The experience is intentionally streamlined: the user selects a time window, cuisine, dietary restrictions, and religious diet preferences, chooses an OpenRouter chat model, generates a structured recipe, and then requests an AI-generated image based on that exact recipe.

The application is built with Next.js and React, uses a lightweight Tailwind CSS v4 styling system, and integrates with OpenRouter for both text and image workflows. Recipe generation returns structured JSON, while image generation derives its prompt from the previously generated recipe so the visual output stays aligned with the dish recommendation shown in the interface.

## Features

- Bilingual interface in English and Spanish
- Data-driven option sets for filters and labels
- User-selectable OpenRouter chat models from environment configuration
- Structured recipe generation with title, overview, ingredients, and steps
- Image generation based on the exact generated recipe payload
- Professional, minimal single-page layout
- Friendly frontend error handling via modal dialogs
- Server-side validation for request shape, language, and payload length

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- OpenRouter API
- Vercel Analytics

## How It Works

### Recipe Generation

The frontend collects the selected cooking criteria and sends them to the chat API route. That route:

1. Validates the request content type and payload
2. Verifies the selected model against the configured chat model list
3. Sends the prompt to OpenRouter
4. Enforces a structured JSON response
5. Normalizes the recipe into a consistent shape before returning it

The final recipe object contains:

- `title`
- `overview`
- `ingredients`
- `steps`

### Image Generation

Image generation is a two-step pipeline:

1. A prompt-enhancement model rewrites the generated recipe into a concise food-photography prompt
2. A dedicated image-capable model renders the dish image through OpenRouter

The important design constraint is that image generation is not based on generic filter selections alone. It is based on the actual recipe returned by the recipe-generation step, including the recipe title, overview, ingredients, and steps. This keeps the visual result tied to the recommended dish rather than a broad cuisine category.

## Project Structure

```text
app/
  api/
    chat/route.ts
    generateImage/route.ts
  layout.tsx
  page.tsx

components/
  LanguageProvider.tsx
  SelectionGroup.tsx
  SiteFooter.tsx
  SiteHeader.tsx
  TimeSelector.tsx
  FoodTypeSelector.tsx
  DietaryRestrictionsSelector.tsx
  ReligiousDietsSelector.tsx
  ui/

data/
  TimeOptions.json
  FoodOptions.json
  DietaryRestrictions.json
  ReligiousDiets.json

lib/
  i18n.ts
  openrouter.ts
```

## Environment Variables

Create a local environment file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OPENROUTER_CHAT_MODELS=model-id-1|Label 1,model-id-2|Label 2
OPENROUTER_IMAGE_PROMPT_MODEL=your_prompt_model
OPENROUTER_IMAGE_RENDER_MODEL=your_image_model
```

### Variable Reference

- `OPENROUTER_API_KEY`
  Required. OpenRouter API key used by server routes.

- `NEXT_PUBLIC_APP_URL`
  Optional but recommended. Used as the HTTP referrer when sending OpenRouter requests.

- `NEXT_PUBLIC_OPENROUTER_CHAT_MODELS`
  Required for deployment consistency. Comma-separated list of chat models shown in the frontend model selector.

  Format:

  ```env
  NEXT_PUBLIC_OPENROUTER_CHAT_MODELS=model-id|Label,model-id|Label
  ```

  Example:

  ```env
  NEXT_PUBLIC_OPENROUTER_CHAT_MODELS=meta-llama/llama-3.3-70b-instruct:free|Llama 3.3 70B,openai/gpt-oss-120b:free|OpenAI 120B
  ```

- `OPENROUTER_IMAGE_PROMPT_MODEL`
  Required for image workflow. Model used to transform a recipe into a compact image-generation prompt.

- `OPENROUTER_IMAGE_RENDER_MODEL`
  Required for image workflow. Model used to generate the actual dish image.

## Installation

Install dependencies with pnpm:

```bash
pnpm install
```

## Development

Start the local development server:

```bash
pnpm dev
```

The app runs by default at:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - start the development server
- `pnpm build` - create a production build
- `pnpm start` - run the production server
- `pnpm lint` - run linting

## API Endpoints

### `POST /api/chat`

Generates a structured recipe from the selected filters and model.

Expected request shape:

```json
{
  "model": "openai/gpt-oss-120b:free",
  "language": "en",
  "prompt": "Respond in English..."
}
```

Expected response shape:

```json
{
  "recipe": {
    "title": "Roasted Vegetable Bowl",
    "overview": "A balanced weeknight dish...",
    "ingredients": ["1 cup rice", "2 carrots"],
    "steps": ["Cook the rice", "Roast the vegetables"]
  },
  "model": "openai/gpt-oss-120b:free"
}
```

### `POST /api/generateImage`

Generates a dish image from a full recipe object.

Expected request shape:

```json
{
  "recipe": {
    "title": "Roasted Vegetable Bowl",
    "overview": "A balanced weeknight dish...",
    "ingredients": ["1 cup rice", "2 carrots"],
    "steps": ["Cook the rice", "Roast the vegetables"]
  }
}
```

Expected response shape:

```json
{
  "imageUrl": "https://..."
}
```

## Localization

Localization is data-driven. Filter definitions include both English and Spanish labels directly in the JSON option files under `data/`. This avoids the earlier mismatch risk where UI text and translation mappings could drift out of sync.

## Error Handling

The application includes both server-side and client-side error handling:

- API routes validate content type and payload shape
- Recipe and image requests enforce length checks
- Upstream OpenRouter failures are normalized into readable error messages
- The frontend presents failures in a modal dialog instead of rendering raw errors inline

## Security Notes

- Never commit real API keys to source control
- Keep `.env.local` out of version control
- Use different keys for local, staging, and production environments when possible
- Review model access and billing settings in OpenRouter before deployment

## Deployment

The project is well suited for deployment on Vercel or any environment capable of running a standard Next.js application. Before deploying, confirm that all required environment variables are present and that the configured image-render model supports image output through OpenRouter.

## License

This project is private unless you explicitly add a license for redistribution or commercial use.
