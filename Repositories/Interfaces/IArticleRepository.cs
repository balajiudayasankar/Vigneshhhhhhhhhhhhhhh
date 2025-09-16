using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface IArticleRepository : IGenericRepository<Article>
    {
        Task<IEnumerable<Article>> GetPublishedArticlesAsync();
        Task<IEnumerable<Article>> GetArticlesByContributorAsync(int contributorId);
        Task<IEnumerable<Article>> GetArticlesByCategoryAsync(int categoryId);
        Task<IEnumerable<Article>> GetArticlesByStatusAsync(ArticleStatus status);
        Task<IEnumerable<Article>> GetMostViewedArticlesAsync(int count);
        Task<IEnumerable<Article>> GetRecentArticlesAsync(int count);
        Task<IEnumerable<Article>> SearchArticlesAsync(string searchTerm);
        Task<Article?> GetArticleWithDetailsAsync(int articleId);
        Task IncrementViewCountAsync(int articleId);
    }
}