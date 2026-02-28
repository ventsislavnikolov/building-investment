import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface TopBarProps {
	title?: string;
	userEmail?: string;
	userName?: string;
	userAvatar?: string;
	onMenuClick?: () => void;
	className?: string;
}

export function TopBar({
	title,
	userEmail,
	userName,
	userAvatar,
	onMenuClick,
	className,
}: TopBarProps) {
	const initials = userName
		? userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "?";

	return (
		<header
			className={cn(
				"flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-surface shrink-0",
				className,
			)}
		>
			{/* Left: hamburger (mobile) + title */}
			<div className="flex items-center gap-3">
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={onMenuClick}
					aria-label="open menu"
				>
					<Menu className="w-5 h-5" />
				</Button>
				{title && (
					<h1 className="text-base md:text-lg font-semibold text-text truncate">
						{title}
					</h1>
				)}
			</div>

			{/* Right: bell + user */}
			<div className="flex items-center gap-2 md:gap-4">
				<Button variant="ghost" size="icon" aria-label="notifications">
					<Bell className="w-5 h-5 text-muted" />
				</Button>

				<div className="hidden md:flex items-center gap-2">
					<Avatar className="w-8 h-8">
						<AvatarImage src={userAvatar} alt={userName} />
						<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
					{(userName || userEmail) && (
						<div className="flex flex-col leading-tight">
							{userName && (
								<span className="text-sm font-medium text-text truncate max-w-[140px]">
									{userName}
								</span>
							)}
							{userEmail && (
								<span className="text-xs text-muted truncate max-w-[140px]">
									{userEmail}
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
