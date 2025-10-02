import {NextResponse} from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Entry from "@/models/Entry";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function getAIReflection(mood: number, note?: string) {
    const prompt = note
      ? `The user reported a mood of ${mood}/10 and wrote: "${note}". Write a short, thoughtful reflection to help them process this mood. Do not write very long feedback and write in a way that the user feels it is wrtten by a human`
      : `The user reported a mood of ${mood}/10 but did not write any notes. Give a short supportive reflection. Do not write very long feedback and write in a way that the user feels it is wrtten by a human`;
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
       
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    console.log("AI reflection:", response.text);
  
    return response.text || "No reflection generated.";
  }
export async function POST(req : Request) {
    try {
        
        await connectToDatabase();
        const {mood,note} = await req.json();

        if (!mood) {
            return NextResponse.json({ error: "Mood is required" }, { status: 400 });
          }

        const aiReflection = await getAIReflection(mood, note || "");

        const newEntry = await Entry.create({mood, note, aiReflection});


        return NextResponse.json({success : true, entry : newEntry});

    } catch  (error:any){
        return NextResponse.json({success : false, error : error.message});

    }
}

    export async function GET() {
        try {
            await connectToDatabase();
            const entries = await Entry.find().sort({createdAt: -1});
            return NextResponse.json({success : true, entries});

        } catch (error:any) {
            return NextResponse.json({success : false, error : error.message});
        }
    }
