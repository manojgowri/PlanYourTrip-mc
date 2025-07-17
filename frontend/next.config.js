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
        hostname: "www.roughguides.com",
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
      {
        protocol: "https",
        hostname: "www.synthesia.io",
      },
      {
        protocol: "https",
        hostname: "www.descript.com",
      },
      {
        protocol: "https",
        hostname: "www.elevenlabs.io",
      },
      {
        protocol: "https",
        hostname: "www.play.ht",
      },
      {
        protocol: "https",
        hostname: "www.lovo.ai",
      },
      {
        protocol: "https",
        hostname: "www.murf.ai",
      },
      {
        protocol: "https",
        hostname: "www.adobe.com",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
      {
        protocol: "https",
        hostname: "www.sketch.com",
      },
      {
        protocol: "https",
        hostname: "www.invisionapp.com",
      },
      {
        protocol: "https",
        hostname: "www.miro.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "www.asana.com",
      },
      {
        protocol: "https",
        hostname: "www.jira.com",
      },
      {
        protocol: "https",
        hostname: "www.trello.com",
      },
      {
        protocol: "https",
        hostname: "www.slack.com",
      },
      {
        protocol: "https",
        hostname: "www.discord.com",
      },
      {
        protocol: "https",
        hostname: "www.zoom.us",
      },
      {
        protocol: "https",
        hostname: "www.microsoft.com",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
      },
      {
        protocol: "https",
        hostname: "www.amazon.com",
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
      },
      {
        protocol: "https",
        hostname: "www.twitter.com",
      },
      {
        protocol: "https",
        hostname: "www.instagram.com",
      },
      {
        protocol: "https",
        hostname: "www.linkedin.com",
      },
      {
        protocol: "https",
        hostname: "www.pinterest.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "www.tiktok.com",
      },
      {
        protocol: "https",
        hostname: "www.reddit.com",
      },
      {
        protocol: "https",
        hostname: "www.twitch.tv",
      },
      {
        protocol: "https",
        hostname: "www.spotify.com",
      },
      {
        protocol: "https",
        hostname: "www.netflix.com",
      },
      {
        protocol: "https",
        hostname: "www.hulu.com",
      },
      {
        protocol: "https",
        hostname: "www.disneyplus.com",
      },
      {
        protocol: "https",
        hostname: "www.hbomax.com",
      },
      {
        protocol: "https",
        hostname: "www.primevideo.com",
      },
      {
        protocol: "https",
        hostname: "www.paramountplus.com",
      },
      {
        protocol: "https",
        hostname: "www.peacocktv.com",
      },
      {
        protocol: "https",
        hostname: "www.crunchyroll.com",
      },
      {
        protocol: "https",
        hostname: "www.funimation.com",
      },
      {
        protocol: "https",
        hostname: "www.vrv.co",
      },
      {
        protocol: "https",
        hostname: "www.marvel.com",
      },
      {
        protocol: "https",
        hostname: "www.dc.com",
      },
      {
        protocol: "https",
        hostname: "www.starwars.com",
      },
      {
        protocol: "https",
        hostname: "www.harrypotter.com",
      },
      {
        protocol: "https",
        hostname: "www.lordoftherings.com",
      },
      {
        protocol: "https",
        hostname: "www.gameofthrones.com",
      },
      {
        protocol: "https",
        hostname: "www.pokemon.com",
      },
      {
        protocol: "https",
        hostname: "www.nintendo.com",
      },
      {
        protocol: "https",
        hostname: "www.playstation.com",
      },
      {
        protocol: "https",
        hostname: "www.xbox.com",
      },
      {
        protocol: "https",
        hostname: "www.steam.com",
      },
      {
        protocol: "https",
        hostname: "www.epicgames.com",
      },
      {
        protocol: "https",
        hostname: "www.riotgames.com",
      },
      {
        protocol: "https",
        hostname: "www.blizzard.com",
      },
      {
        protocol: "https",
        hostname: "www.ea.com",
      },
      {
        protocol: "https",
        hostname: "www.ubisoft.com",
      },
      {
        protocol: "https",
        hostname: "www.activision.com",
      },
      {
        protocol: "https",
        hostname: "www.take2games.com",
      },
      {
        protocol: "https",
        hostname: "www.cdprojektred.com",
      },
      {
        protocol: "https",
        hostname: "www.rockstargames.com",
      },
      {
        protocol: "https",
        hostname: "www.square-enix.com",
      },
      {
        protocol: "https",
        hostname: "www.capcom.com",
      },
      {
        protocol: "https",
        hostname: "www.bandainamcoent.com",
      },
      {
        protocol: "https",
        hostname: "www.sega.com",
      },
      {
        protocol: "https",
        hostname: "www.konami.com",
      },
      {
        protocol: "https",
        hostname: "www.nexon.com",
      },
      {
        protocol: "https",
        hostname: "www.neteasegames.com",
      },
      {
        protocol: "https",
        hostname: "www.tencentgames.com",
      },
      {
        protocol: "https",
        hostname: "www.mihoyo.com",
      },
      {
        protocol: "https",
        hostname: "www.garena.com",
      },
      {
        protocol: "https",
        hostname: "www.supercell.com",
      },
      {
        protocol: "https",
        hostname: "www.rovio.com",
      },
      {
        protocol: "https",
        hostname: "www.king.com",
      },
      {
        protocol: "https",
        hostname: "www.zynga.com",
      },
      {
        protocol: "https",
        hostname: "www.roblox.com",
      },
      {
        protocol: "https",
        hostname: "www.minecraft.net",
      },
      {
        protocol: "https",
        hostname: "www.fortnite.com",
      },
      {
        protocol: "https",
        hostname: "www.leagueoflegends.com",
      },
      {
        protocol: "https",
        hostname: "www.valorant.com",
      },
      {
        protocol: "https",
        hostname: "www.csgo.com",
      },
      {
        protocol: "https",
        hostname: "www.dota2.com",
      },
      {
        protocol: "https",
        hostname: "www.overwatch.com",
      },
      {
        protocol: "https",
        hostname: "www.apexlegends.com",
      },
      {
        protocol: "https",
        hostname: "www.callofduty.com",
      },
      {
        protocol: "https",
        hostname: "www.fifa.com",
      },
      {
        protocol: "https",
        hostname: "www.nba2k.com",
      },
      {
        protocol: "https",
        hostname: "www.mlb.com",
      },
      {
        protocol: "https",
        hostname: "www.nhl.com",
      },
      {
        protocol: "https",
        hostname: "www.f1.com",
      },
      {
        protocol: "https",
        hostname: "www.nascar.com",
      },
      {
        protocol: "https",
        hostname: "www.ufc.com",
      },
      {
        protocol: "https",
        hostname: "www.wwe.com",
      },
      {
        protocol: "https",
        hostname: "www.nfl.com",
      },
      {
        protocol: "https",
        hostname: "www.nba.com",
      },
      {
        protocol: "https",
        hostname: "www.mlb.com",
      },
      {
        protocol: "https",
        hostname: "www.nhl.com",
      },
      {
        protocol: "https",
        hostname: "www.formula1.com",
      },
      {
        protocol: "https",
        hostname: "www.nascar.com",
      },
      {
        protocol: "https",
        hostname: "www.ufc.com",
      },
      {
        protocol: "https",
        hostname: "www.wwe.com",
      },
      {
        protocol: "https",
        hostname: "www.espn.com",
      },
      {
        protocol: "https",
        hostname: "www.cbssports.com",
      },
      {
        protocol: "https",
        hostname: "www.foxsports.com",
      },
      {
        protocol: "https",
        hostname: "www.nbcsports.com",
      },
      {
        protocol: "https",
        hostname: "www.bleacherreport.com",
      },
      {
        protocol: "https",
        hostname: "www.sbnation.com",
      },
      {
        protocol: "https",
        hostname: "www.theathletic.com",
      },
      {
        protocol: "https",
        hostname: "www.deadspin.com",
      },
      {
        protocol: "https",
        hostname: "www.barstoolsports.com",
      },
      {
        protocol: "https",
        hostname: "www.patreon.com",
      },
      {
        protocol: "https",
        hostname: "www.substack.com",
      },
      {
        protocol: "https",
        hostname: "www.medium.com",
      },
      {
        protocol: "https",
        hostname: "www.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "www.blogger.com",
      },
      {
        protocol: "https",
        hostname: "www.tumblr.com",
      },
      {
        protocol: "https",
        hostname: "www.weebly.com",
      },
      {
        protocol: "https",
        hostname: "www.squarespace.com",
      },
      {
        protocol: "https",
        hostname: "www.wix.com",
      },
      {
        protocol: "https",
        hostname: "www.shopify.com",
      },
      {
        protocol: "https",
        hostname: "www.etsy.com",
      },
      {
        protocol: "https",
        hostname: "www.ebay.com",
      },
      {
        protocol: "https",
        hostname: "www.alibaba.com",
      },
      {
        protocol: "https",
        hostname: "www.walmart.com",
      },
      {
        protocol: "https",
        hostname: "www.target.com",
      },
      {
        protocol: "https",
        hostname: "www.bestbuy.com",
      },
      {
        protocol: "https",
        hostname: "www.homedepot.com",
      },
      {
        protocol: "https",
        hostname: "www.lowes.com",
      },
      {
        protocol: "https",
        hostname: "www.costco.com",
      },
      {
        protocol: "https",
        hostname: "www.samsclub.com",
      },
      {
        protocol: "https",
        hostname: "www.kroger.com",
      },
      {
        protocol: "https",
        hostname: "www.albertsons.com",
      },
      {
        protocol: "https",
        hostname: "www.publix.com",
      },
      {
        protocol: "https",
        hostname: "www.wholefoodsmarket.com",
      },
      {
        protocol: "https",
        hostname: "www.traderjoes.com",
      },
      {
        protocol: "https",
        hostname: "www.aldi.us",
      },
      {
        protocol: "https",
        hostname: "www.lidl.com",
      },
      {
        protocol: "https",
        hostname: "www.ikea.com",
      },
      {
        protocol: "https",
        hostname: "www.wayfair.com",
      },
      {
        protocol: "https",
        hostname: "www.overstock.com",
      },
      {
        protocol: "https",
        hostname: "www.zillow.com",
      },
      {
        protocol: "https",
        hostname: "www.realtor.com",
      },
      {
        protocol: "https",
        hostname: "www.redfin.com",
      },
      {
        protocol: "https",
        hostname: "www.carvana.com",
      },
      {
        protocol: "https",
        hostname: "www.carmax.com",
      },
      {
        protocol: "https",
        hostname: "www.autotrader.com",
      },
      {
        protocol: "https",
        hostname: "www.cars.com",
      },
      {
        protocol: "https",
        hostname: "www.edmunds.com",
      },
      {
        protocol: "https",
        hostname: "www.kbb.com",
      },
      {
        protocol: "https",
        hostname: "www.truecar.com",
      },
      {
        protocol: "https",
        hostname: "www.groupon.com",
      },
      {
        protocol: "https",
        hostname: "www.living.social",
      },
      {
        protocol: "https",
        hostname: "www.fiverr.com",
      },
      {
        protocol: "https",
        hostname: "www.upwork.com",
      },
      {
        protocol: "https",
        hostname: "www.freelancer.com",
      },
      {
        protocol: "https",
        hostname: "www.guru.com",
      },
      {
        protocol: "https",
        hostname: "www.peopleperhour.com",
      },
      {
        protocol: "https",
        hostname: "www.toptal.com",
      },
      {
        protocol: "https",
        hostname: "www.flexjobs.com",
      },
      {
        protocol: "https",
        hostname: "www.remote.co",
      },
      {
        protocol: "https",
        hostname: "www.weworkremotely.com",
      },
      {
        protocol: "https",
        hostname: "www.remotive.io",
      },
      {
        protocol: "https",
        hostname: "www.jobspresso.co",
      },
      {
        protocol: "https",
        hostname: "www.angel.co",
      },
      {
        protocol: "https",
        hostname: "www.crunchbase.com",
      },
      {
        protocol: "https",
        hostname: "www.techcrunch.com",
      },
      {
        protocol: "https",
        hostname: "www.theverge.com",
      },
      {
        protocol: "https",
        hostname: "www.wired.com",
      },
      {
        protocol: "https",
        hostname: "www.engadget.com",
      },
      {
        protocol: "https",
        hostname: "www.gizmodo.com",
      },
      {
        protocol: "https",
        hostname: "www.mashable.com",
      },
      {
        protocol: "https",
        hostname: "www.cnet.com",
      },
      {
        protocol: "https",
        hostname: "www.zdnet.com",
      },
      {
        protocol: "https",
        hostname: "www.techradar.com",
      },
      {
        protocol: "https",
        hostname: "www.tomsguide.com",
      },
      {
        protocol: "https",
        hostname: "www.digitaltrends.com",
      },
      {
        protocol: "https",
        hostname: "www.pcgamer.com",
      },
      {
        protocol: "https",
        hostname: "www.ign.com",
      },
      {
        protocol: "https",
        hostname: "www.gamespot.com",
      },
      {
        protocol: "https",
        hostname: "www.metacritic.com",
      },
      {
        protocol: "https",
        hostname: "www.rottentomatoes.com",
      },
      {
        protocol: "https",
        hostname: "www.imdb.com",
      },
      {
        protocol: "https",
        hostname: "www.boxofficemojo.com",
      },
      {
        protocol: "https",
        hostname: "www.the-numbers.com",
      },
      {
        protocol: "https",
        hostname: "www.goodreads.com",
      },
      {
        protocol: "https",
        hostname: "www.barnesandnoble.com",
      },
      {
        protocol: "https",
        hostname: "www.booksamillion.com",
      },
      {
        protocol: "https",
        hostname: "www.indiebound.org",
      },
      {
        protocol: "https",
        hostname: "www.powells.com",
      },
      {
        protocol: "https",
        hostname: "www.strandbooks.com",
      },
      {
        protocol: "https",
        hostname: "www.halfpricebooks.com",
      },
      {
        protocol: "https",
        hostname: "www.thriftbooks.com",
      },
      {
        protocol: "https",
        hostname: "www.betterworldbooks.com",
      },
      {
        protocol: "https",
        hostname: "www.abebooks.com",
      },
      {
        protocol: "https",
        hostname: "www.bookdepository.com",
      },
      {
        protocol: "https",
        hostname: "www.wordery.com",
      },
      {
        protocol: "https",
        hostname: "www.blackwell.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.waterstones.com",
      },
      {
        protocol: "https",
        hostname: "www.foyles.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.dauntbooks.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.citylights.com",
      },
      {
        protocol: "https",
        hostname: "www.thelastbookstore.com",
      },
      {
        protocol: "https",
        hostname: "www.elliottbaybook.com",
      },
      {
        protocol: "https",
        hostname: "www.politics-prose.com",
      },
      {
        protocol: "https",
        hostname: "www.mcnallyjackson.com",
      },
      {
        protocol: "https",
        hostname: "www.housingworksbookstore.com",
      },
      {
        protocol: "https",
        hostname: "www.greenlightbookstore.com",
      },
      {
        protocol: "https",
        hostname: "www.booksaremagic.net",
      },
      {
        protocol: "https",
        hostname: "www.brooklynbookstore.com",
      },
      {
        protocol: "https",
        hostname: "www.bookculture.com",
      },
      {
        protocol: "https",
        hostname: "www.threelives.com",
      },
      {
        protocol: "https",
        hostname: "www.shakespeareandco.com",
      },
      {
        protocol: "https",
        hostname: "www.theamericanlibraryinparis.org",
      },
      {
        protocol: "https",
        hostname: "www.bertrand.pt",
      },
      {
        protocol: "https",
        hostname: "www.livrarialello.pt",
      },
      {
        protocol: "https",
        hostname: "www.atlantisbooks.org",
      },
      {
        protocol: "https",
        hostname: "www.shakespeareandcompany.com",
      },
    ],
  },
}

module.exports = nextConfig
