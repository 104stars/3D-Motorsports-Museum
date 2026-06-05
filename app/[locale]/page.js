import { getTranslations } from "next-intl/server"
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import FeaturedExhibits from "@/components/FeaturedExhibits"
import ExploreInvitation from "@/components/ExploreInvitation"
import AboutSection from "@/components/AboutSection"

export default async function Page() {
  const t = await getTranslations("footer")

  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection />
        <FeaturedExhibits />
        <ExploreInvitation />
        <AboutSection />
      </main>
      <footer className="bg-neutral-950 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-neutral-500 text-sm font-light">{t("copyright")}</p>
      </footer>
    </>
  )
}
