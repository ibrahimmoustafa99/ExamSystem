namespace ExamSystemAPI.DTOs
{
    public class SubmitExamDTO
    {
        public int ExamId { get; set; }

        public int StudentId { get; set; }
        public List<SubmitAnswerDTO> Answers { get; set; } = new();
    }
}
