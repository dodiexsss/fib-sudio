import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Manifesto from './components/Manifesto.jsx'
import Portfolio from './components/Portfolio.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Testimonial from './components/Testimonial.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'

function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Hero />
        <Manifesto />
        <Portfolio />
        <Services />
        <Process />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default App
