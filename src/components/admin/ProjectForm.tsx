"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    shortDesc: string;
    tagline: string;
    role: string;
    industry: string;
    timeline: string;
    body: unknown;
    status: string;
    order: number;
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [form, setForm] = useState({
    title: project?.title ?? "",
    shortDesc: project?.shortDesc ?? "",
    tagline: project?.tagline ?? "",
    role: project?.role ?? "",
    industry: project?.industry ?? "",
    timeline: project?.timeline ?? "",
    status: project?.status ?? "draft",
    order: project?.order ?? 0,
  });
  const [body, setBody] = useState<object>(
    (project?.body as object) ?? {}
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, body, order: Number(form.order) }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(isEditing ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Project" : "New Project"}
        </h1>
      </div>

      {/* Basic info */}
      <div className="space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Basic Info
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Place of Treasure"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="shortDesc">
            Short Description *{" "}
            <span className="text-muted-foreground font-normal">(shown on landing page)</span>
          </Label>
          <Textarea
            id="shortDesc"
            value={form.shortDesc}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            required
            rows={2}
            className="resize-none"
            placeholder="A UK-based gifting marketplace..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tagline">
            Tagline *{" "}
            <span className="text-muted-foreground font-normal">(shown on detail page under title)</span>
          </Label>
          <Textarea
            id="tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            required
            rows={2}
            className="resize-none"
            placeholder="Designing a guided gifting experience..."
          />
        </div>
      </div>

      {/* Project metadata */}
      <div className="space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Project Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
              placeholder="Product Designer"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              required
              placeholder="eCommerce"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timeline">Timeline *</Label>
            <Input
              id="timeline"
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              required
              placeholder="3 to 6 months"
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="space-y-5">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Publishing
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v ?? "draft" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Rich text body */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Project Content
        </h2>
        <RichTextEditor
          content={body as object}
          onChange={setBody}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
