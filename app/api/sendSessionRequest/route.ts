"use server";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fromUid,
      toUid,
      toName,
      fromName,
      fromEmail,
      toEmail,
      message,
      date,
      mode,
    } = body;

    // Save to Firestore
    await addDoc(collection(db, "sessionRequests"), {
      from: fromUid,
      fromName,
      fromEmail: fromEmail,
      to: toUid,
      toName,
      toEmail,
      message,
      date,
      mode,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `New Session Request from ${fromName}`,
      html: `<p>${message}</p><p>Date: ${date}</p><p>Mode: ${mode}</p>`,
    });

    return NextResponse.json({ message: "Session request sent!" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
