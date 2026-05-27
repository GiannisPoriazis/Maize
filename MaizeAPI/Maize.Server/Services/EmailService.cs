using System.Net.Mail;
using System.Net;

namespace Maize.Server.Services
{
    public class EmailService
    {
        public static bool SendEmail(string recipientEmail, string subject, string content, bool isHtml)
        {
            string senderEmail = "giannisporiazis@hotmail.com";
            string senderPassword = "Daroo3590@!@";

            try
            {
                using (MailMessage mail = new MailMessage(senderEmail, recipientEmail))
                {
                    mail.Subject = subject;
                    mail.Body = content;
                    mail.IsBodyHtml = isHtml;

                    using (SmtpClient smtp = new SmtpClient("smtp.office365.com", 587))
                    {
                        smtp.EnableSsl = true;
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = new NetworkCredential(senderEmail, senderPassword);
                        smtp.Send(mail);
                    }
                }  
                
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
