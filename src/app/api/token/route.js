import { AccessToken } from "livekit-server-sdk";

export async function POST(request) {
  try {
    const { roomId, userId, isHost,name ,image} = await request.json();
    console.log("Received token request:", { roomId, userId, isHost , name,image});
    if (!roomId || !userId || !name) {
      return new Response(
        JSON.stringify({ error: "Missing roomId or userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name : name,
      ttl: 6 * 60 * 60, // 6 hours
      metadata: JSON.stringify({ isHost: isHost , image: image || null }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return new Response(
      JSON.stringify({
        token,
        url: process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Token generation error:", err);
    return new Response(
      JSON.stringify({ error: "Token generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}