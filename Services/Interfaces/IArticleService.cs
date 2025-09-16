using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface IArticleService
    {
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetPublishedArticlesAsync();
        Task<GenericResponseDto<ArticleDto>> GetArticleByIdAsync(int articleId);
        Task<GenericResponseDto<ArticleDto>> CreateArticleAsync(int contributorId, CreateArticleDto createArticleDto);
        Task<GenericResponseDto<ArticleDto>> UpdateArticleAsync(int articleId, int contributorId, UpdateArticleDto updateArticleDto);
        Task<GenericResponseDto> DeleteArticleAsync(int articleId, int contributorId);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByContributorAsync(int contributorId);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByCategoryAsync(int categoryId);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByStatusAsync(int status);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetMostViewedArticlesAsync(int count);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetRecentArticlesAsync(int count);
        Task<GenericResponseDto<IEnumerable<ArticleDto>>> SearchArticlesAsync(string searchTerm);
        Task<GenericResponseDto<ArticleDto>> ReviewArticleAsync(int articleId, int reviewerId, ReviewArticleDto reviewDto);
        Task<GenericResponseDto> IncrementViewCountAsync(int articleId);
    }
}