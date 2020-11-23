using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class ReviewImage
    {
        public string Id { get; set; }
        public string ReviewId { get; set; }
        public string AuthorId { get; set; }
        public string BusinessId { get; set; }
        public string imageUrl { get; set; }
        public string Name { get; set; }
    }
}
