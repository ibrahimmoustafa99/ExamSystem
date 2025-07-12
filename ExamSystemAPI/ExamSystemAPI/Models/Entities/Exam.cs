
public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CreatedByAdminId { get; set; }
    public Admin CreatedByAdmin { get; set; } = null!;

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
