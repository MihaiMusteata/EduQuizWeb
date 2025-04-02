import type { FlashcardDeck } from 'src/types/flashcard';

import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

import { useParams } from "src/routes/hooks";

import { CONFIG } from 'src/global-config';
import { endpoints } from 'src/axios/endpoints';
import { useAxios, usePromise } from 'src/axios/hooks';

import { LoadingScreen } from "src/components/loading-screen";

import { FlashcardDeckEditView } from 'src/sections/flashcard-deck/view';


// ----------------------------------------------------------------------

const metadata = { title: `Flashcard deck edit | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  const { id = '' } = useParams();
  const { getAuth } = useAxios();

  const {
    execute: getFlashcardDeck,
    data,
    isLoading
  } = usePromise<FlashcardDeck>(() => getAuth<FlashcardDeck>(endpoints.flashcardDeck.get(id)));

  useEffect(() => {
    if (data === undefined) {
      getFlashcardDeck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
