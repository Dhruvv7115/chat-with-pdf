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
	SelectLabel,
	SelectGroup,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import ThemeSwitcher from "../theme-switcher";

const PreferencesSection = () => {
	const { preferences, updatePreferences, resetPreferences, hydrated } =
		usePreferences();
	const { theme, setTheme } = useTheme();

	if (!hydrated || !preferences) {
		return <div className="h-75 rounded-lg border bg-card animate-pulse" />;
	}

	return (
		<Card
			className={cn(
				"flex flex-col h-full rounded-3xl p-2",
				"border border-neutral-100 dark:border-neutral-800",
				"bg-white dark:bg-neutral-900",
				"lg:col-span-2 col-span-1",
			)}
		>
			<CardHeader className="rounded-xl bg-neutral-200 dark:bg-neutral-800 py-4">
				<CardTitle className="text-base font-medium">Preferences</CardTitle>
				<CardDescription>
					Customize how ChatWithPDF looks and behaves for you
				</CardDescription>
			</CardHeader>

			<CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full p-2">
				{/* Theme */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
					<div>
						<p className="text-sm font-medium">Theme</p>
						<p className="text-xs text-muted-foreground">
							Choose how ChatWithPDF appears across the app
						</p>
					</div>

					<ThemeSwitcher />
				</div>

				{/* Language */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
							<SelectGroup>
								<SelectLabel>Languages</SelectLabel>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="hi">Hindi</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* font-styles */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
							<SelectGroup>
								<SelectLabel>Fonts</SelectLabel>
								<SelectItem value="sans">Geist Sans</SelectItem>
								<SelectItem value="inter">Inter</SelectItem>
								<SelectItem value="mono">Geist Mono</SelectItem>
								<SelectItem value="jet-mono">Jet Mono</SelectItem>
								<SelectItem value="literata">Literata</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				{/* font-size */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
							<SelectGroup>
								<SelectLabel>Font Sizes</SelectLabel>
								<SelectItem value="14px">Small</SelectItem>
								<SelectItem value="15px">Medium</SelectItem>
								<SelectItem value="16px">Large</SelectItem>
								<SelectItem value="18px">Extra Large</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* Response style */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
							<SelectGroup>
								<SelectLabel>Response Styles</SelectLabel>
								<SelectItem value="concise">Concise</SelectItem>
								<SelectItem value="balanced">Balanced</SelectItem>
								<SelectItem value="detailed">Detailed</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{/* Auto scroll */}
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
				<div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-muted">
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
				<div className="flex flex-col gap-2.5 rounded-lg px-4 py-3 bg-muted col-span-1 lg:col-span-2">
					<div>
						<p className="text-sm font-medium">Custom Persona</p>
						<p className="text-xs text-muted-foreground">
							Instruct the AI to adopt a specific role or style (e.g. "Sarcastic
							Developer", "Physics Professor")
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
	);
};

export default PreferencesSection;
