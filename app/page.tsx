import { auth } from "@/auth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  if (!session) {
    redirect('/login');
  } else {
    redirect('/dashboard');
  }


  return (
    <div className="flex h-[calc(100vh-112px)] flex-col items-center justify-center gap-y-5">
      <div className="flex flex-row items-center gap-x-2">
        <Loader2 className="animate-spin" />
        <span className="text-xl">Loading...</span>
      </div>
    </div>
  )
}
