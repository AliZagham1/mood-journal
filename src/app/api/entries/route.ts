import {NextResponse} from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Entry from "@/models/Entry";

export async function POST(req : Request) {
    try {
        
        await connectToDatabase();
        const {mood,note} = await req.json();

        const newEntry = await Entry.create({mood, note});


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
