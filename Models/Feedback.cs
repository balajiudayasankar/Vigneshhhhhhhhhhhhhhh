using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternalKnowledgeBase.Api.Models
{
    public class Feedback : BaseEntity
    {
        public int Rating { get; set; } // 1-5 stars
        
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Suggestion { get; set; } = string.Empty;
        
        public bool IsHelpful { get; set; }
        
        // Foreign Keys
        public int ArticleId { get; set; }
        public int UserId { get; set; }
        
        // Navigation properties
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; } = null!;
        
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}