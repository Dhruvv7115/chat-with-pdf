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
import { useTheme } from "next-themes";
import Image from "next/image";
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
	const { theme } = useTheme();

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm<Inputs>();

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
				router.push("/dashboard");
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
					<FieldDescription className="text-xs">
						Please confirm your password.
					</FieldDescription>
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
					<FieldDescription className="px-6 text-center">
						Already have an account? <Link href="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
