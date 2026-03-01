import type { Locale } from "~/lib/i18n";
import { ProjectCard, type ProjectCardData } from "./project-card";

interface ProjectGridProps {
	projects: ProjectCardData[];
	locale: Locale;
}

export function ProjectGrid({ projects, locale }: ProjectGridProps) {
	if (projects.length === 0) {
		return (
			<div className="col-span-full text-center py-16">
				<p className="text-muted">
					No projects found. Try adjusting your filters.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} locale={locale} />
			))}
		</div>
	);
}
