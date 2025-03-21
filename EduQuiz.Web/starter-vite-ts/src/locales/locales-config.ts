// ----------------------------------------------------------------------

export const fallbackLng = 'ro';
export const languages = ['ro', 'en', 'ru'];
export const defaultNS = 'all';

export type LanguageValue = (typeof languages)[number];

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  ro: {
    success: 'Limba a fost schimbată!',
    error: 'Eroare la schimbarea limbii!',
    loading: 'Se încarcă...',
  },
  ru: {
    success: 'Язык был изменен!',
    error: 'Ошибка при изменении языка!',
    loading: 'загрузка...',
  },
};
