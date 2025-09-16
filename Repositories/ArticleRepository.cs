using InternalKnowledgeBase.Api.Data;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternalKnowledgeBase.Api.Repositories
{
    public class ArticleRepository : GenericRepository<Article>, IArticleRepository
    {
        public ArticleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Article>> GetPublishedArticlesAsync()
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.Status == ArticleStatus.Published && !a.IsDeleted)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByContributorAsync(int contributorId)
        {
            return await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.ContributorId == contributorId && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByCategoryAsync(int categoryId)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.CategoryId == categoryId && a.Status == ArticleStatus.Published && !a.IsDeleted)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByStatusAsync(ArticleStatus status)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.Status == status && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetMostViewedArticlesAsync(int count)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.Status == ArticleStatus.Published && !a.IsDeleted)
                .OrderByDescending(a => a.ViewCount)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetRecentArticlesAsync(int count)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.Status == ArticleStatus.Published && !a.IsDeleted)
                .OrderByDescending(a => a.PublishedDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string searchTerm)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Where(a => a.Status == ArticleStatus.Published && !a.IsDeleted &&
                           (a.Title.Contains(searchTerm) || a.Content.Contains(searchTerm) || a.Summary.Contains(searchTerm)))
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync();
        }

        public async Task<Article?> GetArticleWithDetailsAsync(int articleId)
        {
            return await _context.Articles
                .Include(a => a.Contributor).ThenInclude(c => c.User)
                .Include(a => a.Category)
                .Include(a => a.Tags)
                .Include(a => a.Documents)
                .Include(a => a.Feedbacks).ThenInclude(f => f.User)
                .FirstOrDefaultAsync(a => a.Id == articleId && !a.IsDeleted);
        }

        public async Task IncrementViewCountAsync(int articleId)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article != null && !article.IsDeleted)
            {
                article.ViewCount++;
                article.UpdatedDate = DateTime.UtcNow;
                _context.Articles.Update(article);
                await _context.SaveChangesAsync();
            }
        }
    }
}