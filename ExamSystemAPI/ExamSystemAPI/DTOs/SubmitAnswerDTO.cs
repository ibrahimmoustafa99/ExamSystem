namespace ExamSystemAPI.DTOs
{
    public class SubmitAnswerDTO
    {
        public int QuestionId { get; set; }
        public string SelectedAnswer { get; set; } = null!;
    }
}
