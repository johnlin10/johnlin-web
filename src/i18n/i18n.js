import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

//* common translation
import commonEnUS from './locales/common/en-US.json'
import commonZhTW from './locales/common/zh-TW.json'

//* components translation
// fireworks
import fireworksEnUS from './locales/components/fireworks/en-US.json'
import fireworksZhTW from './locales/components/fireworks/zh-TW.json'
// footer
import footerEnUS from './locales/components/footer/en-US.json'
import footerZhTW from './locales/components/footer/zh-TW.json'
// header
import headerEnUS from './locales/components/header/en-US.json'
import headerZhTW from './locales/components/header/zh-TW.json'
// imageViewer
import imageViewerEnUS from './locales/components/imageViewer/en-US.json'
import imageViewerZhTW from './locales/components/imageViewer/zh-TW.json'
// settings
import settingsEnUS from './locales/components/settings/en-US.json'
import settingsZhTW from './locales/components/settings/zh-TW.json'
// snow
import snowEnUS from './locales/components/snow/en-US.json'
import snowZhTW from './locales/components/snow/zh-TW.json'

//* pages translation
// home
import homeEnUS from './locales/pages/home/en-US.json'
import homeZhTW from './locales/pages/home/zh-TW.json'
// blog
import blogEnUS from './locales/pages/blog/en-US.json'
import blogZhTW from './locales/pages/blog/zh-TW.json'
// portfolio
import portfolioEnUS from './locales/pages/portfolio/en-US.json'
import portfolioZhTW from './locales/pages/portfolio/zh-TW.json'
// shortcutUrlGenerator
import shortcutUrlGeneratorEnUS from './locales/pages/shortcutUrlGenerator/en-US.json'
import shortcutUrlGeneratorZhTW from './locales/pages/shortcutUrlGenerator/zh-TW.json'
// laboratory
import laboratoryEnUS from './locales/pages/laboratory/en-US.json'
import laboratoryZhTW from './locales/pages/laboratory/zh-TW.json'
// colorJudgeGame
import colorJudgeGameEnUS from './locales/components/colorJudgeGame/en-US.json'
import colorJudgeGameZhTW from './locales/components/colorJudgeGame/zh-TW.json'
// textCounter
import textCounterEnUS from './locales/pages/laboratory/items/TextCounter/en-US.json'
import textCounterZhTW from './locales/pages/laboratory/items/TextCounter/zh-TW.json'
// toneGenerator
import toneGeneratorEnUS from './locales/pages/laboratory/items/ToneGenerator/en-US.json'
import toneGeneratorZhTW from './locales/pages/laboratory/items/ToneGenerator/zh-TW.json'
// schedule
import scheduleEnUS from './locales/pages/schedule/en-US.json'
import scheduleZhTW from './locales/pages/schedule/zh-TW.json'

const savedLanguage = localStorage.getItem('language') || 'en-US'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        // components
        common: commonEnUS,
        header: headerEnUS,
        footer: footerEnUS,
        imageViewer: imageViewerEnUS,
        settings: settingsEnUS,
        snow: snowEnUS,
        fireworks: fireworksEnUS,
        // pages
        home: homeEnUS,
        portfolio: portfolioEnUS,
        blog: blogEnUS,
        shortcutUrlGenerator: shortcutUrlGeneratorEnUS,
        laboratory: laboratoryEnUS,
        colorJudgeGame: colorJudgeGameEnUS,
        textCounter: textCounterEnUS,
        toneGenerator: toneGeneratorEnUS,
        schedule: scheduleEnUS,
      },
      'zh-TW': {
        // components
        common: commonZhTW,
        header: headerZhTW,
        footer: footerZhTW,
        imageViewer: imageViewerZhTW,
        settings: settingsZhTW,
        snow: snowZhTW,
        fireworks: fireworksZhTW,
        // pages
        home: homeZhTW,
        portfolio: portfolioZhTW,
        blog: blogZhTW,
        shortcutUrlGenerator: shortcutUrlGeneratorZhTW,
        laboratory: laboratoryZhTW,
        colorJudgeGame: colorJudgeGameZhTW,
        textCounter: textCounterZhTW,
        toneGenerator: toneGeneratorZhTW,
        schedule: scheduleZhTW,
      },
    },
    ns: [
      // components
      'common',
      'header',
      'footer',
      'imageViewer',
      'settings',
      'snow',
      'fireworks',
      // pages
      'home',
      'portfolio',
      'blog',
      'shortcutUrlGenerator',
      'laboratory',
      'colorJudgeGame',
      'textCounter',
      'toneGenerator',
      'schedule',
    ],
    defaultNS: 'common',
    fallbackNS: 'common',
    lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  document.documentElement.lang = lng
})

export default i18n
