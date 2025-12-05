// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare-pages",
  },
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap",
        },
      ],
      script: [
        {
          src: "https://www.biblegateway.com/public/link-to-us/tooltips/bglinks-es.js",
          type: "text/javascript",
          tagPosition: "bodyClose" as const,
        },
        {
          innerHTML: 'BGLinks.version = "NBLA"; BGLinks.linkVerses();',
          type: "text/javascript",
          tagPosition: "bodyClose" as const,
        },
      ],
    },
  },
});
