import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST untuk menerima pesan dari form contact frontend
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validasi input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Nama, email, subjek, dan pesan harus diisi" },
        { status: 400 }
      );
    }

    // Simpan pesan ke database
    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    // TODO: Di sini bisa ditambahkan logika untuk mengirim email notifikasi
    // ke admin atau ke email yang dituju

    return NextResponse.json(
      { 
        message: "Pesan berhasil dikirim", 
        id: savedMessage.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { message: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}


