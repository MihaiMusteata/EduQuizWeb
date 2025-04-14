import type { QuizSession } from "src/types/quiz";

import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

import { useParams } from "src/routes/hooks";

import { endpoints } from "src/axios/endpoints";
import { useAxios, usePromise } from "src/axios/hooks";

import { LoadingScreen } from "src/components/loading-screen";

import { QuizSessionHostView } from "src/sections/quiz-session/view";

// ----------------------------------------------------------------------

const metadata = { title: 'New practice session' };

export default function Page() {
  const { id = '' } = useParams();
  const { getAuth } = useAxios();

  const { execute: getSession, isLoading: isGetting, data: session } = usePromise<QuizSession>(() =>
    getAuth(endpoints.quizSession.get(id))
  );

  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {
        isGetting || session === undefined ? <LoadingScreen /> :
          <QuizSessionHostView quizSession={session} />
      }
    </>
  );
}
