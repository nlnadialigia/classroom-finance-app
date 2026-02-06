"user server"

import { NextResponse } from "next/server";
import { getSession } from "../session";

export async function getUser() {
  const user = await getSession();
  
  if (!user) {
    return null;
  }
  
  return NextResponse.json(user);
}
