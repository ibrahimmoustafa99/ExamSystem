export interface ResultWithStudentDTO {
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}