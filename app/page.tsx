import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenTool, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Coders Corner</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A Medium-like blog platform focused on programming, development, and
            tech discussions. Share your knowledge with fellow developers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/write">
                <PenTool className="h-4 w-4 mr-2" />
                Start Writing
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/posts">Explore Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Coders Corner?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2" />
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Connect with developers worldwide, share ideas, and learn from
                  each other.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <PenTool className="h-8 w-8 mb-2" />
                <CardTitle>Rich Editor</CardTitle>
                <CardDescription>
                  Write with our powerful Tiptap editor supporting code blocks,
                  images, and more.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 mb-2" />
                <CardTitle>Grow Your Skills</CardTitle>
                <CardDescription>
                  Follow topics, get personalized recommendations, and track
                  your progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "JavaScript",
              "React",
              "Next.js",
              "TypeScript",
              "Python",
              "AI",
              "DevOps",
              "Web Development",
            ].map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-sm py-1 px-3"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
