import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SEO = ({
  title,
  description,
  image = 'https://johnlin.me/assets/images/johnlin.jpeg',
  article = false,
}) => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const url = `https://johnlin.me${pathname}`

  return (
    <Helmet>
      <title>{title || t('website.title', { ns: 'common' })}</title>
      <meta
        name="description"
        content={description || t('website.description', { ns: 'common' })}
      />
      <meta
        name="image"
        content={image || 'https://johnlin.me/assets/images/johnlin.jpeg'}
      />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta
        property="og:title"
        content={title || t('website.title', { ns: 'common' })}
      />
      <meta
        property="og:description"
        content={description || t('website.description', { ns: 'common' })}
      />
      <meta
        property="og:image"
        content={image || 'https://johnlin.me/assets/images/johnlin.jpeg'}
      />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={title || t('website.title', { ns: 'common' })}
      />
      <meta
        name="twitter:description"
        content={description || t('website.description', { ns: 'common' })}
      />
      <meta
        name="twitter:image"
        content={image || 'https://johnlin.me/assets/images/johnlin.jpeg'}
      />

      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEO
