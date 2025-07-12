public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public string ChoiceA { get; set; } = null!;
    public string ChoiceB { get; set; } = null!;
    public string ChoiceC { get; set; } = null!;
    public string ChoiceD { get; set; } = null!;
    public string CorrectAnswer { get; set; } = null!;
    public bool IsDeleted { get; set; } = false;

    public int ExamId { get; set; }
    public Exam Exam { get; set; } = null!;

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
