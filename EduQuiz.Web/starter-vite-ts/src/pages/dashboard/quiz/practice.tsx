import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { QuizPracticeView } from "src/sections/quiz/view";

// ----------------------------------------------------------------------

const metadata = { title: `Practice quiz | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuizPracticeView />
    </>
  );
}
