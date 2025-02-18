import { auth } from "@/auth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  } else {
    redirect('/dashboard');
  }
}
