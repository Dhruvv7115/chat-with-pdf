import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { IconLoader } from "@tabler/icons-react";
type Inputs = {
	email: string;
	password: string;
};

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const router = useRouter();

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm<Inputs>();

	const onSubmit = async (data: Inputs) => {
		await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		});
		toast.success("Logged in successfully");
		reset();
		router.push("/dashboard");
	};
	return (
		<form
			className={cn("flex flex-col gap-6", className)}
			{...props}
			onSubmit={handleSubmit(onSubmit)}
		>
			<FieldGroup>
				<div className="flex flex-col items-start gap-1">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						required
						className="bg-background"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Invalid email address",
							},
						})}
					/>
					{errors.email && (
						<span className="text-red-500 text-sm font-normal">
							&#x2022; {errors.email.message}
						</span>
					)}
				</Field>
				<Field>
					<div className="flex items-center">
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Link
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<Input
						id="password"
						type="password"
						required
						className="bg-background"
						{...register("password", {
							required: true,
							minLength: {
								value: 6,
								message: "Minimum 6 characters",
							},
						})}
					/>
					{errors.password && (
						<span className="text-red-500 text-sm font-normal">
							&#x2022; {errors.password.message}
						</span>
					)}
				</Field>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<IconLoader className="h-4 w-4 animate-spin" />
								Logging in...
							</span>
						) : (
							"Login"
						)}
					</Button>
				</Field>
				<FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
					Or continue with
				</FieldSeparator>
				<Field>
					<Button
						variant="outline"
						type="button"
						onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
					>
						<Image
							src="https://thesvg.org/icons/google/default.svg"
							alt="Google"
							width={16}
							height={16}
						/>
						Login with Google
					</Button>
					<Button
						variant="outline"
						type="button"
						onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
					>
						<Image
							src="https://thesvg.org/icons/github/default.svg"
							alt="GitHub"
							width={16}
							height={16}
							className="block dark:hidden"
						/>
						<Image
							src="https://thesvg.org/icons/github/dark.svg"
							alt="GitHub"
							width={16}
							height={16}
							className="dark:block hidden"
						/>
						Login with GitHub
					</Button>

					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="underline underline-offset-4"
						>
							Sign up
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
