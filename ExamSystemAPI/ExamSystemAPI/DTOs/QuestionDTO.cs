public class QuestionDTO
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public string ChoiceA { get; set; } = null!;
    public string ChoiceB { get; set; } = null!;
    public string ChoiceC { get; set; } = null!;
    public string ChoiceD { get; set; } = null!;
    public string CorrectAnswer { get; set; } = null!;
}
