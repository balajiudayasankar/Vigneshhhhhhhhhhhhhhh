using InternalKnowledgeBase.Api.Data;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternalKnowledgeBase.Api.Repositories
{
    public class ContributorRepository : GenericRepository<Contributor>, IContributorRepository
    {
        public ContributorRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Contributor?> GetByUserIdAsync(int userId)
        {
            return await _context.Contributors
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted);
        }

        public async Task<IEnumerable<Contributor>> GetPendingApprovalsAsync()
        {
            return await _context.Contributors
                .Include(c => c.User)
                .Where(c => !c.IsApproved && !c.IsDeleted)
                .OrderBy(c => c.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Contributor>> GetApprovedContributorsAsync()
        {
            return await _context.Contributors
                .Include(c => c.User)
                .Include(c => c.ApprovedByUser)
                .Where(c => c.IsApproved && !c.IsDeleted)
                .OrderBy(c => c.ApprovedDate)
                .ToListAsync();
        }

        public async Task<Contributor?> GetContributorWithUserAsync(int contributorId)
        {
            return await _context.Contributors
                .Include(c => c.User)
                .Include(c => c.ApprovedByUser)
                .FirstOrDefaultAsync(c => c.Id == contributorId && !c.IsDeleted);
        }
    }
}