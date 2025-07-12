public class Answer
{
    public int Id { get; set; }
    public string SelectedAnswer { get; set; } = null!;

    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
}
