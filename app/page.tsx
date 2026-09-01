import { ComponentExample } from "@/components/component-example";
import { NavbarDemo } from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero/hero-section";
import Container from "@/components/container";
import TestimonialsSection from "@/components/landing/testimonials/testimonials-section";
import { Footer } from "@/components/landing/footer/footer";

export default async function Page() {
	return (
		<Container>
			<header className="sticky z-50 flex justify-center transition-all duration-300 md:mx-0 top-0 lg:top-4 mx-0">
				<NavbarDemo />
			</header>
			<HeroSection />
			<section>
				<ComponentExample />
			</section>
			<TestimonialsSection />
			<Footer />
		</Container>
	);
}
