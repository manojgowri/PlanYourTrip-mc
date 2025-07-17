/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "www.countryflags.com",
      },
      {
        protocol: "https",
        hostname: "www.worldatlas.com",
      },
      {
        protocol: "https",
        hostname: "www.travelandleisure.com",
      },
      {
        protocol: "https",
        hostname: "www.nationalgeographic.com",
      },
      {
        protocol: "https",
        hostname: "www.lonelyplanet.com",
      },
      {
        protocol: "https",
        hostname: "www.tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "www.booking.com",
      },
      {
        protocol: "https",
        hostname: "www.expedia.com",
      },
      {
        protocol: "https",
        hostname: "www.airbnb.com",
      },
      {
        protocol: "https",
        hostname: "www.getyourguide.com",
      },
      {
        protocol: "https",
        hostname: "www.viator.com",
      },
      {
        protocol: "https",
        hostname: "www.klook.com",
      },
      {
        protocol: "https",
        hostname: "www.skyscanner.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "www.bing.com",
      },
      {
        protocol: "https",
        hostname: "www.duckduckgo.com",
      },
      {
        protocol: "https",
        hostname: "www.yahoo.com",
      },
      {
        protocol: "https",
        hostname: "www.baidu.com",
      },
      {
        protocol: "https",
        hostname: "www.yandex.com",
      },
      {
        protocol: "https",
        hostname: "www.naver.com",
      },
      {
        protocol: "https",
        hostname: "www.daum.net",
      },
      {
        protocol: "https",
        hostname: "www.ecosia.org",
      },
      {
        protocol: "https",
        hostname: "www.qwant.com",
      },
      {
        protocol: "https",
        hostname: "www.startpage.com",
      },
      {
        protocol: "https",
        hostname: "www.swisscows.com",
      },
      {
        protocol: "https",
        hostname: "www.gibiru.com",
      },
      {
        protocol: "https",
        hostname: "www.search.brave.com",
      },
      {
        protocol: "https",
        hostname: "www.you.com",
      },
      {
        protocol: "https",
        hostname: "www.perplexity.ai",
      },
      {
        protocol: "https",
        hostname: "www.phind.com",
      },
      {
        protocol: "https",
        hostname: "www.chat.openai.com",
      },
      {
        protocol: "https",
        hostname: "www.gemini.google.com",
      },
      {
        protocol: "https",
        hostname: "www.claude.ai",
      },
      {
        protocol: "https",
        hostname: "www.copilot.microsoft.com",
      },
      {
        protocol: "https",
        hostname: "www.midjourney.com",
      },
      {
        protocol: "https",
        hostname: "www.dall-e.com",
      },
      {
        protocol: "https",
        hostname: "www.stable-diffusion.com",
      },
      {
        protocol: "https",
        hostname: "www.runwayml.com",
      },
      {
        protocol: "https",
        hostname: "www.heygen.com",
      },
    ],
  },
}

module.exports = nextConfig