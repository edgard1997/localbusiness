using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{

    public class SearchWithFilter
    {
        public string Query { get; set; }
        public string Location { get; set; }
        public int Page { get; set; }
        public SearchFilter Filters { get; set; }
    }

    public class SearchFilter
    {
        public int Category { get; set; }
        public string Query { get; set; }
        public string Location { get; set; }
        public int Skip { get; set; }
        public bool OpenNow { get; set; }
        public bool FreeWifi { get; set; }
        public bool CreditCard { get; set; }
        public bool ParKing { get; set; }
        public bool HomeService { get; set; }
        public bool HasToilets { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool InTheBlock { get; set; }
        public bool Nearby { get; set; }
        public bool InTheTown { get; set; }
        public bool InTheCity { get; set; }
    }

    public class SearchResult
    {
       public int Pages { get; set; }
       public int TotalCount { get; set; }
       public List<ResultItem> Items { get; set; }
       public List<ResultItem> SponsoredItems { get; set; }

    }

    public class ResultItem
    {
        public string Id { get; set; }
        public string BusinessName { get; set; }
         public List<string> UrlsPictures { get; set; }
        public double Rating { get; set; }
        public int ReviewsCount { get; set; }
        public string Distance { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public bool IsOpen { get; set; }
        public bool Verified { get; set; }
        public string Status { get; set; }
        public bool IsPremium { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
        public List<OwnedPhoto> Album { get; set; }
    }

    public class TimeTable
    {
        public int DayId { get; set; }
        public string UserId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public bool IsOpened { get; set; }
        public string Day { get; set; }
    }

    public class ReviewViewModel
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorProfileUrl { get; set; }
        public string Text { get; set; }
        public List<string> PicturesUrls { get; set; }
        public string Date { get; set; }
        public double Rating { get; set; }
        public string BizId { get; set; }
    }

    public class Biz
    {
        public ResultItem BizDetails { get; set; }
        public List<TimeTable> OpeningHours { get; set; }
        public List<ReviewViewModel> Reviews { get; set; }
        public int TotalGalleryImagesCount { get; set; }
        public int GalleryPages { get; set; }
        public bool IsBusinessClaimed { get; set; }
        public List<BizService> Services { get; set; }
        public string BizEmailAddress { get; set; }
        public string BizPhoneNumber { get; set; }
        public string Joined { get; set; }
        public List<string> HightLight { get; set; }
    }

    public class Suggestions
    {
        public List<ResultItem> Items { get; set; }

        public List<ReviewViewModel> Reviews { get; set; }
    }
}
