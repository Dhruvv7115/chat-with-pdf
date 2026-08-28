import {
	FontSize,
	FontStyle,
	Language,
	ResponseStyle,
	usePreferences,
} from "@/hooks/use-preferences";
import { commonDotStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const PreferencesSection = () => {
	const { preferences, updatePreferences, resetPreferences, hydrated } =
		usePreferences();
	const { theme, setTheme } = useTheme();

	if (!hydrated || !preferences) {
		return <div className="h-75 rounded-lg border bg-card animate-pulse" />;
	}

	return (
		<div className="w-full bg-muted dark:bg-neutral-800 border-dashed border border-neutral-300 lg:p-6 md:p-4 p-2 relative">
			<span className={cn("-top-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-top-0.5 -right-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -left-0.5", commonDotStyles)} />
			<span className={cn("-bottom-0.5 -right-0.5", commonDotStyles)} />

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">Preferences</CardTitle>
					<CardDescription>
						Customize how ChatWithPDF looks and behaves for you
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					{/* Theme */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Theme</p>
							<p className="text-xs text-muted-foreground">
								Choose how ChatWithPDF appears across the app
							</p>
						</div>

						<Select
							value={theme}
							onValueChange={(value) => setTheme(value)}
						>
							<SelectTrigger className="w-32.5 h-8 text-xs">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="system">System</SelectItem>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Language */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Language</p>
							<p className="text-xs text-muted-foreground">
								Choose your preferred language
							</p>
						</div>

						<Select
							value={preferences.language}
							onValueChange={(value) =>
								updatePreferences({
									language: value as Language,
								})
							}
						>
							<SelectTrigger className="w-32.5 h-8 text-xs">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="hi">Hindi</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* font-styles */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Font Family</p>
							<p className="text-xs text-muted-foreground">
								Change the font style
							</p>
						</div>

						<Select
							value={preferences.fontStyle}
							onValueChange={(value) =>
								updatePreferences({
									fontStyle: value as FontStyle,
								})
							}
						>
							<SelectTrigger className="w-32.5 h-8 text-xs">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="sans">Geist Sans</SelectItem>
								<SelectItem value="inter">Inter</SelectItem>
								<SelectItem value="mono">Geist Mono</SelectItem>
								<SelectItem value="jet-mono">Jet Mono</SelectItem>
								<SelectItem value="literata">Literata</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{/* font-size */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Font Size</p>
							<p className="text-xs text-muted-foreground">
								Change the font size
							</p>
						</div>

						<Select
							value={preferences.fontSize ?? "16px"}
							onValueChange={(value) =>
								updatePreferences({
									fontSize: value as FontSize,
								})
							}
							defaultValue="16px"
						>
							<SelectTrigger className="w-32.5 h-8 text-xs">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="14px">Small</SelectItem>
								<SelectItem value="15px">Medium</SelectItem>
								<SelectItem value="16px">Large</SelectItem>
								<SelectItem value="18px">Extra Large</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Response style */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Response style</p>
							<p className="text-xs text-muted-foreground">
								Choose how detailed AI responses should be
							</p>
						</div>

						<Select
							value={preferences.responseStyle}
							onValueChange={(value) =>
								updatePreferences({
									responseStyle: value as ResponseStyle,
								})
							}
						>
							<SelectTrigger className="w-32.5 h-8 text-xs">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="concise">Concise</SelectItem>
								<SelectItem value="balanced">Balanced</SelectItem>
								<SelectItem value="detailed">Detailed</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Auto scroll */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Follow AI responses</p>
							<p className="text-xs text-muted-foreground">
								Automatically follow the latest response while it streams
							</p>
						</div>

						<Switch
							checked={preferences.autoScroll}
							onCheckedChange={(checked: boolean) =>
								updatePreferences({
									autoScroll: checked,
								})
							}
						/>
					</div>

					{/* Read aloud */}
					<div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Read responses aloud</p>
							<p className="text-xs text-muted-foreground">
								Enable text-to-speech for AI responses
							</p>
						</div>

						<Switch
							checked={preferences.readAloud}
							onCheckedChange={(checked: boolean) =>
								updatePreferences({
									readAloud: checked,
								})
							}
						/>
					</div>

					{/* Custom Persona */}
					<div className="flex flex-col gap-2.5 rounded-lg border px-4 py-3">
						<div>
							<p className="text-sm font-medium">Custom Persona</p>
							<p className="text-xs text-muted-foreground">
								Instruct the AI to adopt a specific role or style (e.g.
								"Sarcastic Developer", "Physics Professor")
							</p>
						</div>

						<textarea
							value={preferences.persona ?? ""}
							onChange={(e) =>
								updatePreferences({
									persona: e.target.value,
								})
							}
							placeholder="Enter a custom persona..."
							rows={3}
							className="w-full min-h-20 p-3 rounded-md border border-input bg-transparent text-xs outline-none resize-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default PreferencesSection;
