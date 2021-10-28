# Disasternaut!

Hey everyone, we just wrapped up our submission for Kajam, and we were thinking, it's crazy how much of our programming journey has been fueled by Replit. I remember so vividly, almost 3 years ago, when we submitted our first game to the original Game Jam. Followed by the Music Jam, and then getting to win Code Jam #9 last year when quarantine started. It's unreal how those three years passed so quickly, and in them, we both learned to much, and still have so much to learn. This is our fourth Replit Jam to date, and we really just want to say a really big thank you to everyone, on both the Replit team and community, for making these events happen, and providing these opportunities to push our limits, constantly learning more throughout them.

## Check it out!

A fast-paced and light-hearted survival game developed by @LehuyH and @raghavm, with original art from @LucasFraeyman
External attributions for assets we used can be found in CREDITS.md ❤️

**Game Link:** https://disasternaut.lehuyh.repl.co
**Github:** https://github.com/LehuyH/disasternaut

## Story rundown:

**HUGE (Humans United on Galactic Exploration) Incorporated**, a space colonization conglomerate is accepting applications for colonists! You are very intrigued by this offer, and decide to take it up. **Disasternaut**, the game, follows your journey surviving and expanding your planet into a resource farm for **HUGE**. You'll encounter countless hurdles, but never fear! For *HUGENet*, the top-notch space exploration artificial intelligence system, is on your side, one step ahead of any pesky disasters that might get in your way. Oh, and don't forget about your personal *HUGELog*! Get the latest on **HUGE** news and survival tips straight from the source!

Go on! Become the intergalactic colonist you always dreamed you'd be! Make your family proud! [https://disasternaut.lehuyh.repl.co](https://disasternaut.lehuyh.repl.co/)    

## Tech stack:

The 2D game itself was built with Replit's own Kaboom.js. We integrated the engine with Vue 3 to allow for easy data management. All the onboarding and HUD elements are DOM-based, separate from the game engine. This simplified the process of writing a smooth-looking interface UI as we got to use CSS and the powers it grants us. 

Building a web-based game simplified a lot of things for us. Firstly, cross-platform was easy as cake (we do not speak of Internet Explorer in these parts). Secondly, integrating both the DOM and Kaboom's engine model with Vue 3's magic reactivity sauce made updating state and reflecting changes super simple for us as well. Lastly, the LocalStorage API and Kaboom's helpers for it made persistent game state over reloads and new windows take about 3 extra lines of code (Kaboom literally has helpers for everything, so nice). [Code here.](https://github.com/LehuyH/disasternaut)
