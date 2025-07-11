import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken, summary, description, start, end } = await req.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken, // ⬅️ Required to auto-refresh expired tokens
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: start,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: end,
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).substring(7),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return NextResponse.json({ event: response.data });
  } catch (err) {
    console.error("Calendar error:", err);
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
  }
}
