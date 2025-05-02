import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileX } from "lucide-react"

export default function ReceiptNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <FileX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Receipt Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The receipt you're looking for doesn't exist or you may not have permission to view it.
      </p>
      <Button asChild>
        <Link href="/dashboard/receipts">Back to Receipts</Link>
      </Button>
    </div>
  )
}
