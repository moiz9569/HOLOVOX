import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import NotesModel from "@/app/models/notes.model";


// ==========================
// 📥 CREATE NOTE (POST)
// ==========================
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { meetingId, userId, note } = body;
    console.log("Create Note Payload:", { meetingId, userId, note });
     if (!meetingId || !userId || !note || note.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }
     // 🔥 clean empty notes
    const cleanNotes = Array.isArray(note)
      ? note.filter((n) => n && n.trim() !== "")
      : [note];

    // 🔥 check existing doc
    let existing = await NotesModel.findOne({ meetingId, userId });

    if (existing) {
      // 👉 already exists → push note
      existing.Notes.push(...cleanNotes);
      await existing.save();

      return NextResponse.json({ success: true, data: existing });
    } else {
      // 👉 first time → create new doc
      const notes = await NotesModel.create({
        meetingId,
        userId,
        Notes: cleanNotes,
      });
      console.log("New Notes Document Created:", notes);
      return NextResponse.json({ success: true, data: notes });
    }

  } catch (error) {
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

    const notes = await NotesModel.find({ userId }).sort({
      createdAt: -1,
    });

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

    const { noteId, index, newText } = body;

    const noteDoc = await NotesModel.findById(noteId);

    if (!noteDoc) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    // 🔥 update specific index
    noteDoc.Notes[index] = newText;

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

    const { noteId, index } = body;

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