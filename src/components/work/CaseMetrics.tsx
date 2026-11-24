"use client";

import type { ProjectRecord } from "@/data/projects";
import { Odometer } from "@/components/ui/Odometer";

export interface CaseMetricsProps {
  project: ProjectRecord;
}

interface MetricToken {
  text: string;
  isNumeric: boolean;
}

/**
 * Splits a metric value into plain-text segments and standalone numeric
 * tokens so numbers animate with <Odometer> while model codes like NAU7802
 * stay intact.
 */
function tokenizeMetricValue(value: string): MetricToken[] {
  const pattern = /([A-Za-z]+\d+|\d+(?:[.:]\d+)*)/g;
  const tokens: MetricToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: value.slice(lastIndex, match.index),
        isNumeric: false,
      });
    }
    const token = match[0];
    const startsWithDigit = /^\d/.test(token);
    tokens.push({
      text: token,
      isNumeric: startsWithDigit,
    });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    tokens.push({
      text: value.slice(lastIndex),
      isNumeric: false,
    });
  }

  return tokens;
}

export function CaseMetrics({ project }: CaseMetricsProps) {
  return (
    <section
      aria-label="Key engineering metrics"
      className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10 md:pb-24"
    >
      <div className="grid grid-cols-1 gap-px border border-[var(--surface-border)] bg-[var(--surface-border)] sm:grid-cols-2 lg:grid-cols-4">
        {project.metrics.map((metric, idx) => {
          const tokens = tokenizeMetricValue(metric.value);
          return (
            <div
              key={metric.label}
              className="flex flex-col justify-between bg-[#0A0A0A]/85 p-6 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
                  {metric.label}
                </span>
                <span
                  className="font-mono text-[10px] tracking-[0.14em]"
                  style={{ color: project.accent }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-6 text-xl font-light tracking-[-0.015em] text-[var(--surface-fg)] md:text-2xl">
                {tokens.map((tok, tIdx) =>
                  tok.isNumeric ? (
                    <Odometer
                      key={`${metric.label}-num-${tIdx}`}
                      value={tok.text}
                      duration={0.65}
                      className="font-normal"
                    />
                  ) : (
                    <span key={`${metric.label}-txt-${tIdx}`}>{tok.text}</span>
                  )
                )}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
