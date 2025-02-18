import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="flex h-[calc(100vh-112px)] flex-col items-center justify-center gap-y-5">
      <div className="flex flex-row items-center gap-x-2">
        <h1 className="text-4xl font-extrabold text-rose-500">404</h1>

        <span className="border-r">&nbsp;</span>
        <p>This page is not available</p>
      </div>
      <div>
        <Button variant="default" size="sm" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
