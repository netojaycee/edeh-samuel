"use client";

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
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  CaseStudyChart,
  CaseStudyChartSeries,
  CaseStudyContent,
  CaseStudyMetadataRow,
  CaseStudySection,
  emptyCaseStudy,
} from "@/types/case-study";

interface CaseStudyEditorProps {
  value: CaseStudyContent | null;
  onChange: (value: CaseStudyContent) => void;
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function CaseStudyEditor({ value, onChange }: CaseStudyEditorProps) {
  const data = value ?? emptyCaseStudy;

  const update = (patch: Partial<CaseStudyContent>) => onChange({ ...data, ...patch });

  // Metadata rows
  const updateMetadata = (index: number, patch: Partial<CaseStudyMetadataRow>) =>
    update({
      metadata: data.metadata.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    });
  const addMetadata = () =>
    update({ metadata: [...data.metadata, { label: "", value: "" }] });
  const removeMetadata = (index: number) =>
    update({ metadata: data.metadata.filter((_, i) => i !== index) });

  // Sections
  const updateSection = (index: number, patch: Partial<CaseStudySection>) =>
    update({
      sections: data.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  const addSection = () =>
    update({
      sections: [...data.sections, { title: "", body: {}, chart: null }],
    });
  const removeSection = (index: number) =>
    update({ sections: data.sections.filter((_, i) => i !== index) });
  const moveSection = (index: number, dir: -1 | 1) =>
    update({ sections: move(data.sections, index, index + dir) });

  const setSectionChartType = (index: number, type: string) => {
    if (type === "none") {
      updateSection(index, { chart: null });
      return;
    }
    const existing = data.sections[index].chart;
    const chart: CaseStudyChart = existing
      ? { ...existing, type: type as CaseStudyChart["type"] }
      : {
          type: type as CaseStudyChart["type"],
          title: "",
          valuePrefix: "",
          valueSuffix: "",
          series: [{ name: "", data: [{ label: "", value: 0 }] }],
        };
    updateSection(index, { chart });
  };

  const updateChart = (index: number, patch: Partial<CaseStudyChart>) => {
    const chart = data.sections[index].chart;
    if (!chart) return;
    updateSection(index, { chart: { ...chart, ...patch } });
  };

  const updateSeries = (
    sectionIndex: number,
    seriesIndex: number,
    patch: Partial<CaseStudyChartSeries>
  ) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    updateChart(sectionIndex, {
      series: chart.series.map((s, i) => (i === seriesIndex ? { ...s, ...patch } : s)),
    });
  };

  const addSeries = (sectionIndex: number) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    updateChart(sectionIndex, {
      series: [...chart.series, { name: "", data: [{ label: "", value: 0 }] }],
    });
  };

  const removeSeries = (sectionIndex: number, seriesIndex: number) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    updateChart(sectionIndex, {
      series: chart.series.filter((_, i) => i !== seriesIndex),
    });
  };

