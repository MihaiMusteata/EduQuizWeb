import type { FlashcardDeck } from 'src/types/flashcard';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";

import { useParams } from "src/routes/hooks";

import { CONFIG } from 'src/global-config';
import { useAxios } from 'src/axios/hooks';
import { endpoints } from 'src/axios/endpoints';

import { LoadingScreen } from "src/components/loading-screen";

import { FlashcardDeckEditView } from 'src/sections/flashcard-deck/view';



// ----------------------------------------------------------------------

const metadata = { title: `Flashcard deck edit | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  const { id = '' } = useParams();
  const { getAuth, isLoading } = useAxios();

  const [data, setData] = useState<FlashcardDeck | undefined>(undefined);

  useEffect(() => {
    getAuth(endpoints.flashcardDeck.get(id)).then((response) => {
      setData(response);
    });
  }, [id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {
        isLoading ? <LoadingScreen /> :
          <FlashcardDeckEditView flashcardDeck={data} />
      }
    </>
  );
}
