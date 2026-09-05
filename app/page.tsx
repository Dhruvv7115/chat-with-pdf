import { NavbarDemo } from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero/hero-section";
import HowItWorksSection from "@/components/landing/how-it-works/how-it-works-section";
import FeaturesSection from "@/components/landing/features/features-section";
import Container from "@/components/container";
import TestimonialsSection from "@/components/landing/testimonials/testimonials-section";
import { Footer } from "@/components/landing/footer/footer";
import PricingSection from "@/components/landing/pricing/pricing-section";
import { ScrollSpyProvider } from "@/components/landing/scroll-spy-context";

export default async function Page() {
	return (
		<Container>
			<ScrollSpyProvider>
				<header className="sticky z-50 flex justify-center transition-all duration-300 md:mx-0 top-0 lg:top-4 mx-0">
					<NavbarDemo />
				</header>
				<HeroSection />
				<HowItWorksSection />
				<FeaturesSection />
				<PricingSection />
				<Footer />
			</ScrollSpyProvider>
		</Container>
	);
}
