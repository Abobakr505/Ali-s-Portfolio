import React from 'react'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Statistics from '../sections/Statistics'
import Services from '../sections/Services'
import Work from '../sections/Work'
import Companies from '../sections/Companies'
import TimelineSection from '../sections/Timeline'
import Marquee from '../sections/Marquee'
import CTA from '../components/CTA'
import Testimonials from '../sections/Testimonials'
import ScrollUp from '../sections/ScrollUp'

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Statistics />
      <Skills />
      <Services />
      <Work />
      <Companies />
      <TimelineSection />
      <Testimonials/>
      <Marquee />
      <CTA />
      <ScrollUp/>
    </>
  )
}

export default Home
