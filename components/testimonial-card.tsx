import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

interface TestimonialCardProps {
  name: string
  quote: string
  imageSrc: string
}

const TestimonialCard = ({ name, quote, imageSrc }: TestimonialCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4 text-primary">
          <QuoteIcon className="h-6 w-6" />
        </div>
        <p className="text-sm mb-6 flex-grow">{quote}</p>
        <div className="flex items-center">
          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
            <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">Guardget User</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
