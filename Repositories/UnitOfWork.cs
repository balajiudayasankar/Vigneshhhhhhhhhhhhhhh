using InternalKnowledgeBase.Api.Data;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace InternalKnowledgeBase.Api.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Contributors = new ContributorRepository(_context);
            Articles = new ArticleRepository(_context);
            Categories = new CategoryRepository(_context);
            Tags = new TagRepository(_context);
            Feedbacks = new FeedbackRepository(_context);
        }

        public IUserRepository Users { get; private set; }
        public IContributorRepository Contributors { get; private set; }
        public IArticleRepository Articles { get; private set; }
        public ICategoryRepository Categories { get; private set; }
        public ITagRepository Tags { get; private set; }
        public IFeedbackRepository Feedbacks { get; private set; }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}