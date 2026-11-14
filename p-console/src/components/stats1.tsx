"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 50,
    suffix: "K+",
    label: "Active Users",
    description: "Teams and individuals building with our platform every day.",
  },
  {
    value: 99,
    suffix: "%",
    label: "Uptime SLA",
    description: "Enterprise-grade reliability you can depend on, always.",
  },
  {
    value: 120,
    suffix: "+",
    label: "Integrations",
    description: "Connect the tools your team already loves and uses.",
  },
  {
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    description: "Rated by thousands of verified users across all platforms.",
    decimal: true,
  },
];

function useCountUp(target: number, duration = 1800, decimal = false) {
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
            const current = eased * target;
            setCount(
              decimal ? Math.round(current * 10) / 10 : Math.floor(current),
            );
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
  }, [target, duration, decimal]);

  return { count, ref };
}

function StatItem({
  value,
  suffix,
  label,
  description,
  decimal,
}: (typeof stats)[number]) {
  const { count, ref } = useCountUp(value, 1800, decimal);

  return (
    <div className="flex flex-col gap-2 text-center lg:text-start lg:not-first:ps-10">
      <div className="flex items-end justify-center gap-1 lg:justify-start">
        <span
          ref={ref}
          className="text-foreground text-5xl font-bold tracking-tight tabular-nums lg:text-6xl"
        >
          {decimal ? count.toFixed(1) : count}
        </span>
        <span className="text-primary mb-1 text-2xl font-semibold lg:text-3xl">
          {suffix}
        </span>
      </div>
      <p className="text-foreground text-sm font-semibold">{label}</p>
      <p className="text-muted-foreground text-sm text-balance">
        {description}
      </p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl space-y-4">
          <p className="text-primary mb-3 text-xs">By the numbers</p>
          <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
            Trusted by teams worldwide
          </h2>
          <p className="text-muted-foreground text-balance">
            Real numbers behind the product. From growing startups to enterprise
            teams, our platform scales with every ambition.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
