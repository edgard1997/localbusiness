using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class Review
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string BusinessId { get; set; }
        public string Text { get; set; }
        public double Rating { get; set; }
        public string City { get; set; }
        public bool IsReported { get; set; }
        public DateTime Date { get; set; }
    }
}
