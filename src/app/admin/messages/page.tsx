import { prisma } from "@/lib/prisma";
import { MarkReadButton } from "@/components/admin/MarkReadButton";
import { Badge } from "@/components/ui/badge";

export default async function MessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {messages.length} total · {unread} unread
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 border rounded-lg transition-colors ${
              !msg.read ? "border-primary/30 bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{msg.name}</span>
                  {!msg.read && (
                    <Badge className="text-xs px-1.5 py-0">New</Badge>
                  )}
                </div>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs text-primary hover:underline"
                >
                  {msg.email}
                </a>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {msg.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {!msg.read && <MarkReadButton id={msg.id} />}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
