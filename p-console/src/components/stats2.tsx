"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    value: 500,
    suffix: "k+",
    label: "Active users this month",
  },
  {
    value: 98,
    suffix: "%",
    label: "Users return weekly",
  },
  {
    value: 150,
    suffix: "+",
    label: "Countries using our platform",
  },
];

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ value, suffix, label }: (typeof stats)[number]) {
  const { count, ref } = useCountUp(value);

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-10">
        <p className="text-foreground text-3xl font-bold tabular-nums lg:text-4xl">
          <span ref={ref}>{count}</span>
          {suffix}
        </p>
        <p className="text-muted-foreground text-base">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function StatsSection2() {
  return (
    <section className="w-full bg-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-4 gap-2 rounded-full">
            <BarChart3 className="text-primary size-4" />
            Stats
          </Badge>
          <h2 className="text-foreground max-w-xl text-4xl leading-tight font-bold text-balance sm:text-5xl">
            The Numbers That Prove Our{" "}
            <span className="text-primary">Impact</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
