# 📱 Publishing Glancer AI to the App Store & Google Play

A complete, **absolute-beginner** walkthrough. No prior mobile-development
experience needed. Follow the steps in order. Plan for **~half a day** the first
time (most of it is account setup and waiting for store review).

Glancer AI is a website wrapped into a real native app using **Capacitor**
(already installed in this project). Capacitor puts your existing site inside a
tiny native iOS and Android app so the stores accept it.

---

## 0. What you'll need (one-time setup)

| For | What | Cost |
|-----|------|------|
| **Both stores** | A computer, this project, [Node.js](https://nodejs.org) installed | Free |
| **iOS (App Store)** | A **Mac**, [Xcode](https://apps.apple.com/app/xcode/id497799835) (free, from the Mac App Store), an **Apple Developer account** | **$99 / year** |
| **Android (Play)** | [Android Studio](https://developer.android.com/studio) (free, Mac/Windows/Linux), a **Google Play Developer account** | **$25 one-time** |

> 💡 You can publish to **Android from any computer**. You can **only** build the
> iOS app on a **Mac** — that is Apple's rule, not ours.

Create the developer accounts now (they can take a day to verify):
- Apple: <https://developer.apple.com/programs/enroll/>
- Google: <https://play.google.com/console/signup>

---

## 1. Build the website and create the native projects

Run these in the project folder (`glancer-ai`) **once**:

```bash
# 1. Build the optimized website into /dist
npm run build

# 2. Create the native iOS and Android projects (adds /ios and /android folders)
npx cap add ios
npx cap add android

# 3. Copy the built website into both native projects
npx cap sync
```

That's it — you now have a real `ios/` and `android/` app project.

> 🔁 **Every time you change the website later**, re-run:
> ```bash
> npm run build && npx cap sync
> ```

---

## 2. Add the app icon & splash screen (both platforms)

The project already has a master icon at `public/icon-1024.png`. Capacitor can
generate every required icon and splash size for you:

```bash
# Install the asset generator (one time)
npm install -D @capacitor/assets

# Point it at the icon and generate everything
npx @capacitor/assets generate --iconBackgroundColor '#000814' \
  --splashBackgroundColor '#000814' --assetPath public/icon-1024.png
```

This fills in all the iOS and Android icon/splash files automatically. Re-run
`npx cap sync` afterward.

---

## 3. Publish to **Google Play** (easier — start here)

### 3a. Open the project in Android Studio
```bash
npx cap open android
```
Wait for it to finish "Gradle sync" (progress bar at the bottom — first time can
take several minutes).

### 3b. Create your signing key (your app's permanent signature)
In Android Studio: **Build ▸ Generate Signed App Bundle / APK ▸ Android App Bundle ▸ Next ▸ Create new…**

- Pick a path like `glancer-release.keystore`
- Set a password and an alias — **write these down and back them up forever.**
  If you lose this key you can never update the app again.

### 3c. Build the release bundle
Continue the wizard, choose the **release** build variant, and finish. Android
Studio produces an **`.aab`** file (it shows a popup with a link to it, usually
`android/app/release/app-release.aab`).

### 3d. Upload to the Play Console
1. Go to <https://play.google.com/console> ▸ **Create app**.
2. Fill in app name (**Glancer AI**), language, "App", "Free".
3. In the left menu work through **"Set up your app"**:
   - **Store listing**: short + full description, the icon (`public/icon-512.png`),
     a feature graphic (1024×500), and **at least 2 phone screenshots**.
   - **Privacy policy**: a public URL is **required** (e.g. `https://glancerai.com/privacy`).
   - **Content rating**, **Target audience**, **Data safety** form, **Ads**
     (say "Yes" if AdSense/ads are shown).
4. Go to **Production ▸ Create new release**, upload your **`.aab`**, add release
   notes, and **Review → Start rollout to Production**.

⏳ Google review usually takes **a few hours to a few days**. You'll get an email.

---

## 4. Publish to the **App Store** (Mac only)

### 4a. Open the project in Xcode
```bash
npx cap open ios
```

### 4b. Set the signing team
1. In Xcode's left sidebar click the blue **App** project at the top.
2. Select the **App** target ▸ **Signing & Capabilities** tab.
3. Tick **"Automatically manage signing"** and pick your **Team** (your Apple
   Developer account). Xcode handles certificates for you.
4. Confirm the **Bundle Identifier** is `com.glancerai.app` (must be unique on
   the App Store — change it if Apple says it's taken).

### 4c. Create the app record
1. Go to <https://appstoreconnect.apple.com> ▸ **My Apps ▸ ➕ ▸ New App**.
2. Platform iOS, name **Glancer AI**, your bundle id, and a unique **SKU**
   (any text, e.g. `glancerai001`).

### 4d. Upload the build from Xcode
1. At the top of Xcode set the device target to **"Any iOS Device (arm64)"**
   (not a simulator).
2. Menu **Product ▸ Archive**. When it finishes, the **Organizer** window opens.
3. Click **Distribute App ▸ App Store Connect ▸ Upload**. Follow the prompts.

### 4e. Submit for review
Back in App Store Connect, open your app and fill in:
- **Screenshots** (required: 6.7" iPhone — use the iPhone simulator + ⌘S, or a real device),
- **Description, keywords, support URL, privacy policy URL**,
- **App Privacy** questionnaire (declare data collection — and AdSense/ads if used),
- Under **Build**, select the build you just uploaded (it may take ~15 min to appear),
- Click **Add for Review ▸ Submit**.

⏳ Apple review typically takes **1–3 days**. You'll get an email with the result.

> 🧪 **Tip:** Use **TestFlight** (a tab in App Store Connect) to install the app
> on your own phone and test it before the public release.

---

## 5. Shipping updates later

Whenever you improve the site:

```bash
npm run build && npx cap sync
```

Then **bump the version number** and rebuild/upload:
- **Android**: in `android/app/build.gradle` increase `versionCode` (a whole
  number, e.g. 1 → 2) and `versionName` ("1.0.1"). Rebuild the `.aab`, upload a
  new Production release.
- **iOS**: in Xcode ▸ target ▸ **General**, bump **Version** (1.0.1) and **Build**
  (2). Archive and upload again, then submit.

---

## 6. Common first-timer gotchas

- **"I don't have a Mac"** → you can still ship the Android app today; do iOS
  later on any Mac (or a Mac-in-the-cloud service like MacinCloud).
- **Privacy policy is mandatory** on both stores. A simple page on
  `glancerai.com/privacy` is enough.
- **Lost your Android keystore?** You can't update the app. Back it up in two
  places the moment you create it.
- **Apple rejects "thin" apps** that are just a website. Glancer AI is content-
  rich (news, tools, metrics, blogs) which helps — emphasize the interactive
  tools and offline-friendly reading in your description.
- **Screenshots** are the #1 thing beginners forget. Take them early.

---

### Quick command reference

```bash
npm run build                 # build the website
npx cap add ios|android       # create native project (first time only)
npx cap sync                  # copy latest build into native projects
npx cap open ios|android      # open in Xcode / Android Studio
npx @capacitor/assets generate --assetPath public/icon-1024.png  # icons + splash
```

You've got this. 🚀
