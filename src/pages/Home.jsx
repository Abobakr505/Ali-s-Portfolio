import React from 'react'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Statistics from '../sections/Statistics'
import Services from '../sections/Services'
import Work from '../sections/Work'
import Companies from '../sections/Companies'
import TimelineSection from '../sections/timeline'
import Marquee from '../sections/Marquee'
import CTA from '../components/CTA'

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
      <Marquee />
      <CTA />
    </>
  )
}

export default Home
