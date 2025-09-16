using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternalKnowledgeBase.Api.Models
{
    public class Document : BaseEntity
    {
        [Required]
        [StringLength(255)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string FileType { get; set; } = string.Empty;
        
        public long FileSize { get; set; }
        
        // Foreign Keys
        public int ArticleId { get; set; }
        
        // Navigation properties
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; } = null!;
    }
}