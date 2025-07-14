namespace ExamSystemAPI.DTOs
{
    public class ResultWithStudentDTO
    {
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; }
    }
}
