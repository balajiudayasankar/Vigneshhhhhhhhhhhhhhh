using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternalKnowledgeBase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IContributorService _contributorService;
        private readonly IArticleService _articleService;
        private readonly ICategoryService _categoryService;
        private readonly ITagService _tagService;

        public AdminController(
            IUserService userService,
            IContributorService contributorService,
            IArticleService articleService,
            ICategoryService categoryService,
            ITagService tagService)
        {
            _userService = userService;
            _contributorService = contributorService;
            _articleService = articleService;
            _categoryService = categoryService;
            _tagService = tagService;
        }

        // User Management
        [HttpGet("users")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<UserDto>>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }

        [HttpPost("users")]
        public async Task<ActionResult<GenericResponseDto<UserDto>>> CreateUser(CreateUserDto createUserDto)
        {
            var result = await _userService.CreateUserAsync(createUserDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return CreatedAtAction("GetUserById", "User", new { id = result.Data?.Id }, result);
        }

        [HttpPut("users/{userId}")]
        public async Task<ActionResult<GenericResponseDto<UserDto>>> UpdateUser(int userId, UpdateUserDto updateUserDto)
        {
            var result = await _userService.UpdateUserAsync(userId, updateUserDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpDelete("users/{userId}")]
        public async Task<ActionResult<GenericResponseDto>> DeleteUser(int userId)
        {
            var result = await _userService.DeleteUserAsync(userId);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        // Contributor Management
        [HttpGet("contributors/pending")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ContributorDto>>>> GetPendingContributors()
        {
            var result = await _contributorService.GetPendingApprovalsAsync();
            return Ok(result);
        }

        [HttpGet("contributors/approved")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ContributorDto>>>> GetApprovedContributors()
        {
            var result = await _contributorService.GetApprovedContributorsAsync();
            return Ok(result);
        }

        [HttpPost("contributors/{contributorId}/approve")]
        public async Task<ActionResult<GenericResponseDto<ContributorDto>>> ApproveContributor(int contributorId, ApproveContributorDto approveDto)
        {
            var adminUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _contributorService.ApproveContributorAsync(contributorId, adminUserId, approveDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        // Article Management
        [HttpGet("articles")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetAllArticles()
        {
            var result = await _articleService.GetPublishedArticlesAsync();
            return Ok(result);
        }

        [HttpGet("articles/pending")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetPendingArticles()
        {
            var result = await _articleService.GetArticlesByStatusAsync((int)ArticleStatus.Submitted);
            return Ok(result);
        }

        [HttpGet("articles/status/{status}")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetArticlesByStatus(int status)
        {
            var result = await _articleService.GetArticlesByStatusAsync(status);
            return Ok(result);
        }

        [HttpPost("articles/{articleId}/review")]
        public async Task<ActionResult<GenericResponseDto<ArticleDto>>> ReviewArticle(int articleId, ReviewArticleDto reviewDto)
        {
            var adminUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _articleService.ReviewArticleAsync(articleId, adminUserId, reviewDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        // Category Management
        [HttpGet("categories")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<CategoryDto>>>> GetAllCategories()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            return Ok(result);
        }

        [HttpPost("categories")]
        public async Task<ActionResult<GenericResponseDto<CategoryDto>>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var result = await _categoryService.CreateCategoryAsync(createCategoryDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return CreatedAtAction("GetCategoryById", "Category", new { id = result.Data?.Id }, result);
        }

        [HttpPut("categories/{categoryId}")]
        public async Task<ActionResult<GenericResponseDto<CategoryDto>>> UpdateCategory(int categoryId, UpdateCategoryDto updateCategoryDto)
        {
            var result = await _categoryService.UpdateCategoryAsync(categoryId, updateCategoryDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpDelete("categories/{categoryId}")]
        public async Task<ActionResult<GenericResponseDto>> DeleteCategory(int categoryId)
        {
            var result = await _categoryService.DeleteCategoryAsync(categoryId);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        // Tag Management
        [HttpGet("tags")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<TagDto>>>> GetAllTags()
        {
            var result = await _tagService.GetAllTagsAsync();
            return Ok(result);
        }

        [HttpPost("tags")]
        public async Task<ActionResult<GenericResponseDto<TagDto>>> CreateTag(CreateTagDto createTagDto)
        {
            var result = await _tagService.CreateTagAsync(createTagDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return CreatedAtAction("GetTagById", "Tag", new { id = result.Data?.Id }, result);
        }

        [HttpPut("tags/{tagId}")]
        public async Task<ActionResult<GenericResponseDto<TagDto>>> UpdateTag(int tagId, UpdateTagDto updateTagDto)
        {
            var result = await _tagService.UpdateTagAsync(tagId, updateTagDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpDelete("tags/{tagId}")]
        public async Task<ActionResult<GenericResponseDto>> DeleteTag(int tagId)
        {
            var result = await _tagService.DeleteTagAsync(tagId);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        // System Management
        [HttpGet("system/health")]
        public ActionResult<GenericResponseDto<object>> GetSystemHealth()
        {
            var health = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
            };

            return Ok(new GenericResponseDto<object>
            {
                Success = true,
                Message = "System health check completed",
                Data = health
            });
        }
    }
}
