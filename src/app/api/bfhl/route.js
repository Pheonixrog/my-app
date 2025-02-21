import { NextResponse } from "next/server";

const USER_ID = "Rishabh Katiyar";
const EMAIL = "22BCS10594@cuchd.in";
const ROLL_NUMBER = "22BCS10594";


export async function GET() {
  return NextResponse.json({ operation_code: 1 }, { status: 200 });
}


export async function POST(req) {
  try {
    const body = await req.json();
    const data = body.data;
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ is_success: false, message: "Invalid input" }, { status: 400 });
    }

    const numbers = data.filter((item) => /^[0-9]+$/.test(item));
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
    
    // Find the highest alphabet (last in A-Z series, case insensitive)
    const highestAlphabet = alphabets.length > 0 
      ? [alphabets.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? -1 : 1)[0]]
      : [];

    return NextResponse.json(
      {
        is_success: true,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        numbers,
        alphabets,
        highest_alphabet: highestAlphabet
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ is_success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
