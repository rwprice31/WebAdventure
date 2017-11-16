
using WebAdventureAPI.Models.Dtos;
namespace WebAdventureAPI.Models.Responses
{
    public class ForgotPasswordResponse : Response
    {
        public ForgotPasswordResponse()
        {
            StatusText = "Email sent!";
            StatusCode = 200;
            Status = true;
        }

        public UserDto User { get; set; }
    }
}
