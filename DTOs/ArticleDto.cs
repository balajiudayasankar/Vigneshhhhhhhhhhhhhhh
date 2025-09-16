using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.DTOs
{
    public class ArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public ArticleStatus Status { get; set; }
        public int ViewCount { get; set; }
        public DateTime? PublishedDate { get; set; }
        public string ContributorName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public string ReviewNotes { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class CreateArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
    }

    public class UpdateArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
    }

    public class ReviewArticleDto
    {
        public ArticleStatus Status { get; set; }
        public string ReviewNotes { get; set; } = string.Empty;
    }
}