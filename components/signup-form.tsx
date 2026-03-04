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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
type Inputs = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};
export function SignupForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const router = useRouter();
	const registerUser = api.user.register.useMutation();

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm<Inputs>();

	// async function onSubmit(e: React.FormEvent) {
	// 	e.preventDefault();
	// 	setError("");
	// 	setLoading(true);

	// 	// 1. Register user via our custom API route
	// 	const res = await fetch("/api/auth/register", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify(form),
	// 	});

	// 	const data = await res.json();

	// 	if (!res.ok) {
	// 		setError(data.error ?? "Something went wrong");
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	// 2. Auto sign in after successful registration
	// 	await signIn("credentials", {
	// 		email: form.email,
	// 		password: form.password,
	// 		redirect: false,
	// 	});

	// 	router.push("/dashboard");
	// }

	// async function handleOAuth(provider: "google" | "github") {
	// 	await signIn(provider, { callbackUrl: "/dashboard" });
	// }
	const onSubmit: SubmitHandler<Inputs> = (data) => {
		registerUser.mutate(data, {
			onSuccess: async () => {
				// 2. Auto sign in after successful registration
				await signIn("credentials", {
					email: data.email,
					password: data.password,
					redirect: false,
				});
				toast.success("Account created successfully");
				reset();
				router.push("/");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};
	return (
		<form
			className={cn("flex flex-col gap-6", className)}
			{...props}
			onSubmit={handleSubmit(onSubmit)}
		>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Create your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Fill in the form below to create your account
					</p>
				</div>
				<Field className="flex flex-row">
					<Field>
						{errors.firstName && (
							<span className="text-red-500 text-sm font-normal">
								&#x2022; {errors.firstName.message}
							</span>
						)}
						<FieldLabel htmlFor="name">First Name</FieldLabel>
						<Input
							id="name"
							type="text"
							placeholder="John"
							required
							className="bg-background"
							{...register("firstName", { required: true })}
						/>
					</Field>
					<Field>
						{errors.lastName && (
							<span className="text-red-500 text-sm font-normal">
								&#x2022; {errors.lastName.message}
							</span>
						)}
						<FieldLabel htmlFor="name">Last Name</FieldLabel>
						<Input
							id="name"
							type="text"
							placeholder="Doe"
							required
							className="bg-background"
							{...register("lastName", { required: true })}
						/>
					</Field>
				</Field>
				<Field>
					{errors.email && (
						<span className="text-red-500 text-sm font-normal">
							&#x2022; {errors.email.message}
						</span>
					)}
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
					<FieldDescription className="text-xs">
						We&apos;ll use this to contact you. We will not share your email
						with anyone else.
					</FieldDescription>
				</Field>
				<Field>
					{errors.password && (
						<span className="text-red-500 text-sm font-normal">
							&#x2022; {errors.password.message}
						</span>
					)}
					<FieldLabel htmlFor="password">Password</FieldLabel>
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
					<FieldDescription className="text-xs">
						Must be at least 8 characters long.
					</FieldDescription>
				</Field>
				<Field>
					{errors.confirmPassword && (
						<span className="text-red-500 text-sm font-normal">
							&#x2022; {errors.confirmPassword.message}
						</span>
					)}
					<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
					<Input
						id="confirm-password"
						type="password"
						required
						className="bg-background"
						{...register("confirmPassword", {
							required: true,
							validate: (value) =>
								value === getValues("password") || "Passwords do not match",
						})}
					/>
					<FieldDescription className="text-xs">Please confirm your password.</FieldDescription>
				</Field>
				<Field>
					<Button
						disabled={isSubmitting || registerUser.isPending}
						type="submit"
					>
						{isSubmitting || registerUser.isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Creating Account...
							</span>
						) : (
							"Create Account"
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
					>
						<svg
							viewBox="-3 0 262 262"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="xMidYMid"
							fill="#000000"
						>
							<g
								id="SVGRepo_bgCarrier"
								strokeWidth="0"
							></g>
							<g
								id="SVGRepo_tracerCarrier"
								strokeLinecap="round"
								strokeLinejoin="round"
							></g>
							<g id="SVGRepo_iconCarrier">
								<path
									d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
									fill="#4285F4"
								></path>
								<path
									d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
									fill="#34A853"
								></path>
								<path
									d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
									fill="#FBBC05"
								></path>
								<path
									d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
									fill="#EB4335"
								></path>
							</g>
						</svg>
						Login with Google
					</Button>
					<Button
						variant="outline"
						type="button"
					>
						<svg
							viewBox="0 0 20 20"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							fill="#000000"
						>
							<g
								id="SVGRepo_bgCarrier"
								strokeWidth="0"
							></g>
							<g
								id="SVGRepo_tracerCarrier"
								strokeLinecap="round"
								strokeLinejoin="round"
							></g>
							<g id="SVGRepo_iconCarrier">
								<title>github [#142]</title> <desc>Created with Sketch.</desc>{" "}
								<defs> </defs>
								<g
									id="Page-1"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g
										id="Dribbble-Light-Preview"
										transform="translate(-140.000000, -7559.000000)"
										fill="#000000"
									>
										<g
											id="icons"
											transform="translate(56.000000, 160.000000)"
										>
											<path
												d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
												id="github-[#142]"
											></path>
										</g>
									</g>
								</g>
							</g>
						</svg>
						Login with GitHub
					</Button>
					<FieldDescription className="px-6 text-center">
						Already have an account? <Link href="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
