import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
import NotesModel from "@/app/models/notes.model";
import { connectDB } from "../../../../../lib/db";


// ==========================
// 📥 CREATE NOTE (POST)
// ==========================
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { meetingId, userId, note } = body;
    console.log("Create Note Payload:", { meetingId, userId, note });
     if (!meetingId || !userId || !note ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }
     
      const notes = await NotesModel.create({
        meetingId,
        userId,
        Notes: note,
      });
      console.log("New Notes Document Created:", notes);
      return NextResponse.json({ success: true, data: notes });
    }

   catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// ==========================
// 📤 GET NOTES (GET)
// ==========================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const meetingId = searchParams.get("meetingId");
    if (!userId ) {
  return NextResponse.json(
    { success: false, message: "userId and meetingId required" },
    { status: 400 }
  );
}
let notes;
if(meetingId && userId){
  notes = await NotesModel.find({ meetingId, userId }).sort({
      createdAt: -1,
    }).lean();
}else{
  notes = await NotesModel.find({ userId }).sort({
      createdAt: -1,
    }).lean();
}
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ==========================
// ✏️ UPDATE NOTE (PUT)
// ==========================
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { noteId, newText } = body;

    const noteDoc = await NotesModel.findById(noteId);

    if (!noteDoc) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    // 🔥 update specific index
    noteDoc.Notes = newText;

    await noteDoc.save();

    return NextResponse.json({ success: true, data: noteDoc });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ==========================
// ❌ DELETE NOTE (DELETE)
// ==========================
export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { noteId} = body;

    const noteDoc = await NotesModel.findById(noteId);

    if (!noteDoc) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    // 🔥 remove specific index
    // noteDoc.Notes.splice(index, 1);
        noteDoc.disable = true;

        await noteDoc.save();

    return NextResponse.json({ success: true, data: noteDoc });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}