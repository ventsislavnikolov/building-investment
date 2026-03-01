import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProjectGalleryProps {
	images: string[];
	title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
	const [current, setCurrent] = useState(0);

	if (!images.length) {
		return (
			<div className="aspect-[16/9] rounded-2xl bg-[#f8f9fa] border border-border flex items-center justify-center">
				<Building2 className="w-16 h-16 text-muted/40" />
			</div>
		);
	}

	return (
		<div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#f8f9fa]">
			<img
				src={images[current]}
				alt={`${title} — view ${current + 1}`}
				className="w-full h-full object-cover"
			/>

			{images.length > 1 && (
				<>
					<button
						type="button"
						onClick={() =>
							setCurrent((c) => (c - 1 + images.length) % images.length)
						}
						className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
						aria-label="previous photo"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					<button
						type="button"
						onClick={() => setCurrent((c) => (c + 1) % images.length)}
						className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
						aria-label="next photo"
					>
						<ChevronRight className="w-4 h-4" />
					</button>

					{/* Dots */}
					<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
						{images.map((url, i) => (
							<button
								key={url}
								type="button"
								onClick={() => setCurrent(i)}
								className={`w-1.5 h-1.5 rounded-full transition-colors ${
									i === current ? "bg-white" : "bg-white/50"
								}`}
								aria-label={`photo ${i + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
