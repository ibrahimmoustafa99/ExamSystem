using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
    

namespace ExamSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ExamSystemContext _context;

        public ExamController(ExamSystemContext context)
        {
            _context = context;
        }

        // GET: api/Exam
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamDTO>>> GetExams()
        {
            var exams = await _context.Exams
                .Include(e => e.CreatedByAdmin)
                .Include(e => e.Questions)
                .ToListAsync();

            var result = exams.Select(e => new ExamDTO
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                CreatedByAdminId = e.CreatedByAdminId,
                CreatedByName = e.CreatedByAdmin?.Name,
                Questions = e.Questions
                    .Where(q => !q.IsDeleted)
                    .Select(q => new QuestionDTO
                    {
                        Id = q.Id,
                        Text = q.Text,
                        ChoiceA = q.ChoiceA,
                        ChoiceB = q.ChoiceB,
                        ChoiceC = q.ChoiceC,
                        ChoiceD = q.ChoiceD,
                        CorrectAnswer = q.CorrectAnswer
                    }).ToList()
            }).ToList();

            return Ok(result);
        }

        // GET: api/Exam/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDTO>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.CreatedByAdmin)
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound();

            var dto = new ExamDTO
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                CreatedByAdminId = exam.CreatedByAdminId,
                CreatedByName = exam.CreatedByAdmin?.Name,
                Questions = exam.Questions
                    .Where(q => !q.IsDeleted)
                    .Select(q => new QuestionDTO
                    {
                        Id = q.Id,
                        Text = q.Text,
                        ChoiceA = q.ChoiceA,
                        ChoiceB = q.ChoiceB,
                        ChoiceC = q.ChoiceC,
                        ChoiceD = q.ChoiceD,
                        CorrectAnswer = q.CorrectAnswer
                    }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/Exam   
        [HttpPost]
        public async Task<ActionResult<ExamDTO>> CreateExam(ExamDTO dto)
        {
            // 🔍 Ensure Admin exists
            var admin = await _context.Admins.FindAsync(dto.CreatedByAdminId);
            if (admin == null)
            {
                return BadRequest($"Admin with ID {dto.CreatedByAdminId} does not exist.");
            }

            // ✅ Create exam with questions
            var exam = new Exam
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedByAdminId = dto.CreatedByAdminId,
                Questions = dto.Questions.Select(q => new Question
                {
                    Text = q.Text,
                    ChoiceA = q.ChoiceA,
                    ChoiceB = q.ChoiceB,
                    ChoiceC = q.ChoiceC,
                    ChoiceD = q.ChoiceD,
                    CorrectAnswer = q.CorrectAnswer,
                    IsDeleted = false
                }).ToList()
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            // Return created exam info
            dto.Id = exam.Id;
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, dto);
        }


        // PUT: api/Exam/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateExam(int id, ExamDTO dto)
        {
            if (id != dto.Id)
                return BadRequest("Mismatched exam ID.");

            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound();

            // Update fields
            exam.Title = dto.Title;
            exam.Description = dto.Description;

            // ✅ Only update CreatedByAdminId if valid
            if (dto.CreatedByAdminId > 0)
                exam.CreatedByAdminId = dto.CreatedByAdminId;

            // ✅ Soft-delete existing questions
            foreach (var q in exam.Questions)
                q.IsDeleted = true;

            // ✅ Add new questions
            foreach (var qDto in dto.Questions)
            {
                exam.Questions.Add(new Question
                {
                    Text = qDto.Text,
                    ChoiceA = qDto.ChoiceA,
                    ChoiceB = qDto.ChoiceB,
                    ChoiceC = qDto.ChoiceC,
                    ChoiceD = qDto.ChoiceD,
                    CorrectAnswer = qDto.CorrectAnswer,
                    IsDeleted = false
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // DELETE: api/Exam/5
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound();

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
