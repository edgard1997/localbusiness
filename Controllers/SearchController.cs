using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NiceWixApp.ViewModels;
using NiceWixApp.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using NiceWixApp.Models;
using NiceWixApp.Data;
using NiceWixApp.Services;

namespace NiceWixApp.Controllers
{
 
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private IWebHostEnvironment Environment;
        private readonly IHttpContextAccessor _http;
        public SearchController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, ApplicationDbContext db,
            IWebHostEnvironment _environment, IHttpContextAccessor http)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _db = db;
            Environment = _environment;
            _http = http;
        }


        [HttpGet("/search/getSuggestions/{city}")]
        public Suggestions Suggestions(string city)
        {
            Random rand = new Random();
            var sponsoredItems = _db.Users.Where(x => x.PremiumExpirationDate >= DateTime.Now && x.City.ToUpper() == city.ToUpper()).OrderBy(x => Guid.NewGuid()).Take(4).ToList();

            List<ResultItem> items = new List<ResultItem>();

            foreach (var item in sponsoredItems)
            {

                var photo = _db.Photos.Where(x => x.UserId == item.Id).Take(1).Select(x => x.Url).ToList();

                items.Add(
                new ResultItem
                {
                    Id = item.Id,
                    BusinessName = item.BusinessName,
                    Description = item.BusinessDescription,
                    IsPremium = true,
                    Location = item.Address,
                    Rating = item.Rating,
                    Lat = item.Lat,
                    Long = item.Long,
                    Verified = item.BusinessVerified,
                    ReviewsCount = item.TotalReviewsCount,
                    UrlsPictures = photo,
                }
               );

            }

            var reviews = _db.Reviews.Where(x => x.City.ToLower() == city.ToLower()).OrderByDescending(x => x.Date).Take(8).ToList();
            List<ReviewViewModel> list = new List<ReviewViewModel>();
            foreach (var item in reviews)
            {
                var author = _db.Users.Find(item.AuthorId);
                if (author != null)
                {
                    var pics = _db.ReviewsImages.Where(x => x.AuthorId == author.Id && x.ReviewId == item.Id).Select(x => x.imageUrl).ToList();
                 
                    if(pics.ToList().Count() > 0)
                    {
                        list.Add(new ReviewViewModel
                        {
                            AuthorId = item.AuthorId,
                            AuthorName = $"{author.FirstName} {author.LastName}",
                            Date = Tools.GetTime(item.Date, author.TimeZone),
                            Rating = item.Rating,
                            AuthorProfileUrl = author.ProfilePictureUrl,
                            Id = item.Id,
                            PicturesUrls = pics,
                            Text = item.Text,
                            BizId = item.BusinessId,
                        });
                    }
                    
                }

            }

            Suggestions model = new Suggestions
            {
                Items = items,
                Reviews = list,
            };

            return model;

        }

        [HttpGet("/search/byQuery/{query}/{latitude}/{longitude}/{city}/{skip}")]
        public SearchResult SearchByQuery(string query, double latitude, string city, double longitude, int skip)
        {

            var sponsoredItems = _db.Users.Where(x => x.PremiumExpirationDate >= DateTime.Now && x.City.ToUpper() == city.ToUpper()).OrderBy(x => Guid.NewGuid()).Take(4).ToList();
            var items = _db.Users.Where(x => ( x.BusinessName.ToUpper().Contains(query.ToUpper()) && x.City.ToUpper() == city.ToUpper()) || (x.BusinessDescription.ToUpper().Contains(query.ToUpper()) && x.City.ToUpper() == city.ToUpper()) ).Skip(skip).Take(10).ToList();
            var premium = GetPremiumList(sponsoredItems, latitude, longitude);
            var standard = GetStandardList(items, latitude, longitude);
            foreach (var stand in standard.ToList())
            {
                if (premium.Any(x => x.Id == stand.Id))
                {
                    standard.Remove(stand);
                }
            }
            var totalCount = standard.Count();
            var converted = Convert.ToDouble(totalCount);
            double res = converted / 10;
            double pages = Math.Ceiling(res);

            SearchResult result = new SearchResult
            {
                Items = standard,
                SponsoredItems = premium,
                Pages = Convert.ToInt32(pages),
                TotalCount = totalCount,
            };

            return result;

        }

        [HttpGet("/search/getSuggestions/{query}/{latitude}/{longitude}/{city}")]
        public SearchResult GetSuggestions(string query, double latitude, double longitude, string city)
        {

            var items = _db.Users.Where(x => (x.BusinessName.ToUpper().Contains(query.ToUpper()) && x.City.ToUpper() == city.ToUpper()) || ( x.BusinessDescription.ToUpper().Contains(query.ToUpper()) && x.City.ToUpper() == city.ToUpper())).Take(4).ToList();

            var standard = GetStandardList(items, latitude, longitude);

            SearchResult result = new SearchResult
            {
                Items = standard,
            };

            return result;

        }

        [HttpGet("/search/byCategory/{category}/{latitude}/{longitude}/{city}/{skip}")]
        public SearchResult SearchByCategory(int category, double latitude, double longitude, string city, int skip)
        {

            var sponsoredItems = _db.Users.Where(x => x.PremiumExpirationDate >= DateTime.Now && x.City.ToUpper() == city.ToUpper()).OrderBy(x => Guid.NewGuid()).Take(4).ToList();
            var items = _db.Users.Where(x =>  x.BusinessType == category && x.City.ToUpper() == city.ToUpper()).Skip(skip).Take(10).ToList();
            var premium = GetPremiumList(sponsoredItems, latitude, longitude);
            var standard = GetStandardList(items, latitude, longitude);
            foreach (var stand in standard.ToList()) 
            {
               if(premium.Any( x => x.Id == stand.Id))
                {
                    standard.Remove(stand);
                }
            }
            var totalCount = standard.Count();
            var converted = Convert.ToDouble(totalCount);
            double res = converted / 10;
            double pages = Math.Ceiling(res);

            SearchResult result = new SearchResult
            {
                Items = standard,
                SponsoredItems = premium,
                Pages = Convert.ToInt32(pages),
                TotalCount = totalCount,
            };

            return result;

        }

        [HttpGet("/search/filters/{category}/{city}/{query}/{skip}/{openNow}/{freeWifi}/{creditCard}/{parKing}/{homeService}/{hasToilets}/{latitude}/{longitude}/{inTheBlock}/{nearby}/{inTheTown}/{inTheCity}")]
        public SearchResult SearchWithFilters(
        int category, string city, string query, int skip, bool openNow, bool freeWifi, bool creditCard, bool parKing, bool homeService, bool hasToilets, double latitude, double longitude, bool inTheBlock, bool nearby, bool inTheTown,bool inTheCity)
        {
            SearchFilter filters = new SearchFilter
            {
                 Category = category,
                 Query = query,
                 Skip = skip,
                 CreditCard = creditCard,
                 FreeWifi = freeWifi,
                 HasToilets = hasToilets,
                 HomeService = homeService,
                 InTheBlock = inTheBlock,
                 InTheCity = inTheCity,
                 InTheTown= inTheTown,
                 Latitude = latitude,
                 Longitude = longitude,
                 Nearby = nearby,
                 OpenNow = openNow,
                 ParKing = parKing
            };

            var sponsoredItems = _db.Users.Where(x => x.PremiumExpirationDate >= DateTime.Now && x.City.ToUpper() == city.ToUpper()).OrderBy(x => Guid.NewGuid()).Take(4).ToList();

            List<ApplicationUser> items = new List<ApplicationUser>();

            if(filters.Category == 0)
            {
                items = _db.Users.Where(x => ( x.BusinessName.ToUpper().Contains(filters.Query.ToUpper()) && x.City.ToUpper() == city.ToUpper() ) ||  ( x.BusinessDescription.ToUpper().Contains(filters.Query.ToUpper()) && x.City.ToUpper() == city.ToUpper()) ).Skip(filters.Skip).Take(15).ToList();
            }
            else
            {
                 items = _db.Users.Where(x => x.BusinessType == filters.Category && x.City.ToUpper() == city.ToUpper()).Skip(filters.Skip).Take(15).ToList();
            }


            var premium = GetPremiumList(sponsoredItems, filters.Latitude, filters.Longitude);
            var standard = GetFilteredList(items, filters);
            foreach (var stand in standard.ToList())
            {
                if (premium.Any(x => x.Id == stand.Id))
                {
                    standard.Remove(stand);
                }
            }
            var totalCount = standard.Count();
            var converted = Convert.ToDouble(totalCount);
            double res = converted / 15;
            double pages = Math.Ceiling(res);

            SearchResult result = new SearchResult
            {
                Items = standard,
                SponsoredItems = premium,
                Pages = Convert.ToInt32(pages),
                TotalCount = totalCount,
            };

            return result;

        }

        [HttpGet("search/biz/{id}")]
        public Biz BizDetails(string id)
        {
            var business = _db.Users.Find(id);
            if(business == null)
            {
                return null;
            }
            var gallery = _db.Photos.Where(x => x.UserId == business.Id).Take(12).ToList();
            List<OwnedPhoto> galleryPics = new List<OwnedPhoto>();
            foreach (var item in gallery)
            {
                galleryPics.Add(new OwnedPhoto
                {
                    HasPrice = item.HasPrice,
                    PhotoId = item.Id,
                    PhotoUrl = item.Url,
                    Price = item.Price,
                    Title = item.Title,
                });

            }
            var localTime = Tools.GetLocalTime(business.TimeZone);
            var currentDay = (int)localTime.DayOfWeek;
            string nextDayStarTime = null;
            bool isNextDayOpened = false;
            currentDay = currentDay + 1;
            var time = _db.UsersHours.FirstOrDefault(x => x.DayId == currentDay && x.UserId == business.Id);

            if (currentDay < 6)
            {
                var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == business.Id && x.DayId == (currentDay + 1));
                isNextDayOpened = nextDay.IsOpened;
                nextDayStarTime = nextDay.From;
            }
            else
            {
                if (currentDay == 6)
                {
                    var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == business.Id && x.DayId == 7);
                    isNextDayOpened = nextDay.IsOpened;
                    nextDayStarTime = nextDay.From;
                }
                if (currentDay == 7)
                {
                    var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == business.Id && x.DayId == 1);
                    isNextDayOpened = nextDay.IsOpened;
                    nextDayStarTime = nextDay.From;
                }
            }

            var isOpenNow = IsBusinessOpenNow(time.IsOpened, time.From, time.To, business.TimeZone);

            ResultItem details = new ResultItem
            {
                Id = business.Id,
                BusinessName = business.BusinessName,
                Description = business.BusinessDescription,
                Distance = "0km",
                IsOpen = isOpenNow,
                IsPremium = false,
                Location = business.Address,
                Rating = business.Rating,
                Lat = business.Lat,
                Long = business.Long,
                ReviewsCount = business.TotalReviewsCount,
                Status = Tools.GetOpeningStatus(time.From, time.To, nextDayStarTime, business.TimeZone, time.IsOpened, isOpenNow, isNextDayOpened),
                Album = galleryPics,
                Verified = business.BusinessVerified,
            };

            var appAmenities = _db.Amenities.ToList();
            List<BizService> services = new List<BizService>();

            foreach (var am in appAmenities)
            {
                if (_db.UsersAmenities.Any(x => x.AmenitieId == am.Id && x.UserId == business.Id && x.IsChecked == true))
                {
                    services.Add(new BizService { Name = am.FrenchName, Checked = true, AmenitieId = am.Id });
                }
          
            };


            int galleryCount = _db.Photos.Where(x => x.UserId == business.Id).Select(x => x.Url).ToList().Count();
            var converted = Convert.ToDouble(galleryCount);
            double res = converted / 12;
            double pages = Math.Ceiling(res);
            var hours = _db.UsersHours.Where(x => x.UserId == business.Id).OrderBy( x => x.DayId ).ToList();
            List<TimeTable> table = new List<TimeTable>();
            foreach (var item in hours)
            {
                table.Add(new TimeTable { 
                  UserId = business.Id,
                  DayId = item.DayId,
                  From = item.From,
                  IsOpened = item.IsOpened,
                  To = item.To,
                  Day = _db.DaysOfTheWeek.FirstOrDefault( x => x.Id == item.DayId).Name,
                });

            }

            var reviews = _db.Reviews.Where(x => x.BusinessId == business.Id).OrderByDescending( x => x.Date ).Take(12).ToList();

            List<ReviewViewModel> list = new List<ReviewViewModel>();
            foreach (var item in reviews)
            {
                var author = _db.Users.Find(item.AuthorId);
                if(author != null)
                {
                    var pics = _db.ReviewsImages.Where(x => x.AuthorId == author.Id && x.ReviewId == item.Id ).Select( x => x.imageUrl ).ToList();

                    list.Add(new ReviewViewModel
                    {
                        AuthorId = item.AuthorId,
                        AuthorName = $"{author.FirstName} {author.LastName}",
                        Date = Tools.GetTime(item.Date, business.TimeZone),
                        Rating = item.Rating,
                        AuthorProfileUrl = author.ProfilePictureUrl,
                        Id = item.Id,
                        PicturesUrls = pics,
                        Text = item.Text
                    });

                }

            }

            Biz model = new Biz
            {
                BizDetails = details,
                Services = services,
                BizEmailAddress = business.Email,
                BizPhoneNumber = business.PhoneNumber,
                TotalGalleryImagesCount = galleryCount,
                IsBusinessClaimed = business.BusinessVerified,
                GalleryPages = Convert.ToInt32(pages),
                OpeningHours = table,
                Reviews = list,
                Joined = business.Creation.ToString("dd/MM/yyyy"),
                HightLight = _db.Photos.Where( x => x.UserId == business.Id ).OrderByDescending( x => x.Date ).Take(4).Select( x => x.Url ).ToList(),
                
            };

            return model;
        }


        [HttpGet("/search/album/{bizId}/{skip}")]
        public OwnedAlbum Album(string bizId, int skip)
        {

            var totalCount = _db.Photos.Where(x => x.UserId == bizId).ToList().Count();
            var converted = Convert.ToDouble(totalCount);
            double result = converted / 12;
            double pages = Math.Ceiling(result);
            var photos = _db.Photos.Where(x => x.UserId == bizId).Skip(skip).Take(12);

            List<OwnedPhoto> pics = new List<OwnedPhoto>();
            foreach (var item in photos)
            {
                pics.Add(new OwnedPhoto
                {
                    HasPrice = item.HasPrice,
                    PhotoId = item.Id,
                    PhotoUrl = item.Url,
                    Price = item.Price,
                    Title = item.Title,
                });

            }

            OwnedAlbum album = new OwnedAlbum
            {
                CurrentPhotos = pics,
                TotalPhotos = totalCount,
                Pages = Convert.ToInt32(pages),
            };

            return album;
        }

        [HttpGet("/search/visitCounter/{bizId}")]
        public IActionResult VisitCounter(string bizId)
        {
            var biz = _db.Users.Find(bizId);

            if(biz == null)
            {
                return BadRequest();
            }

            biz.TotalVisitCount = biz.TotalVisitCount + 1;
           
            _db.Users.Update(biz);
            _db.SaveChanges();

            return Ok();
        }

        private List<ResultItem> GetStandardList(List<ApplicationUser> items, double latitude, double longitude)
        {
            List<ResultItem> list = new List<ResultItem>();

            //longitude = 32.02;
            //latitude = 49.39;

            //foreach (var item in items.ToList())
            //{
            //    var distance = new Coordinates(item.Lat, item.Long)
            // .DistanceTo(
            //     new Coordinates(latitude, longitude),
            //     UnitOfLength.Kilometers
            // );

            //    if (distance > 50)//in the region only
            //    {
            //        items.Remove(item);
            //    }

            //}

            foreach (var item in items)
            {
                var hours = _db.UsersHours.Where(x => x.UserId == item.Id).ToList().Count;

                if (_db.Photos.Any(x => x.UserId == item.Id) && hours == 7) //has photos and 7 days of the week timetable. 
                {

                    var localTime = Tools.GetLocalTime(item.TimeZone);
                    var currentDay = (int)localTime.DayOfWeek;
                    string nextDayStarTime = null;
                    bool isNextDayOpened = false;
                    currentDay = currentDay + 1;
                    var time = _db.UsersHours.FirstOrDefault(x => x.DayId == currentDay && x.UserId == item.Id);

                    if (currentDay < 6)
                    {
                        var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == (currentDay + 1));
                        isNextDayOpened = nextDay.IsOpened;
                        nextDayStarTime = nextDay.From;
                    }
                    else
                    {
                        if (currentDay == 6)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 7);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                        if (currentDay == 7)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 1);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                    }

                    var photos = _db.Photos.Where(x => x.UserId == item.Id).Take(3).Select(x => x.Url).ToList();
                    var distance = new Coordinates(item.Lat, item.Long)
             .DistanceTo(
                 new Coordinates(latitude, longitude),
                 UnitOfLength.Kilometers
             );
                    string dist = String.Format("{0:0.#}", distance);

                    var isOpenNow = IsBusinessOpenNow(time.IsOpened, time.From, time.To, item.TimeZone);

                    list.Add(
                new ResultItem
                {
                    Id = item.Id,
                    BusinessName = item.BusinessName,
                    Description = item.BusinessDescription,
                    Distance = $"{dist}km",
                    IsOpen = isOpenNow,
                    IsPremium = false,
                    Location = item.Address,
                    Rating = item.Rating,
                    Lat = item.Lat,
                    Long = item.Long,
                    ReviewsCount = item.TotalReviewsCount,
                    Status = Tools.GetOpeningStatus(time.From,time.To, nextDayStarTime, item.TimeZone, time.IsOpened, isOpenNow, isNextDayOpened),
                    UrlsPictures = photos,
                    Verified = item.BusinessVerified,
                }
               );

                }
            }

            return list;
        }


        private List<ResultItem> GetPremiumList(List<ApplicationUser> items, double latitude, double longitude)
        {

            //foreach (var item in items.ToList())
            //{
            //    var distance = new Coordinates(item.Lat, item.Long)
            // .DistanceTo(
            //     new Coordinates(latitude, longitude),
            //     UnitOfLength.Kilometers
            // );

            //    if (distance > 50)//in the region only
            //    {
            //        items.Remove(item);
            //    }

            //}

            List<ResultItem> list = new List<ResultItem>();
            foreach (var item in items)
            {
                var hours = _db.UsersHours.Where(x => x.UserId == item.Id).ToList().Count;

                if (_db.Photos.Any(x => x.UserId == item.Id) && hours == 7) //has photos and 7 days of the week timetable. 
                {

                    var localTime = Tools.GetLocalTime(item.TimeZone);
                    var currentDay = (int)localTime.DayOfWeek;
                    string nextDayStarTime = null;
                    bool isNextDayOpened = false;
                    currentDay = currentDay + 1;
                    var time = _db.UsersHours.FirstOrDefault(x => x.DayId == currentDay && x.UserId == item.Id);

                    if (currentDay < 6)
                    {
                        var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == (currentDay + 1));
                        isNextDayOpened = nextDay.IsOpened;
                        nextDayStarTime = nextDay.From;
                    }
                    else
                    {
                        if (currentDay == 6)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 7);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                        if (currentDay == 7)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 1);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                    }

                    var photos = _db.Photos.Where(x => x.UserId == item.Id).Take(3).Select(x => x.Url).ToList();
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(latitude, longitude),
                     UnitOfLength.Kilometers
                 );

                    string dist = String.Format("{0:0.#}", distance);

                    var isOpenNow = IsBusinessOpenNow(time.IsOpened, time.From, time.To, item.TimeZone);

                    list.Add(
                new ResultItem
                {
                    Id = item.Id,
                    BusinessName = item.BusinessName,
                    Description = item.BusinessDescription,
                    Distance = $"{dist}km",
                    IsOpen = isOpenNow,
                    IsPremium = true,
                    Location = item.Address,
                    Rating = item.Rating,
                    Lat = item.Lat,
                    Long = item.Long,
                    ReviewsCount = item.TotalReviewsCount,
                    Status = Tools.GetOpeningStatus(time.From,time.To, nextDayStarTime, item.TimeZone, time.IsOpened, isOpenNow, isNextDayOpened),
                    UrlsPictures = photos,
                    Verified = item.BusinessVerified,
                }
               );

                }
            }

            return list;
        }

        private List<ResultItem> GetFilteredList(List<ApplicationUser> items, SearchFilter filters)
        {

            foreach (var item in items.ToList())
            {
                var distance = new Coordinates(item.Lat, item.Long)
             .DistanceTo(
                 new Coordinates(filters.Latitude, filters.Longitude),
                 UnitOfLength.Kilometers
             );

                if (distance > 50)//in the region only
                {
                    items.Remove(item);
                }

            }

            List<ResultItem> list = new List<ResultItem>();

            if (filters.InTheBlock)
            {
                foreach (var item in items.ToList())
                {
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(filters.Latitude, filters.Longitude),
                     UnitOfLength.Kilometers
                 );

                if(distance > 5)
                 {
                        items.Remove(item);
                 }

                }
            }
            if (filters.Nearby)
            {
                foreach (var item in items.ToList())
                {
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(filters.Latitude, filters.Longitude),
                     UnitOfLength.Kilometers
                 );

                    if (distance > 10)
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.InTheTown)
            {
                foreach (var item in items.ToList())
                {
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(filters.Latitude, filters.Longitude),
                     UnitOfLength.Kilometers
                 );

                    if (distance > 15)
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.InTheCity)
            {
                foreach (var item in items.ToList())
                {
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(filters.Latitude, filters.Longitude),
                     UnitOfLength.Kilometers
                 );

                    if (distance > 40)
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.CreditCard)
            {
                foreach (var item in items.ToList())
                {
                   
                    if (!_db.UsersAmenities.Any( x => x.AmenitieId == 10 && x.UserId == item.Id))
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.FreeWifi)
            {
                foreach (var item in items.ToList())
                {

                    if (!_db.UsersAmenities.Any(x => x.AmenitieId == 2 && x.UserId == item.Id))
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.HasToilets)
            {
                foreach (var item in items.ToList())
                {

                    if (!_db.UsersAmenities.Any(x => x.AmenitieId == 7 && x.UserId == item.Id))
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.HomeService)
            {
                foreach (var item in items.ToList())
                {

                    if (!_db.UsersAmenities.Any(x => x.AmenitieId == 20 && x.UserId == item.Id))
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.ParKing)
            {
                foreach (var item in items.ToList())
                {

                    if (!_db.UsersAmenities.Any(x => x.AmenitieId == 12 && x.UserId == item.Id))
                    {
                        items.Remove(item);
                    }

                }
            }
            if (filters.OpenNow) //open today instead
            {
                foreach (var item in items.ToList())
                {

                    if (_db.UsersHours.Any( x => x.UserId == item.Id) )
                    {
                        if(_db.UsersHours.FirstOrDefault(x => x.UserId == item.Id).IsOpened == false)
                        {
                                items.Remove(item);
                        }
                      
                    }
                    else
                    {
                        items.Remove(item);
                    }

                }
            }

            foreach (var item in items.ToList())
            {
                var hours = _db.UsersHours.Where(x => x.UserId == item.Id).ToList().Count;

                if (_db.Photos.Any(x => x.UserId == item.Id) && hours == 7)
                {

                    var localTime = Tools.GetLocalTime(item.TimeZone);
                    var currentDay = (int)localTime.DayOfWeek;
                    string nextDayStarTime = null;
                    bool isNextDayOpened = false;
                    currentDay = currentDay + 1;
                    var time = _db.UsersHours.FirstOrDefault(x => x.DayId == currentDay && x.UserId == item.Id);

                    if (currentDay < 6)
                    {
                        var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == (currentDay + 1));
                        isNextDayOpened = nextDay.IsOpened;
                        nextDayStarTime = nextDay.From;
                    }
                    else
                    {
                        if (currentDay == 6)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 7);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                        if (currentDay == 7)
                        {
                            var nextDay = _db.UsersHours.FirstOrDefault(x => x.UserId == item.Id && x.DayId == 1);
                            isNextDayOpened = nextDay.IsOpened;
                            nextDayStarTime = nextDay.From;
                        }
                    }

                    var photos = _db.Photos.Where(x => x.UserId == item.Id).Take(3).Select(x => x.Url).ToList();
                    var distance = new Coordinates(item.Lat, item.Long)
                 .DistanceTo(
                     new Coordinates(filters.Latitude, filters.Longitude),
                     UnitOfLength.Kilometers
                 );

                    var dist = string.Format("{0:0.#}", distance);

                    var isOpenNow = IsBusinessOpenNow(time.IsOpened, time.From, time.To, item.TimeZone);

                    list.Add(
                new ResultItem
                {
                    Id = item.Id,
                    BusinessName = item.BusinessName,
                    Description = item.BusinessDescription,
                    Distance = $"{dist}km",
                    IsOpen = isOpenNow,
                    IsPremium = false,
                    Location = item.Address,
                    Rating = item.Rating,
                    Lat = item.Lat,
                    Long = item.Long,
                    Verified = item.BusinessVerified,
                    ReviewsCount = item.TotalReviewsCount,
                    Status = Tools.GetOpeningStatus(time.From, time.To, nextDayStarTime, item.TimeZone, time.IsOpened, isOpenNow, isNextDayOpened),
                    UrlsPictures = photos,
                }
               );

                }
            }

            return list;
        }

        private bool IsBusinessOpenNow(bool isOpenDay, string startTime, string endTime, string timezone)
        {
            if (isOpenDay)
            {
                var LocalNow = Tools.GetLocalTime(timezone);
                var startHour = new string(startTime.Take(2).ToArray());
                var startMinutes = startTime.Substring(startTime.Length - 2);
                var endHour = new string(endTime.Take(2).ToArray());
                var endMinutes = endTime.Substring(endTime.Length - 2);
                var startDate = new DateTime(LocalNow.Year, LocalNow.Month, LocalNow.Day, Convert.ToInt32(startHour), Convert.ToInt32(startMinutes), 0);
                var endDate = new DateTime(LocalNow.Year, LocalNow.Month, LocalNow.Day, Convert.ToInt32(endHour), Convert.ToInt32(endMinutes), 0);
                var LocalOpening = Tools.GetLocalOpening(timezone, startDate);
                var LocalClosing = Tools.GetLocalOpening(timezone, endDate);

                if (LocalOpening < LocalClosing && LocalOpening < LocalNow && LocalNow < LocalClosing)// opened now at daytime
                {
                    return true;
                }
                if (LocalOpening > LocalClosing && LocalNow > LocalOpening && LocalNow < LocalClosing)// opened now overnight
                {
                    return true;
                }
            }
          
            return false;
            
        }
    }
}