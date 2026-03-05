import "next-auth";

declare module "next-auth" {
	interface Session {
		user: User;
	}
	interface User {
		id: string;
		avatar?: string;
		email?: string;
		firstName?: string;
		lastName?: string;
		emailVerified?: Date;
	}
}
