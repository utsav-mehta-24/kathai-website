import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SensoryScroll from './components/SensoryScroll'
import FlavorMatrix from './components/FlavorMatrix'
import BrewingRitual from './components/BrewingRitual'
import Footer from './components/Footer'
import SearchDrawer from './components/SearchDrawer'
import StructuredData from './components/StructuredData'
import type { Flavor, Collection } from './lib/products'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCollection, setActiveCollection] = useState<Collection | 'ALL'>('ALL')

  const selectFlavor = (flavor: Flavor) => {
    setActiveCollection(flavor.collection)
    setSearchOpen(false)
    window.setTimeout(() => {
      document.getElementById(`flavor-${flavor.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 120)
  }

  return (
    <>
      <StructuredData />
      <div className="grain">
        <Navbar onSearch={() => setSearchOpen(true)} />
        <main>
          <Hero />
          <SensoryScroll />
          <FlavorMatrix
            activeCollection={activeCollection}
            onCollectionChange={setActiveCollection}
          />
          <BrewingRitual />
        </main>
        <Footer />
        <SearchDrawer
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectFlavor={selectFlavor}
        />
      </div>
    </>
  )
}
