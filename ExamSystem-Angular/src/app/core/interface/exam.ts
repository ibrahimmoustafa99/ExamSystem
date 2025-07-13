export interface Question {
  id: number;
  text: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: string;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  createdBy: number;
  createdByName: string;
  questions: Question[];
}
