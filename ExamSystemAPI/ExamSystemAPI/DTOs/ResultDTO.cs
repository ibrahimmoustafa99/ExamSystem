namespace ExamSystemAPI.DTOs
{
    public class ResultDTO
    {
        public int ExamId { get; set; }
        public string ExamTitle { get; set; } = null!;
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; }
    }
}
