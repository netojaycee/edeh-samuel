"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ResumeUpload({
  hasResume,
  resumeUrl,
}: {
  hasResume: boolean;
  resumeUrl: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setUploaded(true);
      toast.success("Resume uploaded successfully");
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider font-medium">
          Resume
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {uploaded
            ? "resume.pdf updated"
            : hasResume
              ? "resume.pdf exists"
              : "No resume uploaded yet"}
        </p>
        {(hasResume || uploaded) && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : uploaded ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading
            ? "Uploading..."
            : hasResume || uploaded
              ? "Replace Resume"
              : "Upload Resume"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
        <p className="text-xs text-muted-foreground">PDF only</p>
      </div>
    </div>
  );
}
