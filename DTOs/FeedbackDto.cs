namespace InternalKnowledgeBase.Api.DTOs
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Suggestion { get; set; } = string.Empty;
        public bool IsHelpful { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string ArticleTitle { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }

    public class CreateFeedbackDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Suggestion { get; set; } = string.Empty;
        public bool IsHelpful { get; set; }
        public int ArticleId { get; set; }
    }
}