  const updatePoint = (
    sectionIndex: number,
    seriesIndex: number,
    pointIndex: number,
    field: "label" | "value",
    raw: string
  ) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    const series = chart.series[seriesIndex];
    const points = series.data.map((p, i) =>
      i === pointIndex
        ? { ...p, [field]: field === "value" ? Number(raw) || 0 : raw }
        : p
    );
    updateSeries(sectionIndex, seriesIndex, { data: points });
  };

  const addPoint = (sectionIndex: number, seriesIndex: number) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    const series = chart.series[seriesIndex];
    updateSeries(sectionIndex, seriesIndex, {
      data: [...series.data, { label: "", value: 0 }],
    });
  };

  const removePoint = (sectionIndex: number, seriesIndex: number, pointIndex: number) => {
    const chart = data.sections[sectionIndex].chart;
    if (!chart) return;
    const series = chart.series[seriesIndex];
    updateSeries(sectionIndex, seriesIndex, {
      data: series.data.filter((_, i) => i !== pointIndex),
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-4 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium">Hero</h3>
        <div className="space-y-1.5">
          <Label>Eyebrow</Label>
          <Input
            value={data.heroEyebrow}
            onChange={(e) => update({ heroEyebrow: e.target.value })}
            placeholder="GROWTH STRATEGY / 2026"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Headline</Label>
          <Textarea
            value={data.heroTitle}
            onChange={(e) => update({ heroTitle: e.target.value })}
            rows={2}
            className="resize-none"
            placeholder="I reframed Moniepoint's growth problem from acquisition to activation."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Strategic thesis</Label>
          <Textarea
            value={data.heroThesis}
            onChange={(e) => update({ heroThesis: e.target.value })}
            rows={3}
            className="resize-none"
            placeholder="Moniepoint already had volume. The bigger problem was what happened after people signed up."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Evidence card label</Label>
          <Select
            value={data.impactLabel}
            onValueChange={(v) =>
              update({ impactLabel: (v ?? "MODELED IMPACT") as CaseStudyContent["impactLabel"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MODELED IMPACT">Modeled Impact</SelectItem>
              <SelectItem value="RESULTS">Results</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Shown next to the evidence cards (from the Selected Works Card stats above) to
            flag projected vs. observed numbers.
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Metadata row</h3>
          <Button type="button" size="sm" variant="outline" onClick={addMetadata} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add row
          </Button>
        </div>
        <div className="space-y-2">
          {data.metadata.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={row.label}
                onChange={(e) => updateMetadata(i, { label: e.target.value })}
                placeholder="Role"
                className="flex-1"
              />
              <Input
                value={row.value}
                onChange={(e) => updateMetadata(i, { value: e.target.value })}
                placeholder="Growth Strategist"
                className="flex-1"
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => removeMetadata(i)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          {data.metadata.length === 0 && (
            <p className="text-xs text-muted-foreground">No metadata rows yet.</p>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Sections</h3>
          <Button type="button" size="sm" variant="outline" onClick={addSection} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add section
          </Button>
        </div>

        {data.sections.map((section, i) => (
          <div key={i} className="space-y-4 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Section {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === data.sections.length - 1}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeSection(i)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={section.title}
                onChange={(e) => updateSection(i, { title: e.target.value })}
                placeholder="The problem"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Body</Label>
              <RichTextEditor
                content={section.body as object}
                onChange={(body) => updateSection(i, { body })}
              />
            </div>

            {/* Chart */}
            <div className="space-y-3 border-t border-border pt-3">
              <div className="space-y-1.5">
                <Label>Chart</Label>
                <Select
                  value={section.chart?.type ?? "none"}
                  onValueChange={(v) => setSectionChartType(i, v ?? "none")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No chart</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="funnel">Funnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {section.chart && (
                <div className="space-y-3 pl-3 border-l-2 border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label>Chart title</Label>
                      <Input
                        value={section.chart.title ?? ""}
                        onChange={(e) => updateChart(i, { title: e.target.value })}
                        placeholder="Activation & retention"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Value prefix</Label>
                      <Input
                        value={section.chart.valuePrefix ?? ""}
                        onChange={(e) => updateChart(i, { valuePrefix: e.target.value })}
                        placeholder="₦"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Value suffix</Label>
                      <Input
                        value={section.chart.valueSuffix ?? ""}
                        onChange={(e) => updateChart(i, { valueSuffix: e.target.value })}
                        placeholder="%"
                      />
                    </div>
                  </div>

                  {section.chart.series.map((series, si) => (
                    <div key={si} className="space-y-2 border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          value={series.name}
                          onChange={(e) =>
                            updateSeries(i, si, { name: e.target.value })
                          }
                          placeholder={
                            section.chart?.type === "funnel"
                              ? "Funnel stages"
                              : "Series name (e.g. Before)"
                          }
                          className="flex-1"
                        />
                        {section.chart?.series.length && section.chart.series.length > 1 && (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => removeSeries(i, si)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {series.data.map((point, pi) => (
                          <div key={pi} className="flex items-center gap-2">
                            <Input
                              value={point.label}
                              onChange={(e) =>
                                updatePoint(i, si, pi, "label", e.target.value)
                              }
                              placeholder="Activation"
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={point.value}
                              onChange={(e) =>
                                updatePoint(i, si, pi, "value", e.target.value)
                              }
                              placeholder="40"
                              className="w-28"
                            />
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => removePoint(i, si, pi)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addPoint(i, si)}
                        className="gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add data point
                      </Button>
                    </div>
                  ))}

                  {section.chart.type !== "funnel" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addSeries(i)}
                      className="gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add series
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {data.sections.length === 0 && (
          <p className="text-xs text-muted-foreground">No sections yet.</p>
        )}
      </div>

      {/* Takeaway */}
      <div className="space-y-4 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium">Takeaway</h3>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Textarea
            value={data.takeawayTitle}
            onChange={(e) => update({ takeawayTitle: e.target.value })}
            rows={2}
            className="resize-none"
            placeholder="Growth wasn't primarily an acquisition problem."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Body</Label>
          <Textarea
            value={data.takeawayBody}
            onChange={(e) => update({ takeawayBody: e.target.value })}
            rows={3}
            className="resize-none"
            placeholder="That distinction changed where I put the budget..."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium">Closing CTA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={data.ctaLabel}
              onChange={(e) => update({ ctaLabel: e.target.value })}
              placeholder="View the full 90-Day Growth Strategy →"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              URL{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              value={data.ctaUrl}
              onChange={(e) => update({ ctaUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
