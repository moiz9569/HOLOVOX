import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";

export async function POST(){
const {userId,name,email,meetingId}= await request.json();

if(!userId || !name || !email || !meetingId){
    return NextResponse.json({error : "Missing required fields"}, {status:400});
}
await connectDB();
 
}

export async function GET(){

}
export async function PUT(){
const {userId,name,email,meetingId}= await request.json();
}