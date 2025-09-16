using InternalKnowledgeBase.Api.Data;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternalKnowledgeBase.Api.Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Feedback>> GetFeedbackByArticleAsync(int articleId)
        {
            return await _context.Feedbacks
                .Include(f => f.User)
                .Where(f => f.ArticleId == articleId && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetFeedbackByUserAsync(int userId)
        {
            return await _context.Feedbacks
                .Include(f => f.Article)
                .Where(f => f.UserId == userId && !f.IsDeleted)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingAsync(int articleId)
        {
            var ratings = await _context.Feedbacks
                .Where(f => f.ArticleId == articleId && !f.IsDeleted && f.Rating > 0)
                .Select(f => f.Rating)
                .ToListAsync();

            return ratings.Any() ? ratings.Average() : 0;
        }

        public async Task<bool> UserHasRatedArticleAsync(int userId, int articleId)
        {
            return await _context.Feedbacks
                .AnyAsync(f => f.UserId == userId && f.ArticleId == articleId && !f.IsDeleted);
        }
    }
}