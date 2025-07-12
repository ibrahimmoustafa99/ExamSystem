public class ExamDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CreatedByAdminId { get; set; }
    public string? CreatedByName { get; set; }

    public List<QuestionDTO> Questions { get; set; } = new();
}
