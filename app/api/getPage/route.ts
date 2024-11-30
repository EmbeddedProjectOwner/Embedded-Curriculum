import { headers } from "next/headers";
import { NextResponse } from "next/server";

async function handler() {
    const headersList = await headers();

    const pathname = headersList.get("x-invoke-path") || "";

    return NextResponse.json(pathname)
}

export {handler as GET, handler as POST}