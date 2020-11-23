using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class Report
    {
        public string Id { get; set; }
        public bool IsAboutBiz { get; set; }
        public int Reason { get; set; }
        public int Degree { get; set; }
        public string AuthorId { get; set; }
        public string ReviewId { get; set; }
        public string BizId { get; set; }
        public DateTime Date { get; set; }
    }
}
