// app/api/users/route.js
import { NextResponse } from "next/server";

// Mock data
const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com" },
];

// GET request handler
export async function GET() {
  return NextResponse.json(users, { status: 200 });
}



