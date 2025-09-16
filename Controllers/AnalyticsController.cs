using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternalKnowledgeBase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IContributorService _contributorService;
        private readonly IArticleService _articleService;
        private readonly ICategoryService _categoryService;
        private readonly ITagService _tagService;
        private readonly IFeedbackService _feedbackService;

        public AnalyticsController(
            IUserService userService,
            IContributorService contributorService,
            IArticleService articleService,
            ICategoryService categoryService,
            ITagService tagService,
            IFeedbackService feedbackService)
        {
            _userService = userService;
            _contributorService = contributorService;
            _articleService = articleService;
            _categoryService = categoryService;
            _tagService = tagService;
            _feedbackService = feedbackService;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<object>>> GetDashboardAnalytics()
        {
            try
            {
                var usersResult = await _userService.GetAllUsersAsync();
                var contributorsResult = await _contributorService.GetApprovedContributorsAsync();
                var pendingContributorsResult = await _contributorService.GetPendingApprovalsAsync();
                var publishedArticlesResult = await _articleService.GetPublishedArticlesAsync();
                var pendingArticlesResult = await _articleService.GetArticlesByStatusAsync(2); // Submitted status
                var categoriesResult = await _categoryService.GetActiveCategoriesAsync();

                var analytics = new
                {
                    TotalUsers = usersResult.Data?.Count() ?? 0,
                    TotalContributors = contributorsResult.Data?.Count() ?? 0,
                    PendingContributorApprovals = pendingContributorsResult.Data?.Count() ?? 0,
                    TotalPublishedArticles = publishedArticlesResult.Data?.Count() ?? 0,
                    PendingArticleApprovals = pendingArticlesResult.Data?.Count() ?? 0,
                    TotalCategories = categoriesResult.Data?.Count() ?? 0,
                    RecentUsers = usersResult.Data?.OrderByDescending(u => u.CreatedDate).Take(5) ?? new List<UserDto>(),
                    RecentArticles = publishedArticlesResult.Data?.OrderByDescending(a => a.CreatedDate).Take(5) ?? new List<ArticleDto>(),
                    MostViewedArticles = (await _articleService.GetMostViewedArticlesAsync(5)).Data ?? new List<ArticleDto>(),
                    PopularCategories = categoriesResult.Data?.OrderByDescending(c => c.ArticleCount).Take(5) ?? new List<CategoryDto>()
                };

                return Ok(new GenericResponseDto<object>
                {
                    Success = true,
                    Message = "Dashboard analytics retrieved successfully",
                    Data = analytics
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponseDto<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving dashboard analytics",
                    Errors = { ex.Message }
                });
            }
        }

        [HttpGet("articles/most-viewed")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetMostViewedArticles([FromQuery] int count = 10)
        {
            var result = await _articleService.GetMostViewedArticlesAsync(count);
            return Ok(result);
        }

        [HttpGet("articles/recent")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetRecentArticles([FromQuery] int count = 10)
        {
            var result = await _articleService.GetRecentArticlesAsync(count);
            return Ok(result);
        }

        [HttpGet("tags/popular")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<TagDto>>>> GetPopularTags([FromQuery] int count = 10)
        {
            var result = await _tagService.GetPopularTagsAsync(count);
            return Ok(result);
        }

        [HttpGet("articles/{articleId}/rating")]
        public async Task<ActionResult<GenericResponseDto<double>>> GetArticleAverageRating(int articleId)
        {
            var result = await _feedbackService.GetAverageRatingAsync(articleId);
            return Ok(result);
        }

        [HttpGet("contributor-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<object>>> GetContributorStats()
        {
            try
            {
                var contributorsResult = await _contributorService.GetApprovedContributorsAsync();
                var contributors = contributorsResult.Data ?? new List<ContributorDto>();

                var stats = new
                {
                    TotalContributors = contributors.Count(),
                    ActiveContributors = contributors.Count(c => c.IsApproved),
                    RecentContributors = contributors.OrderByDescending(c => c.ApprovedDate).Take(5),
                    ContributorsByMonth = contributors
                        .Where(c => c.ApprovedDate.HasValue)
                        .GroupBy(c => new { c.ApprovedDate.Value.Year, c.ApprovedDate.Value.Month })
                        .Select(g => new { Month = $"{g.Key.Year}-{g.Key.Month:D2}", Count = g.Count() })
                        .OrderBy(x => x.Month)
                        .ToList()
                };

                return Ok(new GenericResponseDto<object>
                {
                    Success = true,
                    Message = "Contributor statistics retrieved successfully",
                    Data = stats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponseDto<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving contributor statistics",
                    Errors = { ex.Message }
                });
            }
        }

        [HttpGet("article-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<object>>> GetArticleStats()
        {
            try
            {
                var publishedArticlesResult = await _articleService.GetPublishedArticlesAsync();
                var articles = publishedArticlesResult.Data ?? new List<ArticleDto>();

                var stats = new
                {
                    TotalArticles = articles.Count(),
                    TotalViews = articles.Sum(a => a.ViewCount),
                    AverageViewsPerArticle = articles.Any() ? articles.Average(a => a.ViewCount) : 0,
                    ArticlesByCategory = articles
                        .GroupBy(a => a.CategoryName)
                        .Select(g => new { Category = g.Key, Count = g.Count() })
                        .OrderByDescending(x => x.Count)
                        .ToList(),
                    ArticlesByMonth = articles
                        .Where(a => a.PublishedDate.HasValue)
                        .GroupBy(a => new { a.PublishedDate.Value.Year, a.PublishedDate.Value.Month })
                        .Select(g => new { Month = $"{g.Key.Year}-{g.Key.Month:D2}", Count = g.Count() })
                        .OrderBy(x => x.Month)
                        .ToList()
                };

                return Ok(new GenericResponseDto<object>
                {
                    Success = true,
                    Message = "Article statistics retrieved successfully",
                    Data = stats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GenericResponseDto<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving article statistics",
                    Errors = { ex.Message }
                });
            }
        }
    }
}
