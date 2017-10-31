using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Responses
{
    public class Response
    {
        public int StatusCode { get; set; }
        public bool Status { get; set; }
        public string StatusText { get; set; }
    }
}
