import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  Users,
  TrendingUp,
  Code,
  Zap,
  Globe,
  Star,
  ArrowRight,
  Sparkles,
  BookOpen,
  Coffee,
  Heart,
  MessageCircle,
  Eye,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Welcome to the Developer Community
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Where Code
              <br />
              <span className="text-primary">Meets Community</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover stories, insights, and tutorials from developers
              worldwide. Share your knowledge, learn from others, and grow your
              coding journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link href="/write">
                  <PenTool className="h-5 w-5 mr-2" />
                  Start Writing
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link href="/posts">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Stories
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">1K+</div>
                <div className="text-sm text-muted-foreground">Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Reads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Topics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive deep into the technologies and concepts that matter most to
              developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code,
                title: "Frontend Development",
                description: "React, Vue, Angular, and modern web technologies",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
                topics: ["React", "Vue.js", "TypeScript", "CSS"],
              },
              {
                icon: Zap,
                title: "Backend & APIs",
                description: "Server-side development, databases, and APIs",
                color: "text-green-500",
                bgColor: "bg-green-500/10",
                topics: ["Node.js", "Python", "PostgreSQL", "REST"],
              },
              {
                icon: Globe,
                title: "DevOps & Cloud",
                description: "Deployment, scaling, and infrastructure",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
                topics: ["Docker", "AWS", "Kubernetes", "CI/CD"],
              },
              {
                icon: Star,
                title: "AI & Machine Learning",
                description: "The future of intelligent applications",
                color: "text-orange-500",
                bgColor: "bg-orange-500/10",
                topics: ["TensorFlow", "PyTorch", "NLP", "Computer Vision"],
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Developers Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Experience the platform that
              understands your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                title: "Professional Editor",
                description:
                  "Write with our powerful Tiptap editor featuring code syntax highlighting, image uploads, and rich formatting options.",
                features: [
                  "Code blocks",
                  "Image uploads",
                  "Live preview",
                  "Auto-save",
                ],
              },
              {
                icon: Users,
                title: "Vibrant Community",
                description:
                  "Connect with developers worldwide. Follow topics, engage in discussions, and build meaningful connections.",
                features: [
                  "Global network",
                  "Topic following",
                  "Comments",
                  "Notifications",
                ],
              },
              {
                icon: TrendingUp,
                title: "Grow & Learn",
                description:
                  "Track your progress, discover trending topics, and get personalized recommendations to accelerate your learning.",
                features: [
                  "Reading analytics",
                  "Personalized feed",
                  "Trending topics",
                  "Skill tracking",
                ],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most engaging articles from our community this week
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Featured Post */}
            <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                <Code className="h-16 w-16 text-primary/60" />
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Developer</p>
                    <p className="text-sm text-muted-foreground">
                      2 days ago • 5 min read
                    </p>
                  </div>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Building Scalable React Applications: Best Practices and
                  Patterns
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Learn how to structure your React applications for
                  maintainability and performance. Discover advanced patterns
                  used by top tech companies.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">Architecture</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">42</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Posts */}
            <div className="space-y-6">
              {[
                {
                  title: "Understanding TypeScript Generics",
                  author: "Sarah Chen",
                  excerpt:
                    "A comprehensive guide to mastering TypeScript generics for better type safety.",
                  tags: ["TypeScript", "JavaScript"],
                  stats: { likes: 28, comments: 5, readTime: 4 },
                },
                {
                  title: "Docker for Node.js Developers",
                  author: "Mike Johnson",
                  excerpt:
                    "Containerize your Node.js applications with confidence using Docker best practices.",
                  tags: ["Docker", "Node.js", "DevOps"],
                  stats: { likes: 35, comments: 12, readTime: 6 },
                },
              ].map((post, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm group cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <span className="text-secondary-foreground font-semibold text-sm">
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{post.author}</p>
                        <p className="text-muted-foreground">
                          {post.stats.readTime} min read
                        </p>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.stats.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.stats.comments}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">
                <BookOpen className="h-5 w-5 mr-2" />
                View All Stories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Share Your Knowledge?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers who are already sharing their
              insights, tutorials, and experiences with the global developer
              community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/write">
                  <PenTool className="h-5 w-5 mr-2" />
                  Start Writing Today
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <Link href="/auth/signup">
                  <Users className="h-5 w-5 mr-2" />
                  Join the Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Coders Corner</h3>
              <p className="text-muted-foreground text-sm">
                A community-driven platform for developers to share knowledge,
                learn, and grow together.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/write"
                    className="hover:text-foreground transition-colors"
                  >
                    Write
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="hover:text-foreground transition-colors"
                  >
                    Read
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="hover:text-foreground transition-colors"
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="hover:text-foreground transition-colors"
                  >
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Coders Corner. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
