import Workspace from "@/components/workspace/Workspace";
import type { InsightSurface } from "@/lib/types";

const SURFACES: InsightSurface[] = ["panel", "inline", "intercept"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { surface } = await searchParams;
  const requested = Array.isArray(surface) ? surface[0] : surface;
  const insightSurface = SURFACES.includes(requested as InsightSurface)
    ? (requested as InsightSurface)
    : "panel";

  return <Workspace insightSurface={insightSurface} />;
}
