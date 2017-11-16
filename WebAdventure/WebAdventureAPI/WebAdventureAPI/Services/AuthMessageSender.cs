using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace WebAdventureAPI.Services
{
    public class AuthMessageSender : IEmailSender
    {
        public AuthMessageSenderOptions Options { get; }

        public AuthMessageSender(IOptions<AuthMessageSenderOptions> options)
        {
            Options = options.Value;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            //return Execute(Options.SendGridKey, subject, message, email); 
                 return Execute("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", subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("admin@webadventures.com", "WebAdventures Admin"),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));
            return client.SendEmailAsync(msg);
        }
    }
}
