import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Schedule a Demo
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Let us show you how Roof Leads Pro can transform your roofing business.
          Please contact us to schedule a personalized demo.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 