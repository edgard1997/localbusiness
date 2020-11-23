using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class Photo
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string PhotoName { get; set; }
        public string Title { get; set; }
        public bool HasPrice { get; set; }
        public string Price { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
    }
}
