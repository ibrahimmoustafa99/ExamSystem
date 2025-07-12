public class AnswerDTO
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string SelectedAnswer { get; set; } = null!;
    public int StudentId { get; set; }
}
