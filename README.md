# Recetario Inteligente

Recetario Inteligente is a web application that suggests recipes based on user-selected parameters such as time of day, food type, dietary restrictions, and religious diet. The app is built with React, Next.js, Tailwind CSS, and utilizes the Vercel AI SDK to connect to OpenAI's GPT model for generating recipe suggestions.

## Features

- **Time Selection**: Choose the time of day for which you need a recipe (e.g., breakfast, lunch, dinner).
- **Food Type Selection**: Select the type of cuisine you prefer (e.g., Italian, Chinese, Mexican).
- **Dietary Restrictions**: Optionally select any dietary restrictions (e.g., vegetarian, vegan, gluten-free).
- **Religious Diets**: Optionally select any religious dietary restrictions.
- **Recipe Suggestion**: Get a recipe suggestion based on your selections, including the recipe name, ingredients and instructions.
- **Reset Functionality**: Clear all selections and restart the process.

## Technologies Used

- **React**: For building the user interface.
- **Next.js**: For server-side rendering and API routes.
- **Tailwind CSS**: For styling the application.
- **Vercel AI SDK**: For connecting to OpenAI's GPT model.

## Getting Started

### Prerequisites

- Node.js and pnpm installed on your machine.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Champetaman/ai-dietary-recipe
    cd ai-dietary-recipe
    ```

2. Install dependencies:
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

1. Start the development server:
    ```sh
    pnpm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Select Time**: Choose the time of day for your recipe.
2. **Select Food Type**: Select your preferred cuisine type.
3. **Select Dietary Restrictions**: Optionally select any dietary restrictions you have.
4. **Select Religious Diet**: Optionally select any religious dietary restrictions.
5. **Get Recipe**: Click on "Sugerir Receta" to get a recipe suggestion.
6. **Reset**: Click on "Reset" to clear all selections and restart the process.

## Project Structure

- `components/`: Contains the reusable UI components like TimeSelector, FoodTypeSelector, DietaryRestrictionsSelector, and ReligiousRestrictionsSelector.
- `pages/`: Contains the main page of the application.
- `api/`: Contains the API route for interacting with OpenAI's API.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT-3.5-turbo model.
- [Vercel](https://vercel.com/) for providing the deployment platform and AI SDK.
- [Next.js](https://nextjs.org/) for the React framework.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.

## Contact

For any inquiries, please reach out to [Camilo Oviedo](https://www.camilooviedo.com).

---

© 2024 Camilo Oviedo. Almost all Rights Reserved.
