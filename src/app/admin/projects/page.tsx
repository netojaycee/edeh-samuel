import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="space-y-1 min-w-0 flex-1 mr-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {project.title}
                </span>
                <Badge
                  variant={project.status === "published" ? "default" : "secondary"}
                  className="text-xs shrink-0"
                >
                  {project.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {project.shortDesc}
              </p>
              <p className="text-xs text-muted-foreground">
                Order: {project.order} · /works/{project.slug}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/works/${project.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="text-xs">
                  View
                </Button>
              </Link>
              <Link href={`/admin/projects/${project.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
              </Link>
              <DeleteProjectButton id={project.id} title={project.title} />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No projects yet.</p>
            <Link href="/admin/projects/new" className="mt-3 inline-block">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
