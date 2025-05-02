import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Guardget</h1>
        <p className="text-xl mb-8 max-w-2xl">Miss Call, Not Phone</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
