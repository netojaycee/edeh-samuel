import { Navbar } from "./Navbar";
import { prisma } from "@/lib/prisma";

export default async function NavbarServer() {
  const user = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
    select: { resumeUrl: true },
  });
  return <Navbar resumeUrl={user?.resumeUrl || "#"} />;
}
