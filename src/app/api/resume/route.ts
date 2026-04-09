// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { writeFile } from "fs/promises";
// import path from "path";

// export async function POST(req: NextRequest) {
//   const session = await auth();
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     if (file.type !== "application/pdf") {
//       return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const filePath = path.join(process.cwd(), "public", "resume.pdf");
//     await writeFile(filePath, buffer);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Resume upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteOldResume, uploadResume } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await deleteOldResume();
    const result = await uploadResume(buffer);
    // console.log("Cloudinary upload result:", result, session);
    if (!result || !(result as any).secure_url) {
      console.error("Invalid Cloudinary response:", result);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    if (!session || !session.user || !session.user.id) {
      console.error("Session user ID missing:", session);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { resumeUrl: (result as any).secure_url },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


