export interface CaseStudyChartPoint {
  label: string;
  value: number;
}

export interface CaseStudyChartSeries {
  name: string;
  data: CaseStudyChartPoint[];
}

export interface CaseStudyChart {
  type: "bar" | "line" | "funnel";
  title?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  series: CaseStudyChartSeries[];
}

export interface CaseStudySection {
  title: string;
  body: object;
  chart: CaseStudyChart | null;
}

export interface CaseStudyMetadataRow {
  label: string;
  value: string;
}

export type CaseStudyImpactLabel = "MODELED IMPACT" | "RESULTS";

export interface CaseStudyContent {
  heroEyebrow: string;
  heroTitle: string;
  heroThesis: string;
  impactLabel: CaseStudyImpactLabel;
  metadata: CaseStudyMetadataRow[];
  sections: CaseStudySection[];
  takeawayTitle: string;
  takeawayBody: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const emptyCaseStudy: CaseStudyContent = {
  heroEyebrow: "",
  heroTitle: "",
  heroThesis: "",
  impactLabel: "MODELED IMPACT",
  metadata: [],
  sections: [],
  takeawayTitle: "",
  takeawayBody: "",
  ctaLabel: "",
  ctaUrl: "",
};
