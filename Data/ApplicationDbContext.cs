using InternalKnowledgeBase.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternalKnowledgeBase.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Contributor> Contributors { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<ArticleVersion> ArticleVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure many-to-many relationship between Articles and Tags
            modelBuilder.Entity<Article>()
                .HasMany(a => a.Tags)
                .WithMany(t => t.Articles)
                .UsingEntity(j => j.ToTable("ArticleTags"));

            // Configure User-Role relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure User-Contributor relationship
            modelBuilder.Entity<Contributor>()
                .HasOne(c => c.User)
                .WithOne(u => u.Contributor)
                .HasForeignKey<Contributor>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Article-Contributor relationship
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Contributor)
                .WithMany(c => c.Articles)
                .HasForeignKey(a => a.ContributorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Article-Category relationship
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Articles)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Feedback relationships
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Article)
                .WithMany(a => a.Feedbacks)
                .HasForeignKey(f => f.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin", Description = "System Administrator", CreatedDate = DateTime.UtcNow },
                new Role { Id = 2, Name = "User", Description = "General User", CreatedDate = DateTime.UtcNow }
            );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "General", Description = "General knowledge articles", Color = "#007bff", CreatedDate = DateTime.UtcNow },
                new Category { Id = 2, Name = "IT Support", Description = "IT and Technical Support", Color = "#28a745", CreatedDate = DateTime.UtcNow },
                new Category { Id = 3, Name = "HR Policies", Description = "Human Resources Policies", Color = "#dc3545", CreatedDate = DateTime.UtcNow },
                new Category { Id = 4, Name = "Procedures", Description = "Standard Operating Procedures", Color = "#ffc107", CreatedDate = DateTime.UtcNow }
            );

            // Seed Tags
            modelBuilder.Entity<Tag>().HasData(
                new Tag { Id = 1, Name = "FAQ", Description = "Frequently Asked Questions", CreatedDate = DateTime.UtcNow },
                new Tag { Id = 2, Name = "Tutorial", Description = "Step-by-step tutorials", CreatedDate = DateTime.UtcNow },
                new Tag { Id = 3, Name = "Policy", Description = "Company policies", CreatedDate = DateTime.UtcNow },
                new Tag { Id = 4, Name = "Troubleshooting", Description = "Problem resolution guides", CreatedDate = DateTime.UtcNow }
            );
        }
    }
}