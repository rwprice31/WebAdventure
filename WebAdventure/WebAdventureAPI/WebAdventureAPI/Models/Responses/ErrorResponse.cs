namespace WebAdventureAPI.Models.Responses
{
    public static class ErrorResponse
    {
        public static Response ServerError => new Response
        {
            Status = false,
            StatusCode = 500,
            StatusText = "There was a server error"
        };

        public static Response CustomErrorCode(int statusCode, string text) => new Response
        {
            Status = false,
            StatusText = text,
            StatusCode = statusCode
        };
    }
}
