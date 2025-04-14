import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { themeConfig, ThemeProvider } from 'src/theme';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from './auth/context/jwt';
import { AxiosProvider } from './axios/axios-provider';
import { SignalRProvider } from './signalR/signalR-provider';
import { I18nProvider, LocalizationProvider } from "./locales";

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <I18nProvider>
      <AxiosProvider>
        <AuthProvider>
          <SignalRProvider>
            <SettingsProvider defaultSettings={defaultSettings}>
              <LocalizationProvider>
                <ThemeProvider
                  noSsr
                  defaultMode={themeConfig.defaultMode}
                  modeStorageKey={themeConfig.modeStorageKey}
                >
                  <MotionLazy>
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer defaultSettings={defaultSettings} />
                    {children}
                  </MotionLazy>
                </ThemeProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </SignalRProvider>
        </AuthProvider>
      </AxiosProvider>
    </I18nProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
