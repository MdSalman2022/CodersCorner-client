"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  UploadCloud,
  Grid3x3,
} from "lucide-react";
import { toast } from "sonner";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      CodeBlock.configure({
        languageClassPrefix: "language-",
        HTMLAttributes: {
          class: "bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-muted",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-muted",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-muted bg-muted/50 font-semibold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-muted p-2",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your amazing post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }

        setIsUploadingImage(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        toast.loading("Uploading image...", { id: "image-upload" });

        try {
          // Upload to backend API
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/single`,
            {
              method: "POST",
              body: formData,
            }
          );

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (response.ok) {
            const data = await response.json();
            // Insert the uploaded image into the editor
            editor.chain().focus().setImage({ src: data.image.url }).run();
            toast.success("Image uploaded successfully!", {
              id: "image-upload",
            });
          } else {
            const error = await response.json();
            toast.error(error.error || "Failed to upload image", {
              id: "image-upload",
            });
          }
        } catch (error) {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image. Please try again.", {
            id: "image-upload",
          });
          clearInterval(progressInterval);
        } finally {
          setIsUploadingImage(false);
          setUploadProgress(0);
        }
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
      {/* Modern Toolbar */}
      <div className="border-b bg-muted/30 p-3 flex flex-wrap gap-2 items-center">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`h-8 w-8 p-0 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Style */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bold")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("italic")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("strike")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("code")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bulletList")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("orderedList")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("blockquote")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("codeBlock")
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Table */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="h-8 w-8 p-0"
            title="Insert Table (3x3)"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className="h-8 w-8 p-0"
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            disabled={isUploadingImage}
            className={`h-8 w-8 p-0 relative ${
              isUploadingImage ? "bg-primary/10" : ""
            }`}
            title="Upload Image"
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress > 0 && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Progress Overlay */}
      {isUploadingImage && (
        <div className="bg-primary/5 border-b px-4 py-2 flex items-center gap-3">
          <UploadCloud className="h-4 w-4 text-primary animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Uploading image...</span>
              <span className="text-xs text-muted-foreground">
                {uploadProgress}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose lg:prose-lg max-w-none p-6 min-h-[500px] focus:outline-none
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror]:min-h-[500px]
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
        />
      </div>
    </div>
  );
}
