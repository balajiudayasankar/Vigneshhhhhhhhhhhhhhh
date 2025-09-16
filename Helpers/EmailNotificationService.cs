using System.Net;
using System.Net.Mail;

namespace InternalKnowledgeBase.Api.Helpers
{
    public class EmailNotificationService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailNotificationService> _logger;

        public EmailNotificationService(IConfiguration configuration, ILogger<EmailNotificationService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendContributorApprovalEmailAsync(string toEmail, string userName, bool isApproved, string notes = "")
        {
            var subject = isApproved ? "Contributor Access Approved" : "Contributor Access Denied";
            var body = isApproved 
                ? $"Dear {userName},\n\nYour request to become a contributor has been approved. You can now start creating and submitting articles.\n\n{notes}"
                : $"Dear {userName},\n\nYour request to become a contributor has been denied.\n\nReason: {notes}";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendArticleStatusEmailAsync(string toEmail, string userName, string articleTitle, string status, string notes = "")
        {
            var subject = $"Article Status Update: {articleTitle}";
            var body = $"Dear {userName},\n\nYour article '{articleTitle}' status has been updated to: {status}\n\n{notes}";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendNewArticleNotificationAsync(string toEmail, string articleTitle, string contributorName)
        {
            var subject = "New Article Submitted for Review";
            var body = $"A new article '{articleTitle}' has been submitted by {contributorName} and is awaiting review.";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var smtpHost = smtpSettings["Host"];
                var smtpPort = int.Parse(smtpSettings["Port"] ?? "587");
                var smtpUsername = smtpSettings["Username"];
                var smtpPassword = smtpSettings["Password"];
                var fromEmail = smtpSettings["FromEmail"];
                var fromName = smtpSettings["FromName"];

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail ?? "", fromName ?? ""),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
            }
        }
    }
}