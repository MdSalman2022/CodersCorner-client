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

export default function Write() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          images: uploadedImages,
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
          images: uploadedImages,
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
      <Header />

      {/* Header Actions */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40 shadow-sm">
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
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Input
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 bg-transparent"
            />
            {title.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {title.length} characters
              </p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="relative">
            <TiptapEditor content={content} onChange={setContent} />
            {content.length > 0 && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>
                  {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)}{" "}
                  min read
                </span>
              </div>
            )}
          </div>

          {/* Publishing Details */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Publishing Details
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add details to help readers find your post
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Cover Image
                </label>
                <Input
                  placeholder="https://example.com/cover.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="font-mono text-sm"
                />
                {coverImage && (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add a cover image URL or upload one below
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    placeholder="react, javascript, tutorial"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  {tags && (
                    <div className="flex flex-wrap gap-2">
                      {tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium"
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

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="Frontend, Backend, DevOps..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose a category for your post
                  </p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium">
                    Images ({uploadedImages.length})
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {uploadedImages.length > 0 && (
                  <div className="space-y-3">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `Image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Alt text (optional)"
                            value={image.alt || ""}
                            onChange={(e) =>
                              updateImageAlt(index, e.target.value)
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Caption (optional)"
                            value={image.caption || ""}
                            onChange={(e) =>
                              updateImageCaption(index, e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  Upload images to include in your post. Max 5MB per image.
                </p>
              </div>
            </CardContent>
          </Card>
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

              {/* Tags */}
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

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Attached Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.url}
                        alt={image.alt || `Image ${index + 1}`}
                        className="w-full rounded-lg shadow-sm border"
                      />
                      {image.caption && (
                        <p className="text-sm text-muted-foreground italic text-center">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
