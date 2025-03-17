import type { Quiz } from 'src/types/quiz';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";

import { useParams } from "src/routes/hooks";

import { CONFIG } from 'src/global-config';
import { useAxios } from 'src/axios/hooks';

import { QuizEditView } from 'src/sections/quiz/view';


// ----------------------------------------------------------------------

const metadata = { title: `Quiz edit | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  const { id = '' } = useParams();
  const { getAuth, isLoading } = useAxios();

  const [data, setData] = useState<Quiz | undefined>(undefined);

  useEffect(() => {
    getAuth(`/quiz/${id}`).then((response) => {
      setData(response);
    });
  }, [id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {
        isLoading ? <div>Loading...</div> :
          <QuizEditView quiz={data} />
      }
    </>
  );
}
