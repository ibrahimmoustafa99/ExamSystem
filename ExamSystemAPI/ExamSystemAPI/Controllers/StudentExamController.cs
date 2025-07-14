using ExamSystemAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Student")]
    public class StudentExamController : ControllerBase
    {
        private readonly ExamSystemContext _context;
        public StudentExamController(ExamSystemContext context)
        {
            _context = context;
        }
        // View All Exams (without correct answers)
        [HttpGet("exams")]
        public async Task<ActionResult<IEnumerable<ExamDTO>>> GetAvailableExams()
        {
            var exams = await _context.Exams
                .Include(e => e.Questions)
                .ToListAsync();

            var result = exams.Select(e => new ExamDTO
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Questions = e.Questions.Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    Text = q.Text,
                    ChoiceA = q.ChoiceA,
                    ChoiceB = q.ChoiceB,
                    ChoiceC = q.ChoiceC,
                    ChoiceD = q.ChoiceD,
                    CorrectAnswer = "" //  don’t expose correct answer
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        //  View Specific Exam (Take Exam)
        [HttpGet("exams/{id}")]
        public async Task<ActionResult<ExamDTO>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound();

            var dto = new ExamDTO
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                Questions = exam.Questions.Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    Text = q.Text,
                    ChoiceA = q.ChoiceA,
                    ChoiceB = q.ChoiceB,
                    ChoiceC = q.ChoiceC,
                    ChoiceD = q.ChoiceD,
                    CorrectAnswer = "" //  don’t expose correct answer
                }).ToList()
            };

            return Ok(dto);
        }

        //  Submit Exam Answers
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitExam([FromBody] SubmitExamDTO dto)
        {
            var studentId = dto.StudentId; 

            foreach (var answerDto in dto.Answers)
            {
                var answer = new Answer
                {
                    QuestionId = answerDto.QuestionId,
                    SelectedAnswer = answerDto.SelectedAnswer,
                    StudentId = studentId
                };

                _context.Answers.Add(answer);
            }

            await _context.SaveChangesAsync();
            return Ok("Answers submitted successfully.");
        }

        [HttpGet("result/{examId}")]
        public async Task<ActionResult<ResultDTO>> GetResult(int examId, [FromQuery] int studentId)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == examId);

            if (exam == null)
                return NotFound("Exam not found.");

            var studentAnswers = await _context.Answers
                .Where(a => a.StudentId == studentId && exam.Questions.Select(q => q.Id).Contains(a.QuestionId))
                .ToListAsync();

            int correct = studentAnswers.Count(a =>
            {
                var question = exam.Questions.FirstOrDefault(q => q.Id == a.QuestionId);
                return question != null && question.CorrectAnswer == a.SelectedAnswer;
            });

            int total = exam.Questions.Count;
            double score = total > 0 ? (double)correct / total * 100 : 0;

            var result = new ResultDTO
            {
                ExamId = exam.Id,
                ExamTitle = exam.Title,
                TotalQuestions = total,
                CorrectAnswers = correct,
                Score = Math.Round(score, 2)
            };

            return Ok(result);
        }

        [HttpGet("results/all")]
        public async Task<ActionResult<IEnumerable<ResultWithStudentDTO>>> GetAllStudentResults()
        {
            var exams = await _context.Exams
                .Include(e => e.Questions)
                .ToListAsync();

            var allAnswers = await _context.Answers
                .Include(a => a.Student) // assuming Answer has navigation property: Student (User)
                .ToListAsync();

            var groupedByStudentExam = allAnswers
                .GroupBy(a => new { a.StudentId, a.Student.Name, a.Question.ExamId }) // adjust name if needed
                .ToList();

            var resultList = new List<ResultWithStudentDTO>();

            foreach (var group in groupedByStudentExam)
            {
                var exam = exams.FirstOrDefault(e => e.Id == group.Key.ExamId);
                if (exam == null) continue;

                int total = exam.Questions.Count;
                int correct = group.Count(a =>
                {
                    var question = exam.Questions.FirstOrDefault(q => q.Id == a.QuestionId);
                    return question != null && question.CorrectAnswer == a.SelectedAnswer;
                });

                resultList.Add(new ResultWithStudentDTO
                {
                    ExamId = exam.Id,
                    ExamTitle = exam.Title,
                    StudentId = group.Key.StudentId,
                    StudentName = group.Key.Name,
                    TotalQuestions = total,
                    CorrectAnswers = correct,
                    Score = total > 0 ? Math.Round((double)correct / total * 100, 2) : 0
                });
            }

            return Ok(resultList);
        }
    }
}
