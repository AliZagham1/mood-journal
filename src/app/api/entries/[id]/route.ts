import {NextResponse} from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import Entry from "@/models/Entry";


export async function DELETE(
    req:Request,
    context: {params : Promise<{id : string}>}
){
    try{
        const {id} = await context.params;
        const client = await connectToDatabase();

        const result = await Entry.deleteOne({
            _id: new ObjectId(id),
          });

          if (result.deletedCount === 0) {
            return NextResponse.json({success : false, error : "Entry not found"});
          }
        return NextResponse.json({message : "Entry deleted successfully"});

 
    } catch(err){
        console.error("Delete error:", err);
        return NextResponse.json({error:"Failed to delete entry"}, {status : 500});
    }


    

}