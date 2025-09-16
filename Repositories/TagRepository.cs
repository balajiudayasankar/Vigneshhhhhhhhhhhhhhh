using InternalKnowledgeBase.Api.Data;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternalKnowledgeBase.Api.Repositories
{
    public class TagRepository : GenericRepository<Tag>, ITagRepository
    {
        public TagRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Tag>> GetTagsByArticleAsync(int articleId)
        {
            return await _context.Tags
                .Where(t => t.Articles.Any(a => a.Id == articleId) && !t.IsDeleted)
                .ToListAsync();
        }

        public async Task<Tag?> GetTagByNameAsync(string name)
        {
            return await _context.Tags
                .FirstOrDefaultAsync(t => t.Name == name && !t.IsDeleted);
        }

        public async Task<IEnumerable<Tag>> GetPopularTagsAsync(int count)
        {
            return await _context.Tags
                .Where(t => !t.IsDeleted)
                .OrderByDescending(t => t.Articles.Count)
                .Take(count)
                .ToListAsync();
        }
    }
}