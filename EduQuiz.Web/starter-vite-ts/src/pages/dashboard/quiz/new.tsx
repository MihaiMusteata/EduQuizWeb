import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { QuizCreateView } from 'src/sections/quiz/view';


// ----------------------------------------------------------------------

const metadata = { title: `Create a new quiz | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuizCreateView />
    </>
  );
}
