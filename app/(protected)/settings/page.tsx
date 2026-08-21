"use client";

import PreferencesSection from "@/components/settings/preferences-section";
import PasswordSection from "@/components/settings/password-section";
import AccountsSection from "@/components/settings/accounts-section";
import DangerZone from "@/components/settings/danger-zone";
import ProfileSection from "@/components/settings/profile-section";

export default function SettingsPage() {
	return (
		<div className="bg-sidebar">
			<div className="mx-auto px-6 py-6 space-y-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-accent-foreground">
						Settings
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your account preferences
					</p>
				</div>
				
				{/* Profile */}
				<ProfileSection />

				{/* ── Preferences ── */}
				<PreferencesSection />

				{/* Password */}
				<PasswordSection />

				{/* Connected accounts */}
				<AccountsSection />

				{/* Danger zone */}
				<DangerZone />
			</div>
		</div>
	);
}
