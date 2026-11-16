import { Helmet } from 'react-helmet-async'
import { FLAVORS } from '../lib/products'

const brandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Kathai',
  slogan: 'Crafted for your moments',
  description:
    'A flavour-first hot chocolate concept built around familiar favourites, unexpected pairings and personal rituals.',
}

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Kathai flavour concepts',
  description:
    'An in-development collection of hot chocolate flavour concepts across KLASSICS, MOOD MELT and MACROMELT.',
  itemListElement: FLAVORS.map((flavor, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: flavor.name,
    description: flavor.description,
  })),
}

export default function StructuredData() {
  return (
    <Helmet>
      <title>Kathai — A Story in a Cup</title>
      <meta
        name="description"
        content="Discover Kathai's flavour-first hot chocolate concepts, from familiar classics to unexpected pairings. A story in a cup, crafted for your moments."
      />
      <meta
        name="keywords"
        content="premium hot chocolate, artisanal hot chocolate, flavoured hot chocolate, matcha hot chocolate, chilli hot chocolate, Kathai"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://kathai.in" />
      <meta property="og:title" content="Kathai — A Story in a Cup" />
      <meta
        property="og:description"
        content="Explore Kathai's hot chocolate flavour concepts, from familiar comfort to unexpected discovery."
      />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Kathai" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="Kathai — A Story in a Cup" />
      <meta
        property="twitter:description"
        content="Explore Kathai's hot chocolate flavour concepts, from familiar comfort to unexpected discovery."
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Kathai" />
      <link rel="canonical" href="https://kathai.in" />
      <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
    </Helmet>
  )
}
