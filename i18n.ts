import { getRequestConfig } from 'next-intl/server'
import { routing } from './src/lib/routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'de' | 'en' | 'fr' | 'it')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  }
})
