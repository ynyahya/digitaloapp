import { Plus, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";

interface ContentItem {
  id: string;
  title: string;
  type: string;
}

export default async function ContentPage() {
  await requireCreator();

  // In a production implementation, this would fetch from a content table
  // For now, we show a clean empty state
  const contentItems: ContentItem[] = [];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Content Studio</h1>
          <p className="text-[14px] text-ink-muted">
            Generate and manage marketing copy for your products.
          </p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      {contentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <Card className="rounded-3xl border-line bg-paper shadow-soft max-w-[480px] w-full">
            <CardContent className="p-12 text-center space-y-6">
              <div className="h-16 w-16 rounded-3xl bg-paper-muted flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-ink-subtle" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold">No Content Yet</h3>
                <p className="text-[14px] text-ink-muted max-w-[320px] mx-auto">
                  Create marketing content for your products using AI. Generate descriptions, social posts, and more.
                </p>
              </div>
              <Button className="h-11 px-6 rounded-xl bg-ink text-paper font-bold shadow-float">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Content
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4">
          {contentItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Card className="rounded-2xl border-line bg-paper p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-paper-muted border border-line flex items-center justify-center text-ink">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-ink">{item.title}</h3>
            <p className="text-[12px] text-ink-muted">{item.type}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
