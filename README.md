# Recetario Inteligente

Recetario Inteligente is an advanced web application that provides personalized recipe suggestions based on user-selected criteria such as ammount of time, cuisine type, dietary restrictions, and religious dietary preferences. Built with modern web technologies, this app leverages AI to enhance the user experience by generating detailed recipe suggestions and accompanying dish images.

## Features

- **Time Selection**: Choose the ammount of time you have to prepare your meal (e.g., 15 min, 30 min, 45 min).
- **Food Type Selection**: Select your preferred cuisine type (e.g., Italian, Chinese, Mexican) or add a custom type.
- **Dietary Restrictions**: Optionally select dietary restrictions (e.g., vegetarian, vegan, gluten-free) or add your own.
- **Religious Diets**: Optionally select any religious dietary restrictions or specify custom restrictions.
- **Recipe Suggestion**: Receive a recipe suggestion based on your selections, including the recipe name, ingredients, and step-by-step instructions.
- **Dish Image Generation**: Generate a realistic image of the suggested dish using DALL·E 3.
- **Reset Functionality**: Clear all selections and restart the process seamlessly.

## Technologies Used

- **React**: For building the user interface.
- **Next.js**: For server-side rendering and API routes.
- **Tailwind CSS**: For styling the application with a utility-first approach.
- **Vercel AI SDK**: For connecting to OpenAI's GPT model.
- **DALL·E 3**: For generating images of the suggested recipes.
- **pnpm**: For managing project dependencies.

## Getting Started

### Prerequisites

- Node.js and pnpm installed on your machine.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Champetaman/ai-dietary-recipe
    cd ai-dietary-recipe
    ```

2. Install dependencies using `pnpm`:
    ```sh
    pnpm install
    ```

3. Set up your environment variables:

   - Create a `.env.local` file in the root directory of your project.
   - Add your OpenAI API key and any other necessary environment variables:
     ```env
     OPENAI_API_KEY=your_openai_api_key
     ```

### Running the Application

1. Start the development server with `pnpm`:
    ```sh
    pnpm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Select Time**: Choose the ammount of time you have to prepare your meal.
2. **Select Food Type**: Select your preferred cuisine type or enter a custom type.
3. **Select Dietary Restrictions**: Optionally select any dietary restrictions or add a custom restriction.
4. **Select Religious Diet**: Optionally select any religious dietary restrictions or specify custom restrictions.
5. **Get Recipe**: Click on "Sugerir Receta" to receive a recipe suggestion.
6. **Generate Image**: Click on "Generar Imagen" to create an AI-generated image of the suggested recipe.
7. **Reset**: Click on "Iniciar Nuevamente" to clear all selections and restart the process.

## Project Structure

- **`components/`**: Contains reusable UI components such as `TimeSelector`, `FoodTypeSelector`, `DietaryRestrictionsSelector`, and `ReligiousDietsSelector`.
- **`app/`**: Contains the main application logic, layout, and API routes.
  - **`page.tsx`**: The main page of the application.
  - **`api/`**: Contains the API route for interacting with OpenAI's API for recipes and image generation.
- **`public/`**: Contains static files such as `favicon.ico`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to existing styles and passes linting checks.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT model and DALL·E 3 for image generation.
- [Vercel](https://vercel.com/) for providing the deployment platform and AI SDK.
- [Next.js](https://nextjs.org/) for the React framework.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.

## Contact

For any inquiries, please reach out to [Camilo Oviedo](https://www.camilooviedo.com).

---

© 2024 Camilo Oviedo. Almost all Rights Reserved.
