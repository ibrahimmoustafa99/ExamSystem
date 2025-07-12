using Microsoft.EntityFrameworkCore;

public class ExamSystemContext : DbContext
{
    public ExamSystemContext(DbContextOptions<ExamSystemContext> options)
        : base(options)
    {
    }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ✅ Global filter to hide soft-deleted questions from all queries
        modelBuilder.Entity<Question>()
            .HasQueryFilter(q => !q.IsDeleted);

        // ✅ Relationships & delete behaviors

        // When Exam is deleted, delete its Questions (we soft-delete Questions in controller anyway)
        modelBuilder.Entity<Question>()
            .HasOne(q => q.Exam)
            .WithMany(e => e.Questions)
            .HasForeignKey(q => q.ExamId)
            .OnDelete(DeleteBehavior.Cascade);

        // Prevent deleting Question if it has Answers (foreign key constraint)
        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // When Student is deleted, delete their answers
        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Student)
            .WithMany(s => s.Answers)
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}
