import type { Quiz, Question } from 'src/types/quiz';

import { Font , Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { CONFIG } from 'src/global-config';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: `${CONFIG.assetsDir}/fonts/Roboto-Regular.ttf`,
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    {
      src: `${CONFIG.assetsDir}/fonts/Roboto-Italic.ttf`,
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: `${CONFIG.assetsDir}/fonts/Roboto-Bold.ttf`,
      fontWeight: 'bold',
      fontStyle: 'normal',
    }
  ],
});

Font.register({
  family: 'DejaVu',
  fonts: [
    {
      src: `${CONFIG.assetsDir}/fonts/DejaVuSans.ttf`,
      fontWeight: 'normal',
      fontStyle: 'normal',
    }
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  section: {
    marginBottom: 12,
  },
  question: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  answer: { marginLeft: 10, marginBottom: 2 },
  checkbox: { marginRight: 4 },
  line: {
    borderBottom: '1px solid black',
    width: '80%',
    height: 10,
    marginTop: 4,
  },
  hint: { fontStyle: 'italic', marginTop: 2, marginLeft: 10 },
});

type Props = {
  quiz: Quiz;
};

const renderQuestionByType = (q: Question) => {
  switch (q.type) {
    case 'true-false':
      return (
        <>
          <Text style={styles.answer}>
            <Text style={{ fontFamily: 'DejaVu' }}>{'☐ '}</Text>
            <Text style={{ fontFamily: 'Roboto' }}>True</Text>
          </Text>
          <Text style={styles.answer}>
            <Text style={{ fontFamily: 'DejaVu' }}>{'☐ '}</Text>
            <Text style={{ fontFamily: 'Roboto' }}>False</Text>
          </Text>
        </>
      );

    case 'multiple-choice':
      return q.answers.map((a, i) => (
        <Text key={i} style={styles.answer}>
          <Text style={{ fontFamily: 'DejaVu' }}>{'☐ '}</Text>
          <Text style={{ fontFamily: 'Roboto' }}>{a.text}</Text>
        </Text>
      ));

    case 'single-choice':
      return q.answers.map((a, i) => (
        <Text key={i} style={styles.answer}>
          <Text style={{ fontFamily: 'DejaVu' }}>{'○ '}</Text>
          <Text style={{ fontFamily: 'Roboto' }}>{a.text}</Text>
        </Text>

      ));

    case 'short-answer':
      return (
        <View style={{ marginLeft: 10 }}>
          <View style={styles.line} />
        </View>
      );

    default:
      return <Text style={styles.answer}>Unsupported question type</Text>;
  }
};

export function QuizPdfDocument({ quiz }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 18, marginBottom: 12, textAlign: 'center' }}>
          {quiz.title}
        </Text>

        {quiz.questions.map((q, index) => (
          <View key={index} style={styles.section} wrap={false}>
            <Text style={styles.question}>
              {index + 1}. {q.text}
            </Text>
            {renderQuestionByType(q)}
            {
              q.hint?.trim() !== '' && (
                <Text style={styles.hint}>Hint: {q.hint}</Text>
              )
            }
          </View>
        ))}
      </Page>
    </Document>
  );
}

