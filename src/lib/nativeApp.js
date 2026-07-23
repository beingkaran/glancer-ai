/*
 * nativeApp — one-time bootstrap that gives the app a real iOS / Android feel.
 *
 *  - Tags <html data-platform="ios|android|web"> so CSS can opt into
 *    platform-specific styling (safe-area insets, native fonts, ripples).
 *  - Inside the Capacitor shells it hides the splash once React has painted and
 *    makes the Android hardware back button behave (go back, or minimise at the
 *    root). Status-bar theming lives in syncNativeTheme below, because it has to
 *    re-run whenever the user toggles light/dark rather than once at startup.
 *
 * Everything is guarded so the same call is a near no-op on the plain web build
 * (Capacitor.getPlatform() === 'web'), keeping the website dependency-light.
 */
import { Capacitor } from '@capacitor/core';

export function initNativeApp() {
  const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
  const root = document.documentElement;
  root.setAttribute('data-platform', platform);

  if (!Capacitor.isNativePlatform()) return; // plain web — nothing else to do

  root.classList.add('is-native');

  // Dismiss the splash once we're interactive. The status bar is themed
  // separately by syncNativeTheme, which App calls whenever the theme changes.
  (async () => {
    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide();
    } catch { /* ignore */ }
  })();

  // Android hardware back: navigate back through history, or minimise the app
  // when there's nowhere left to go (instead of dead-ending on a blank screen).
  (async () => {
    try {
      const { App } = await import('@capacitor/app');
      App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack && window.history.length > 1) window.history.back();
        else App.exitApp();
      });
    } catch { /* ignore */ }
  })();
}

/*
 * Keep the native status bar in step with the in-app theme. Called by App on
 * every theme change, so toggling to dark inside the app repaints the system
 * bar too instead of leaving a light strip above a dark page.
 *
 * Capacitor's Style is named for the CONTENT, not the background:
 *   Style.Light = dark text, for a light background
 *   Style.Dark  = light text, for a dark background
 * which reads backwards the first time and is worth the comment.
 */
export async function syncNativeTheme(theme) {
  if (!Capacitor.isNativePlatform()) return;
  const dark = theme === 'dark';
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: dark ? '#000814' : '#F6F6F6' });
    }
  } catch { /* plugin unavailable — ignore */ }
}
