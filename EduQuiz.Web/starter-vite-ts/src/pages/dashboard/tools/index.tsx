import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ToolsView } from "../../../sections/tools/view";



// ----------------------------------------------------------------------

const metadata = { title: `Tools | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ToolsView />
    </>
  );
}
