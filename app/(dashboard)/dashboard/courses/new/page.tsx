"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createCourseQuickstart } from "@/lib/actions/courses";

export default function NewCourseWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    title: "",
    level: "BEGINNER",
    targetAudience: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await createCourseQuickstart(data);
      if (res && res.slug) {
        router.push(`/dashboard/courses/${res.slug}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Wizard Header */}
      <header className="flex items-center justify-between p-4 md:px-8 border-b shrink-0 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Course Studio Wizard</span>
        </div>
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/dashboard/courses">
            <X className="h-5 w-5" />
          </Link>
        </Button>
      </header>

      {/* Wizard Content */}
      <div className="flex-1 flex flex-col justify-center max-w-xl w-full mx-auto p-6 md:p-12 overflow-y-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mb-12 flex overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6 animation-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Give your course a name.</h1>
              <p className="text-muted-foreground">
                Don&apos;t worry, you can always change this later. Choose something catchy.
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <Label htmlFor="title" className="text-sm font-medium">Course Title</Label>
              <Input
                id="title"
                placeholder="e.g. The Complete Tailwind CSS Masterclass"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="h-12 text-lg"
                autoFocus
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animation-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Choose the difficulty level.</h1>
              <p className="text-muted-foreground">
                Tailor the language and depth of topics to your student base.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {[
                { key: "BEGINNER", label: "Beginner", desc: "Foundational concepts" },
                { key: "INTERMEDIATE", label: "Intermediate", desc: "Deeper practical skills" },
                { key: "ADVANCED", label: "Advanced", desc: "Mastery & Architecture" },
              ].map((level) => (
                <Card 
                  key={level.key}
                  className={`p-4 cursor-pointer border-2 transition-all hover:border-primary/50 ${data.level === level.key ? "border-primary bg-primary/5 shadow-sm" : "border-muted"}`}
                  onClick={() => setData({ ...data, level: level.key })}
                >
                  <GraduationCap className={`h-6 w-6 mb-2 ${data.level === level.key ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold text-sm">{level.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{level.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animation-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500 shrink-0" /> Who is this for?
              </h1>
              <p className="text-muted-foreground">
                Briefly define your ideal student so we can help build course targets.
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <Label htmlFor="audience" className="text-sm font-medium">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g. Web developers looking to level up their UI skills"
                value={data.targetAudience}
                onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
                className="h-12 text-md"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t shrink-0">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={step === 1 || isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < 3 ? (
            <Button 
              onClick={handleNext} 
              disabled={!data.title.trim()}
              className="gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !data.title.trim()}
              className="gap-2 min-w-[140px]"
            >
              {isSubmitting ? "Building Studio..." : "Launch Studio"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
