import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  hubUrl: string;
  assetsDir: string;
  auth: {
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'EduQuiz',
  appVersion: '1.0',
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  hubUrl: import.meta.env.VITE_HUB_URL ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  auth: {
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};
