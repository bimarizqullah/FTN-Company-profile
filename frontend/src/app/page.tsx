import FeaturedProjects from '@/components/Home/FeaturedProperty'
import Hero from '@/components/Home/Hero'
import Services from '@/components/Home/Services'
import Testimonial from '@/components/Home/Testimonial'
import BlogSmall from '@/components/shared/Blog'
import GetInTouch from '@/components/Home/GetInTouch'
import FAQ from '@/components/Home/FAQs'
import VisionMission from '@/components/Home/VisionMission'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <VisionMission />
      <FeaturedProjects />
      <Testimonial />
      <BlogSmall />
      <GetInTouch />
      <FAQ />
    </main>
  )
}
