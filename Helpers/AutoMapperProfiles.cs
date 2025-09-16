using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.IsContributor, opt => opt.MapFrom(src => src.Contributor != null && src.Contributor.IsApproved));

            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password)));

            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            // Contributor mappings
            CreateMap<Contributor, ContributorDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.ApprovedByUserName, opt => opt.MapFrom(src => 
                    src.ApprovedByUser != null ? $"{src.ApprovedByUser.FirstName} {src.ApprovedByUser.LastName}" : ""));

            CreateMap<ContributorRequestDto, Contributor>();

            // Article mappings
            CreateMap<Article, ArticleDto>()
                .ForMember(dest => dest.ContributorName, opt => opt.MapFrom(src => $"{src.Contributor.User.FirstName} {src.Contributor.User.LastName}"))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags.Select(t => t.Name).ToList()));

            CreateMap<CreateArticleDto, Article>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ArticleStatus.Draft));

            CreateMap<UpdateArticleDto, Article>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ContributorId, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());

            // Category mappings
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.ArticleCount, opt => opt.MapFrom(src => src.Articles.Count));

            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // Tag mappings
            CreateMap<Tag, TagDto>()
                .ForMember(dest => dest.ArticleCount, opt => opt.MapFrom(src => src.Articles.Count));

            CreateMap<CreateTagDto, Tag>();
            CreateMap<UpdateTagDto, Tag>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // Feedback mappings
            CreateMap<Feedback, FeedbackDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.ArticleTitle, opt => opt.MapFrom(src => src.Article.Title));

            CreateMap<CreateFeedbackDto, Feedback>();
        }
    }
}