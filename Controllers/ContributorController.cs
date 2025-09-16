using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternalKnowledgeBase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContributorController : ControllerBase
    {
        private readonly IContributorService _contributorService;
        private readonly IArticleService _articleService;

        public ContributorController(IContributorService contributorService, IArticleService articleService)
        {
            _contributorService = contributorService;
            _articleService = articleService;
        }

        [HttpPost("request")]
        public async Task<ActionResult<GenericResponseDto<ContributorDto>>> RequestContributorAccess(ContributorRequestDto requestDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _contributorService.RequestContributorAccessAsync(userId, requestDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpPost("{contributorId}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<ContributorDto>>> ApproveContributor(int contributorId, ApproveContributorDto approveDto)
        {
            var approvedByUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _contributorService.ApproveContributorAsync(contributorId, approvedByUserId, approveDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ContributorDto>>>> GetPendingApprovals()
        {
            var result = await _contributorService.GetPendingApprovalsAsync();
            return Ok(result);
        }

        [HttpGet("approved")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ContributorDto>>>> GetApprovedContributors()
        {
            var result = await _contributorService.GetApprovedContributorsAsync();
            return Ok(result);
        }

        [HttpGet("{contributorId}")]
        public async Task<ActionResult<GenericResponseDto<ContributorDto>>> GetContributorById(int contributorId)
        {
            var result = await _contributorService.GetContributorByIdAsync(contributorId);
            
            if (!result.Success)
                return NotFound(result);
            
            return Ok(result);
        }

        [HttpGet("me")]
        public async Task<ActionResult<GenericResponseDto<ContributorDto>>> GetMyContributorProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _contributorService.GetContributorByUserIdAsync(userId);
            
            if (!result.Success)
                return NotFound(result);
            
            return Ok(result);
        }

        [HttpGet("me/articles")]
        public async Task<ActionResult<GenericResponseDto<IEnumerable<ArticleDto>>>> GetMyArticles()
        {
            var contributorId = int.Parse(User.FindFirstValue("ContributorId") ?? "0");
            if (contributorId == 0)
            {
                return BadRequest(new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "You are not an approved contributor"
                });
            }

            var result = await _articleService.GetArticlesByContributorAsync(contributorId);
            return Ok(result);
        }

        [HttpPost("articles")]
        public async Task<ActionResult<GenericResponseDto<ArticleDto>>> CreateArticle(CreateArticleDto createArticleDto)
        {
            var contributorId = int.Parse(User.FindFirstValue("ContributorId") ?? "0");
            if (contributorId == 0)
            {
                return BadRequest(new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "You are not an approved contributor"
                });
            }

            var result = await _articleService.CreateArticleAsync(contributorId, createArticleDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return CreatedAtAction("GetArticleById", "Article", new { id = result.Data?.Id }, result);
        }

        [HttpPut("articles/{articleId}")]
        public async Task<ActionResult<GenericResponseDto<ArticleDto>>> UpdateArticle(int articleId, UpdateArticleDto updateArticleDto)
        {
            var contributorId = int.Parse(User.FindFirstValue("ContributorId") ?? "0");
            if (contributorId == 0)
            {
                return BadRequest(new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "You are not an approved contributor"
                });
            }

            var result = await _articleService.UpdateArticleAsync(articleId, contributorId, updateArticleDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpDelete("articles/{articleId}")]
        public async Task<ActionResult<GenericResponseDto>> DeleteArticle(int articleId)
        {
            var contributorId = int.Parse(User.FindFirstValue("ContributorId") ?? "0");
            if (contributorId == 0)
            {
                return BadRequest(new GenericResponseDto
                {
                    Success = false,
                    Message = "You are not an approved contributor"
                });
            }

            var result = await _articleService.DeleteArticleAsync(articleId, contributorId);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }
    }
}
