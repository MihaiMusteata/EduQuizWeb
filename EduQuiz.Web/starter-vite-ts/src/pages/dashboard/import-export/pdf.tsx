import type { Quiz } from "src/types/quiz";

import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { LoadingScreen } from "src/components/loading-screen";

import { ExportPDFView } from "src/sections/import-export/view/export-pdf-view";

// ----------------------------------------------------------------------

const metadata = { title: `Export PDF | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { getAuth } = useAxios();

  const [data, setData] = useState<Quiz | undefined>(undefined);

  useEffect(() => {
    getAuth(endpoints.quiz.get(id)).then((response) => {
      setData(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {
        data === undefined ? <LoadingScreen /> :
          <ExportPDFView quiz={data} />
      }
    </>
  );
}
