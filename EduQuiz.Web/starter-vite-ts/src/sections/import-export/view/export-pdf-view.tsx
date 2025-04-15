import type { Quiz } from 'src/types/quiz';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Typography from "@mui/material/Typography";

import { QuizPdfDocument } from 'src/components/pdf/quiz-pdf-document';

type Props = {
  quiz: Quiz;
};

export function ExportPDFView({ quiz }: Props) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px'
        }}>

        <Typography variant="h4">
          PDF Preview
        </Typography>
        <PDFDownloadLink
          document={<QuizPdfDocument quiz={quiz} />}
          fileName={`${quiz.title}.pdf`}
          style={{
            padding: '10px 16px',
            background: 'blue',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
      <div style={{ height: '90vh', border: '1px solid #ccc' }}>
        <PDFViewer width="100%" height="100%">
          <QuizPdfDocument quiz={quiz} />
        </PDFViewer>
      </div>
    </>
  );
};


