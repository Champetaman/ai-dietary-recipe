import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json(); // Parse the JSON body

    // Call the OpenAI DALL·E API to generate an image
    const response = await openai.images.generate({
      prompt: description,
      n: 1, // Number of images to generate
      size: "256x256", // Set the image size
    });

    const imageUrl = response.data[0]?.url; // Extract the image URL from the response

    if (imageUrl) {
      return NextResponse.json({ imageUrl });
    } else {
      return NextResponse.json({ message: "Failed to generate image." });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating image:", error.message);
      return NextResponse.json({
        message: "Error generating image.",
        error: error.message,
      });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ message: "Unexpected error occurred." });
    }
  }
}
