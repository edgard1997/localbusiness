using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{
    public class PostReviewWithFiles
    {
        public string AuthorId { get; set; }
        public string Text { get; set; }
        public IFormFile Image1 { get; set; }
        public IFormFile Image2 { get; set; }
        public double Rating { get; set; }
        public string BusinessId { get; set; }
    }

    public class PostReviewWithoutFiles
    {
        public string AuthorId { get; set; }
        public string Text { get; set; }
        public double Rating { get; set; }
        public string BusinessId { get; set; }
    }

    public class ReportPage
    {
        public string BizId { get; set; }
        public string AuthorId { get; set; }
        public int Reason { get; set; }
    }

    public class ReportReview
    {
        public string BizId { get; set; }
        public string ReviewId { get; set; }
        public string AuthorId { get; set; }
        public int Reason { get; set; }
    }


}
