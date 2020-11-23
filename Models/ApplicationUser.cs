using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int ProfileType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
        public string IdCardNumber { get; set; }
        public int BusinessType { get; set; }
        public string BusinessName { get; set; }
        public string BusinessDescription { get; set; }
        public string ProfilePictureUrl { get; set; }
        public bool IsLoggedIn { get; set; }
        public string TimeZone { get; set; }
        public bool BusinessVerified { get; set; }
        public decimal Balance { get; set; }
        public DateTime SubscriptionStart { get; set; }
        public DateTime SubscriptionEnd { get; set; }
        public string MoneyCode { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
        public double Rating { get; set; }
        public int TotalReviewsCount { get; set; }
        public double TotalRatingCount { get; set; }
        public long TotalVisitCount { get; set; }
        public bool IsReported { get; set; }
        public DateTime PremiumExpirationDate { get; set; } 
        public DateTime LastSession { get; set; }
        public DateTime Creation { get; set; }
    }
}
