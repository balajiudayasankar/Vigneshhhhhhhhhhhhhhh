using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternalKnowledgeBase.Api.Models
{
    public class ArticleVersion : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public int VersionNumber { get; set; }
        
        [StringLength(500)]
        public string ChangeNotes { get; set; } = string.Empty;
        
        // Foreign Keys
        public int ArticleId { get; set; }
        public int ModifiedByUserId { get; set; }
        
        // Navigation properties
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; } = null!;
        
        [ForeignKey("ModifiedByUserId")]
        public virtual User ModifiedByUser { get; set; } = null!;
    }
}