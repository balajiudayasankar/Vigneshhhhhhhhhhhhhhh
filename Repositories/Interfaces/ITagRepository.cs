using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface ITagRepository : IGenericRepository<Tag>
    {
        Task<IEnumerable<Tag>> GetTagsByArticleAsync(int articleId);
        Task<Tag?> GetTagByNameAsync(string name);
        Task<IEnumerable<Tag>> GetPopularTagsAsync(int count);
    }
}