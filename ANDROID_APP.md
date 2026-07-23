# Glancer AI — Android app

The Android app is the same React codebase wrapped in [Capacitor 8](https://capacitorjs.com/),
not a separate project. One build, one set of content, one place to fix bugs.

Capacitor was already installed and configured before this doc existed. What was
missing was the generated `android/` native project and an app-shaped navigation
layer. This covers both.

## Prerequisites

You need these on your machine. None of them are in the repo.

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS or newer | Vite 8 needs 20.19+ |
| JDK | 21 | Android Gradle Plugin 8.x wants 17+; 21 is the safe pick |
| Android Studio | Ladybug or newer | Brings the SDK, platform tools and an emulator |
| Android SDK | Platform 35 | Install via Android Studio's SDK Manager |

Set `JAVA_HOME` and `ANDROID_HOME` before running anything, or Gradle will fail
with an error that does not mention either variable.

## First-time setup

Run these once, from the repo root:

```bash
npm install
```

```bash
npm run build
```

```bash
npm run android:add
```

That last command generates the `android/` directory. It reads `webDir: "dist"`
from `capacitor.config.json`, which is why the build has to happen first. The
generated project is committed like any other source: it holds the manifest,
icons and Gradle config, and regenerating it from scratch would throw those away.

## Everyday workflow

After any change to the web app:

```bash
npm run android:open
```

That builds the site, copies `dist/` into the native project, syncs the plugins,
and opens Android Studio. Press Run there.

To skip Android Studio and push straight to a connected device or a running
emulator:

```bash
npm run android:run
```

If you only want the copy step without launching anything:

```bash
npm run android:sync
```

## What makes it feel like an app rather than a bookmark

**Bottom tab bar.** `src/components/NativeTabBar.jsx` renders five thumb-reachable
tabs: Home, News, Topics, Saved, You. It returns `null` unless
`Capacitor.isNativePlatform()` is true, so the website is completely unaffected
and crawlers see the DOM they always saw.

The tab list is deliberately not the website's `NAV_LINKS`. Events, Glossary,
AI Tools and the legal pages stay in the masthead hamburger as overflow, which is
the standard split: tabs for the things people open daily, a menu for everything
else. Saved has no `/saved` route because there is no such page on the web, so
that tab opens the existing `ReadLaterPanel` drawer and carries a live badge
driven by the `glancer:read-later-changed` event.

The bar hides itself on full-screen surfaces (the `/news/:id` reader, the blog
editor, admin) where it would sit on top of content instead of helping. The regex
that matches the reader is written to not swallow `/news/topic/:slug`, which is a
feed page and keeps its tabs.

**Status bar that tracks the theme.** `syncNativeTheme()` in `src/lib/nativeApp.js`
is called from `App.jsx` on every theme change, so switching to dark inside the
app repaints the system bar too. Previously the status bar was hardcoded dark at
startup and never updated.

Note that Capacitor's `Style` is named for the *content*, not the background:
`Style.Light` means dark text for a light background. It reads backwards.

**Splash and status bar match the light default.** `capacitor.config.json` used to
hardcode `#000814` everywhere, which after the switch to a light default theme
meant the app would flash a dark splash, then load a light UI under a dark status
bar. All four colour values now use `#F6F6F6`, the light theme's `--bg-deep`.

**Already in place before this work:** safe-area insets for notches and the
gesture bar, suppressed tap highlights and long-press callouts, disabled
overscroll bounce, Material-style press feedback on Android, and hardware
back-button handling that walks history then minimises at the root rather than
dead-ending on a blank screen.

## Known gaps

**AdSense will violate policy in the app.** `index.html` loads
`adsbygoogle.js`, and Google's program policies prohibit AdSense inside a webview
app. Shipping to Play with it intact risks the AdSense account, not just the app
listing. Serving ads in the app means AdMob and a native plugin. The safer
interim fix is to gate the AdSense loader on `Capacitor.isNativePlatform()` so it
never runs natively. This has not been done.

**Icons and splash art are not generated.** `public/icon-1024.png` exists and can
seed them, but `android/` will ship with the default Capacitor robot until you run
`@capacitor/assets`. That package is not currently a dependency.

**No signing config.** Play Store uploads need a keystore and a release signing
block in `android/app/build.gradle`. Debug builds run fine without it.

**No deep links.** Tapping a glancerai.com link opens the browser, not the app.
Fixing that needs an `intent-filter` plus a hosted `assetlinks.json`.

**Offline behaviour is untested.** The shell loads from the bundle, but the news
feed calls the network with no cached fallback beyond `STATIC_NEWS`, and the
Supabase-backed user blogs will simply fail.

## Verification status

Everything above is unverified. The environment this was written in has no Node,
JDK, Gradle, Android SDK or adb, so the code was never built, the `android/`
project was never generated, and nothing was run on a device or emulator. Treat
the first `npm run android:open` as the real test.
