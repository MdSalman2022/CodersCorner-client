"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Header } from "@/components/header";

export default function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing:", { title, content, tags, category });
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview:", { title, content });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Editor */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <Input
              placeholder="Article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
            />
          </div>

          <TiptapEditor content={content} onChange={setContent} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="Add tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
