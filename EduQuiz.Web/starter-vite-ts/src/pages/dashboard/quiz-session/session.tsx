import { Helmet } from 'react-helmet-async';

import { QuizSessionView } from "src/sections/quiz-session/view";

// ----------------------------------------------------------------------

const metadata = { title: 'New practice session' };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuizSessionView />
    </>
  );
}
