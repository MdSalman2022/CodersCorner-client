"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Header } from "@/components/header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { MediumHeader } from "@/components/medium-header";

export default function Write() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/api/uploads/single", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCoverImage(result.image.url);
        toast.success("Cover image uploaded successfully!");
      } else {
        toast.error("Failed to upload cover image");
      }
    } catch (err) {
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/api/uploads/single", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newImage = {
          url: result.image.url,
          publicId: result.image.publicId,
          alt: "",
          caption: "",
        };

        setUploadedImages((prev) => [...prev, newImage]);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageAlt = (index: number, alt: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt } : img))
    );
  };

  const updateImageCaption = (index: number, caption: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Please sign in to publish");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          category: category.trim(),
          status: "published",
          userId: user.id,
          coverImage: coverImage.trim(),
        }),
      });

      if (response.ok) {
        const post = await response.json();
        toast.success("Post published successfully!");
        router.push(`/posts/${post._id}`);
      } else {
        const error = await response.json();
        toast.error(`Failed to publish: ${error.message}`);
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Please sign in to save draft");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || "Untitled Draft",
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          category: category.trim(),
          status: "draft",
          userId: user.id,
          coverImage: coverImage.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Draft saved successfully!");
      } else {
        const error = await response.json();
        toast.error(`Failed to save draft: ${error.message}`);
      }
    } catch (error) {
      console.error("Save draft error:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MediumHeader />

      {/* Header Actions */}
      <div className="max-w-7xl mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {user ? `${user.name || user.email}` : "Not signed in"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving || !user}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Draft</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              disabled={
                isPublishing || !user || !title.trim() || !content.trim()
              }
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Publish</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content - Content Editor */}
          <div className="col-span-9 space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <div className="border-b border-muted pb-2">
                <Input
                  placeholder="Post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/60 bg-transparent h-auto py-2"
                />
              </div>
              {title.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {title.length} characters
                </p>
              )}
            </div>

            {/* Content Editor - Full Width */}
            <div className="space-y-4">
              <div className="min-h-[600px] border border-muted/50 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                <TiptapEditor content={content} onChange={setContent} />
              </div>
              {content.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {content.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span>
                    {Math.ceil(
                      content.split(/\s+/).filter(Boolean).length / 200
                    )}{" "}
                    min read
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Cover Image & Metadata */}
          <aside className="col-span-3 space-y-8">
            {/* Cover Image Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Cover Image
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="text-sm gap-2 hover:bg-muted"
                >
                  {isUploadingCover ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Change
                    </>
                  )}
                </Button>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
              </div>

              {coverImage ? (
                <div className="relative group">
                  <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => setCoverImage("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="aspect-video w-full border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
                  onClick={() => coverFileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Add a cover image
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Recommended: 1200×600px, max 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Tags and Category */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Tags
                </label>
                <Input
                  placeholder="javascript, react, tutorial"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="border-muted focus:border-primary"
                />
                {tags && (
                  <div className="flex flex-wrap gap-2">
                    {tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <Input
                  placeholder="Frontend, Backend, DevOps..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-muted focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Optional category for your post
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Cover Image */}
            {coverImage && (
              <div className="relative rounded-lg overflow-hidden -mx-6 -mt-2">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Tags and Category */}
            {(tags || category) && (
              <div className="flex flex-wrap gap-2">
                {tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag.trim()}
                  </span>
                ))}
                {category && (
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                )}
              </div>
            )}

            {/* Article Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                {title || "Untitled Post"}
              </h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span>•</span>
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>•</span>
                <span>
                  {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)}{" "}
                  min read
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-lg prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
