import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import PersonalMessageModel from "@/app/models/RequestMessages.model";
import { connectDB } from "../../../../../../../lib/db";

cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json({ error: "messageId is required" }, { status: 400 });
    }

    const message = await PersonalMessageModel.findById(messageId).lean();
    if (!message || !message.fileUrl) {
      return NextResponse.json({ error: "Message or file not found" }, { status: 404 });
    }

    let downloadUrl = message.fileUrl;
    if (message.filePublicId) {
      try {
        const resource = await cloudinary.v2.api.resource(message.filePublicId, {
          resource_type: message.fileResourceType || "raw",
          type: "upload",
        });
        if (resource?.secure_url) {
          downloadUrl = resource.secure_url;
        }
      } catch (cloudErr) {
        console.error("Cloudinary resource lookup failed:", cloudErr);
      }
    }

    const upstream = await fetch(downloadUrl);
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("Cloudinary download failed", upstream.status, text);
      return NextResponse.json({ error: "Failed to download file" }, { status: 502 });
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${message.fileName || "document"}"`
    );

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error("Download route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
