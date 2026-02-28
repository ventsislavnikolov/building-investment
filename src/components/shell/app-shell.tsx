import { useState } from "react";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { type NavItem, Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
	children: React.ReactNode;
	navItems: NavItem[];
	bottomNavItems?: NavItem[];
	title?: string;
	userName?: string;
	userEmail?: string;
	userAvatar?: string;
	onLogout?: () => void;
}

export function AppShell({
	children,
	navItems,
	bottomNavItems,
	title,
	userName,
	userEmail,
	userAvatar,
	onLogout,
}: AppShellProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		/* Outer blue frame */
		<div className="min-h-screen bg-primary p-3">
			{/* Inner white card */}
			<div className="bg-surface rounded-3xl min-h-[calc(100vh-24px)] flex flex-col overflow-hidden">
				<TopBar
					title={title}
					userName={userName}
					userEmail={userEmail}
					userAvatar={userAvatar}
					onMenuClick={() => setMobileOpen(true)}
				/>

				<div className="flex flex-1 overflow-hidden">
					{/* Desktop/tablet sidebar */}
					<Sidebar
						items={navItems}
						bottomItems={bottomNavItems}
						onLogout={onLogout}
					/>

					{/* Mobile drawer */}
					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
						<SheetContent side="left" className="p-0 w-64">
							<Sidebar
								items={navItems}
								bottomItems={bottomNavItems}
								onLogout={onLogout}
								className="flex md:hidden w-full h-full border-0"
							/>
						</SheetContent>
					</Sheet>

					{/* Main content */}
					<main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
				</div>
			</div>
		</div>
	);
}
