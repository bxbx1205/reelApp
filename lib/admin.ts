import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { ADMIN_EMAILS } from "@/models/User";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;
  return session.user.role === "admin" || ADMIN_EMAILS.includes(session.user.email);
}

export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getSessionWithRole() {
  const session = await getServerSession(authOptions);
  return session;
}
