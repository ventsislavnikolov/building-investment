import type { AppLocale } from "@/lib/routing";

type ProjectStrategy =
  | "flip"
  | "buy_to_rent"
  | "development"
  | "land_prep"
  | "hybrid";

export const projectStrategies: ProjectStrategy[] = [
  "flip",
  "buy_to_rent",
  "development",
  "land_prep",
  "hybrid",
];

type CatalogProject = {
  city: string;
  expectedIrrPct: number;
  fundedPct: number;
  id: string;
  slug: string;
  strategy: ProjectStrategy;
  title_bg: string;
  title_en: string;
};

const projects: CatalogProject[] = [
  {
    id: "p1",
    slug: "sofia-apartment-reposition",
    strategy: "flip",
    city: "Sofia",
    fundedPct: 46,
    expectedIrrPct: 14.2,
    title_en: "Sofia Apartment Reposition",
    title_bg: "Репозициониране на апартамент в София",
  },
  {
    id: "p2",
    slug: "varna-seaside-rentals",
    strategy: "buy_to_rent",
    city: "Varna",
    fundedPct: 63,
    expectedIrrPct: 10.5,
    title_en: "Varna Seaside Rentals",
    title_bg: "Варненски апартаменти под наем",
  },
  {
    id: "p3",
    slug: "plovdiv-urban-hub",
    strategy: "development",
    city: "Plovdiv",
    fundedPct: 28,
    expectedIrrPct: 16.1,
    title_en: "Plovdiv Urban Hub",
    title_bg: "Градски комплекс Пловдив",
  },
  {
    id: "p4",
    slug: "burgas-mixed-yield",
    strategy: "hybrid",
    city: "Burgas",
    fundedPct: 74,
    expectedIrrPct: 12.3,
    title_en: "Burgas Mixed Yield",
    title_bg: "Смесена доходност Бургас",
  },
];

export type CatalogStrategyFilter = ProjectStrategy | "all";
export type CatalogSort = "featured" | "funded_desc" | "irr_desc";

const catalogSortOptions: CatalogSort[] = [
  "featured",
  "funded_desc",
  "irr_desc",
];

export function isCatalogStrategyFilter(
  value: string,
): value is CatalogStrategyFilter {
  return (
    value === "all" || projectStrategies.includes(value as ProjectStrategy)
  );
}

export function isCatalogSort(value: string): value is CatalogSort {
  return catalogSortOptions.includes(value as CatalogSort);
}

export function getProjectCatalog(input: {
  locale: AppLocale;
  search: string;
  strategy: CatalogStrategyFilter;
  sort?: CatalogSort;
}) {
  const search = input.search.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const strategyMatch =
      input.strategy === "all" || project.strategy === input.strategy;

    if (!strategyMatch) {
      return false;
    }

    if (!search) {
      return true;
    }

    const localizedTitle =
      input.locale === "bg" ? project.title_bg : project.title_en;

    return (
      localizedTitle.toLowerCase().includes(search) ||
      project.city.toLowerCase().includes(search) ||
      project.slug.toLowerCase().includes(search)
    );
  });

  const sorted = [...filtered];
  if (input.sort === "funded_desc") {
    sorted.sort((a, b) => b.fundedPct - a.fundedPct);
  } else if (input.sort === "irr_desc") {
    sorted.sort((a, b) => b.expectedIrrPct - a.expectedIrrPct);
  }

  return {
    items: sorted.map((project) => ({
      city: project.city,
      expectedIrrPct: project.expectedIrrPct,
      fundedPct: project.fundedPct,
      id: project.id,
      slug: project.slug,
      strategy: project.strategy,
      title: input.locale === "bg" ? project.title_bg : project.title_en,
    })),
    total: filtered.length,
  };
}

export function getProjectBySlug(slug: string, locale: AppLocale) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return {
    city: project.city,
    expectedIrrPct: project.expectedIrrPct,
    fundedPct: project.fundedPct,
    id: project.id,
    slug: project.slug,
    strategy: project.strategy,
    title: locale === "bg" ? project.title_bg : project.title_en,
  };
}
