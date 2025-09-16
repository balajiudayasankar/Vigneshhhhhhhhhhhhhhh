using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Helpers;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly EmailNotificationService _emailService;

        public ArticleService(IUnitOfWork unitOfWork, IMapper mapper, EmailNotificationService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetPublishedArticlesAsync()
        {
            try
            {
                var articles = await _unitOfWork.Articles.GetPublishedArticlesAsync();
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Published articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ArticleDto>> GetArticleByIdAsync(int articleId)
        {
            try
            {
                var article = await _unitOfWork.Articles.GetArticleWithDetailsAsync(articleId);
                if (article == null)
                {
                    return new GenericResponseDto<ArticleDto>
                    {
                        Success = false,
                        Message = "Article not found"
                    };
                }

                var articleDto = _mapper.Map<ArticleDto>(article);
                return new GenericResponseDto<ArticleDto>
                {
                    Success = true,
                    Message = "Article retrieved successfully",
                    Data = articleDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the article",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ArticleDto>> CreateArticleAsync(int contributorId, CreateArticleDto createArticleDto)
        {
            try
            {
                var article = _mapper.Map<Article>(createArticleDto);
                article.ContributorId = contributorId;
                article.Status = ArticleStatus.Draft;

                await _unitOfWork.Articles.AddAsync(article);

                // Add tags if specified
                if (createArticleDto.TagIds.Any())
                {
                    var tags = new List<Tag>();
                    foreach (var tagId in createArticleDto.TagIds)
                    {
                        var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                        if (tag != null) tags.Add(tag);
                    }
                    article.Tags = tags;
                }

                await _unitOfWork.SaveAsync();

                var articleDto = _mapper.Map<ArticleDto>(article);
                return new GenericResponseDto<ArticleDto>
                {
                    Success = true,
                    Message = "Article created successfully",
                    Data = articleDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the article",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ArticleDto>> UpdateArticleAsync(int articleId, int contributorId, UpdateArticleDto updateArticleDto)
        {
            try
            {
                var article = await _unitOfWork.Articles.GetByIdAsync(articleId);
                if (article == null)
                {
                    return new GenericResponseDto<ArticleDto>
                    {
                        Success = false,
                        Message = "Article not found"
                    };
                }

                if (article.ContributorId != contributorId)
                {
                    return new GenericResponseDto<ArticleDto>
                    {
                        Success = false,
                        Message = "You are not authorized to update this article"
                    };
                }

                _mapper.Map(updateArticleDto, article);
                await _unitOfWork.Articles.UpdateAsync(article);
                await _unitOfWork.SaveAsync();

                var articleDto = _mapper.Map<ArticleDto>(article);
                return new GenericResponseDto<ArticleDto>
                {
                    Success = true,
                    Message = "Article updated successfully",
                    Data = articleDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "An error occurred while updating the article",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> DeleteArticleAsync(int articleId, int contributorId)
        {
            try
            {
                var article = await _unitOfWork.Articles.GetByIdAsync(articleId);
                if (article == null)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "Article not found"
                    };
                }

                if (article.ContributorId != contributorId)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "You are not authorized to delete this article"
                    };
                }

                await _unitOfWork.Articles.DeleteAsync(articleId);
                await _unitOfWork.SaveAsync();

                return new GenericResponseDto
                {
                    Success = true,
                    Message = "Article deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the article",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByContributorAsync(int contributorId)
        {
            try
            {
                var articles = await _unitOfWork.Articles.GetArticlesByContributorAsync(contributorId);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByCategoryAsync(int categoryId)
        {
            try
            {
                var articles = await _unitOfWork.Articles.GetArticlesByCategoryAsync(categoryId);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetArticlesByStatusAsync(int status)
        {
            try
            {
                var articleStatus = (ArticleStatus)status;
                var articles = await _unitOfWork.Articles.GetArticlesByStatusAsync(articleStatus);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetMostViewedArticlesAsync(int count)
        {
            try
            {
                var articles = await _unitOfWork.Articles.GetMostViewedArticlesAsync(count);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Most viewed articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> GetRecentArticlesAsync(int count)
        {
            try
            {
                var articles = await _unitOfWork.Articles.GetRecentArticlesAsync(count);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Recent articles retrieved successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving articles",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ArticleDto>>> SearchArticlesAsync(string searchTerm)
        {
            try
            {
                var articles = await _unitOfWork.Articles.SearchArticlesAsync(searchTerm);
                var articleDtos = _mapper.Map<IEnumerable<ArticleDto>>(articles);

                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = true,
                    Message = "Search completed successfully",
                    Data = articleDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ArticleDto>>
                {
                    Success = false,
                    Message = "An error occurred during search",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ArticleDto>> ReviewArticleAsync(int articleId, int reviewerId, ReviewArticleDto reviewDto)
        {
            try
            {
                var article = await _unitOfWork.Articles.GetArticleWithDetailsAsync(articleId);
                if (article == null)
                {
                    return new GenericResponseDto<ArticleDto>
                    {
                        Success = false,
                        Message = "Article not found"
                    };
                }

                article.Status = reviewDto.Status;
                article.ReviewNotes = reviewDto.ReviewNotes;
                article.ReviewedByUserId = reviewerId;

                if (reviewDto.Status == ArticleStatus.Published)
                {
                    article.PublishedDate = DateTime.UtcNow;
                }

                await _unitOfWork.Articles.UpdateAsync(article);
                await _unitOfWork.SaveAsync();

                // Send notification email
                var contributor = await _unitOfWork.Contributors.GetContributorWithUserAsync(article.ContributorId);
                if (contributor?.User != null)
                {
                    await _emailService.SendArticleStatusEmailAsync(
                        contributor.User.Email,
                        $"{contributor.User.FirstName} {contributor.User.LastName}",
                        article.Title,
                        reviewDto.Status.ToString(),
                        reviewDto.ReviewNotes
                    );
                }

                var articleDto = _mapper.Map<ArticleDto>(article);
                return new GenericResponseDto<ArticleDto>
                {
                    Success = true,
                    Message = "Article reviewed successfully",
                    Data = articleDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ArticleDto>
                {
                    Success = false,
                    Message = "An error occurred while reviewing the article",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> IncrementViewCountAsync(int articleId)
        {
            try
            {
                await _unitOfWork.Articles.IncrementViewCountAsync(articleId);
                return new GenericResponseDto
                {
                    Success = true,
                    Message = "View count incremented"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while incrementing view count",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
