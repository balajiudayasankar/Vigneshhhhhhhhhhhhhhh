using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternalKnowledgeBase.Api.Models
{
    public enum ArticleStatus
    {
        Draft = 1,
        Submitted = 2,
        UnderReview = 3,
        Approved = 4,
        Published = 5,
        Archived = 6,
        Rejected = 7
    }

    public class Article : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Summary { get; set; } = string.Empty;
        
        public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
        
        public int ViewCount { get; set; } = 0;
        
        public DateTime? PublishedDate { get; set; }
        
        public DateTime? ArchivedDate { get; set; }
        
        [StringLength(1000)]
        public string ReviewNotes { get; set; } = string.Empty;
        
        // Foreign Keys
        public int ContributorId { get; set; }
        public int CategoryId { get; set; }
        public int? ReviewedByUserId { get; set; }
        
        // Navigation properties
        [ForeignKey("ContributorId")]
        public virtual Contributor Contributor { get; set; } = null!;
        
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;
        
        [ForeignKey("ReviewedByUserId")]
        public virtual User? ReviewedByUser { get; set; }
        
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
        public virtual ICollection<ArticleVersion> ArticleVersions { get; set; } = new List<ArticleVersion>();
        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    }
}