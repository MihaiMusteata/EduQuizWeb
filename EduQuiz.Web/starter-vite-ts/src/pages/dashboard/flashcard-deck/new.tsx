import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { FlashcardDeckCreateView } from "src/sections/flashcard-deck/view";


// ----------------------------------------------------------------------

const metadata = { title: `Create a new flashcard deck | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FlashcardDeckCreateView />
    </>
  );
}
