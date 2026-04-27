import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    // Convert audio to base64 for Gemini
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Step 1: Transcribe the audio
    const transcriptionPrompt = `Please transcribe this meeting audio in detail. Include speaker labels when possible (e.g., "Speaker 1:", "Speaker 2:"). Provide timestamps in MM:SS format for each segment.`;

    const transcriptionResult = await model.generateContent([
      transcriptionPrompt,
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio
        }
      }
    ]);

    const transcription = transcriptionResult.response.text();

    // Step 2: Generate clean meeting notes from the transcript
    const notesPrompt = `Create clean, organized meeting notes from this transcript:

${transcription}

Format the notes exactly like this:
📋 **Meeting Notes**
━━━━━━━━━━━━━━━━━━
🔑 **Key Points:**
• Point 1
• Point 2

✅ **Decisions Made:**
• Decision 1
• Decision 2

📌 **Action Items:**
• Action 1
• Action 2

💬 **Discussion Summary:**
Brief summary of the discussion in 2-3 sentences.`;

    const notesResult = await model.generateContent(notesPrompt);
    const summary = notesResult.response.text();

    return NextResponse.json({
      success: true,
      summary: summary,
      transcript: transcription // Optional: also return the raw transcript
    });

  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json(
      { error: "Summary generation failed" }, 
      { status: 500 }
    );
  }
}