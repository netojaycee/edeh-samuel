import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeUpload } from "@/components/admin/ResumeUpload";
import { existsSync } from "fs";
import path from "path";

export default async function DashboardPage() {
  const [projectCount, messageCount, unreadCount] = await Promise.all([
    prisma.project.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  const recentProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, createdAt: true },
  });

  const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your portfolio content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="border border-border rounded-lg p-5 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Projects
            </span>
          </div>
          <p className="text-3xl font-semibold">{projectCount}</p>
        </div>

        <div className="border border-border rounded-lg p-5 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Messages
            </span>
          </div>
          <p className="text-3xl font-semibold">{messageCount}</p>
          {unreadCount > 0 && (
            <p className="text-xs text-primary font-medium">{unreadCount} unread</p>
          )}
        </div>

        <div className="border border-border rounded-lg p-5 flex items-center justify-center">
          <Link href="/admin/projects/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        <ResumeUpload hasResume={hasResume} />
      </div>

      {/* Recent projects */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-2">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-3 px-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    project.status === "published"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />
                <span className="text-sm font-medium">{project.title}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
