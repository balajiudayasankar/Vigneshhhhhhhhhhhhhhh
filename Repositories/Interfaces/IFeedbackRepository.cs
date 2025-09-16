using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface IFeedbackRepository : IGenericRepository<Feedback>
    {
        Task<IEnumerable<Feedback>> GetFeedbackByArticleAsync(int articleId);
        Task<IEnumerable<Feedback>> GetFeedbackByUserAsync(int userId);
        Task<double> GetAverageRatingAsync(int articleId);
        Task<bool> UserHasRatedArticleAsync(int userId, int articleId);
    }
}