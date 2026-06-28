/*
 * nativeApp — one-time bootstrap that gives the app a real iOS / Android feel.
 *
 *  - Tags <html data-platform="ios|android|web"> so CSS can opt into
 *    platform-specific styling (safe-area insets, native fonts, ripples).
 *  - Inside the Capacitor shells it themes the native status bar to match the
 *    space-black UI, hides the splash once React has painted, and makes the
 *    Android hardware back button behave (go back, or minimise at the root).
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

  // Theme the native status bar + dismiss the splash once we're interactive.
  (async () => {
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({ style: Style.Dark });
      if (platform === 'android') {
        await StatusBar.setBackgroundColor({ color: '#000814' });
      }
    } catch { /* plugin unavailable — ignore */ }

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
