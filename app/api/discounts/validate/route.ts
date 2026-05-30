import { NextRequest, NextResponse } from "next/server"
import { validateDiscount } from "@/lib/discounts"

// Public — returns validity for a single submitted code (does not expose the code list).
export async function POST(request: NextRequest) {
  const { code, subtotal } = await request.json()
  const result = await validateDiscount(code, Number(subtotal) || 0)
  return NextResponse.json(result)
}
