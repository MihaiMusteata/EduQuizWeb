import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { ImportExportView } from "src/sections/import-export/view";

// ----------------------------------------------------------------------

const metadata = { title: `Import/Export | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ImportExportView/>
    </>
  );
}
