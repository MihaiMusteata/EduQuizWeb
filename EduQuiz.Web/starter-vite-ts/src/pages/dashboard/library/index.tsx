import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { LibraryView } from "src/sections/library/view";

// ----------------------------------------------------------------------

const metadata = { title: `My Library | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LibraryView />
    </>
  );
}
