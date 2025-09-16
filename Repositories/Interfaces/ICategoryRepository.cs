using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<IEnumerable<Category>> GetActiveCategoriesAsync();
        Task<bool> CategoryHasArticlesAsync(int categoryId);
        Task<Category?> GetCategoryByNameAsync(string name);
    }
}