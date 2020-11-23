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
using NiceWixApp.Data;
using NiceWixApp.Models;
using NiceWixApp.Services;

namespace NiceWixApp.Controllers
{

    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private IWebHostEnvironment Environment;
        private readonly IHttpContextAccessor _http;
        public AccountController(
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


        [HttpPost("/account/register")]
        public async Task<IActionResult> Register([FromBody]CreateClientViewModel model)
        {
            if (_db.Users.Any(x => x.PhoneNumber.ToUpper() == model.PhoneNumber.ToUpper() || x.UserName.ToUpper() == model.PhoneNumber.ToUpper()))
            {
                return (IActionResult)BadRequest(false);
            }

            if(model == null)
            {
                return (IActionResult)BadRequest(false);
            }

            var userTocreate = new ApplicationUser {
                Id = Guid.NewGuid().ToString(),
                ProfileType = 1,
                UserName = model.PhoneNumber,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Country = model.Country,
                City = model.City,
                Code = model.Code,
                Iso = model.Iso,
                PhoneNumber = model.PhoneNumber,
                Creation = Tools.GetLocalTime(Tools.GetTimezone(model.Code)),
                Address = model.Address,
                MoneyCode = GenerateCode().ToString(),
                TimeZone = Tools.GetTimezone(model.Code),
            };

            userTocreate.Creation = Tools.GetLocalTime(userTocreate.TimeZone);

            var result = await _userManager.CreateAsync(userTocreate, model.Password);
            if (result.Succeeded)
            {
                return (IActionResult)Ok(true);
            }

            return (IActionResult)BadRequest(false);

        }

        [HttpPost("/account/newBusiness")]
        public async Task<IActionResult> NewBusiness([FromBody]CreateBusinessViewModel model)
        {
            if (_db.Users.Any(x => x.PhoneNumber.ToUpper() == model.PhoneNumber.ToUpper() || x.UserName == model.PhoneNumber.ToUpper()) || model == null)
            {
                return (IActionResult)BadRequest(false);
            }

            var userTocreate = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                ProfileType = 2,
                UserName = model.PhoneNumber,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Country = model.Country,
                City = model.City,
                Code = model.Code,
                Iso = model.Iso,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                BusinessName = model.BusinessName,
                BusinessType = model.BusinessType,
                IdCardNumber = model.IdCardNumber,
                TimeZone = Tools.GetTimezone(model.Code),
                Lat = model.Lat,
                Long = model.Long,
                Email = model.Email,
                NormalizedEmail = model.Email.ToUpper(),
                MoneyCode = GenerateCode().ToString(),

            };

            userTocreate.Creation = Tools.GetLocalTime(userTocreate.TimeZone);
            userTocreate.SubscriptionStart = Tools.GetLocalTime(userTocreate.TimeZone);
            userTocreate.SubscriptionEnd = Tools.GetLocalTime(userTocreate.TimeZone).AddDays(7);

            var result = await _userManager.CreateAsync(userTocreate, model.Password);
            if (result.Succeeded)
            {
                return (IActionResult)Ok(true);
            }

            return (IActionResult)BadRequest(false);
        }

        [Authorize]
        [HttpGet("/account/details/{id}")]
        public UserGetDetails Details(string id)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;



            if (id != userId || !_db.Users.Any(X => X.Id == userId))
            {
                return null;
            }
            var user = _db.Users.Find(userId);
            if (user == null || !authenticated)
            {
                return null;
            }
            UserGetDetails model = new UserGetDetails
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                City = user.City,
                Country = user.Country,
                Code = user.Code,
                Iso = user.Iso,
                ProfilePictureUrl = user.ProfilePictureUrl != null ? user.ProfilePictureUrl : "https://st6808.ispot.cc/media/default-profile.png",
                Address = user.Address,
                Email = user.Email,
                PhoneNumber = user.UserName,
            };

            return model;
        }

        [Authorize]
        [HttpPost("/account/details")]
        public IActionResult Details([FromForm]UserPostDetails model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            user.Address = model.Address;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Country = model.Country;
            user.City = model.City;
            user.Code = model.Code;
            user.Iso = model.Iso;
            user.UserName = model.PhoneNumber;
            user.PhoneNumber = model.PhoneNumber;
            user.NormalizedUserName = model.PhoneNumber;

            string contentPath = Environment.ContentRootPath;

            if (model.Picture != null)
            {
                string fileName = $"pfp-{user.Id}.jpg";
                if (_db.Photos.Any( x => x.PhotoName == fileName))
                {
                   Tools.DeleteImageProduction(fileName);
                   user.ProfilePictureUrl = Tools.SaveImageProduction(model.Picture, fileName);
                   
                }
                else
                {
                    user.ProfilePictureUrl = Tools.SaveImageProduction(model.Picture, fileName);
                    Photo photo = new Photo
                    {
                        Id = Guid.NewGuid().ToString(),
                        Url = user.ProfilePictureUrl,
                        PhotoName = fileName,
                        Date = Tools.GetLocalTime(user.TimeZone),
                    };

                    _db.Photos.Add(photo);

                    _db.SaveChanges();
                }
            }

         
            _db.Users.Update(user);

            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpPost("/account/details2")]
        public IActionResult Details([FromBody]UserPostDetails2 model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            user.Address = model.Address;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Country = model.Country;
            user.City = model.City;
            user.Code = model.Code;
            user.Iso = model.Iso;
            user.UserName = model.PhoneNumber;
            user.PhoneNumber = model.PhoneNumber;
            user.NormalizedUserName = model.PhoneNumber;
            _db.Users.Update(user);

            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpPost("/account/changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePassword model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (model == null || model.NewPassword != model.NewPassordConfirmation)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (result.Succeeded == false)
            {
                return BadRequest();
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("/account/getHours/{id}")]
        public OpeningHours getHours(string id)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (id != userId || !authenticated)
            {
                return null;
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return null;
            }

            var daysOfWeek = _db.DaysOfTheWeek.ToList();
            List<OpenHour> openingHours = new List<OpenHour>();

            foreach (var day in daysOfWeek)
            {
                var userDay = _db.UsersHours.FirstOrDefault( x => x.DayId == day.Id && x.UserId == user.Id );
                if(userDay == null)
                {
                    openingHours.Add(
               new OpenHour
               {
                   Day = day.Name,
                   DayId = day.Id,
                   IsOpened = false,

               });
                }
                else
                {
               openingHours.Add(
               new OpenHour
               {
                   Day = day.Name,
                   DayId = day.Id,
                   IsOpened = userDay.IsOpened,
                   From = userDay.From,
                   To = userDay.To,
               });
              }
            }

            OpeningHours model = new OpeningHours
            {
                Hours = openingHours,
                UserId = user.Id,
            };

            return model;
        }

        [Authorize]
        [HttpPost("/account/changeHours")]
        public IActionResult ChangeHours([FromBody]OpenHour model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            var oldHour = _db.UsersHours.FirstOrDefault(x => x.UserId == user.Id && x.DayId == model.DayId);

            if(oldHour != null)
            {
                _db.UsersHours.Remove(oldHour);
                _db.SaveChanges();
            }

            UsersHours newHour = new UsersHours
            {

                Id = Guid.NewGuid().ToString(),
                DayId = model.DayId,
                IsOpened = model.IsOpened,
                UserId = model.UserId,
                From = model.From,
                To = model.To,
            };

           _db.UsersHours.Add(newHour);

           _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpGet("/account/subscriptionInfo/{id}")]
        public SubscriptionDetails SubscriptionInfo(string id)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (id != userId || !authenticated)
            {
                return null;
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return null;
            }

            var methods = _db.PaymentMethods.Where(x => x.Country == user.Country).ToList();
            List<PaymentMethod> list = new List<PaymentMethod>();
            foreach (var method in methods)
            {
                list.Add(new PaymentMethod { Name = method.Name, PhoneNumber = method.PhoneNumber });
            }

            SubscriptionDetails model = new SubscriptionDetails
            {
                Methods = list,
                Amount = methods[0].Amount,
                From = user.SubscriptionStart.ToString("dd/MM/yyyy"),
                To = user.SubscriptionEnd.ToString("dd/MM/yyyy"),
                PaymentCode = user.MoneyCode,
                UserId = user.Id,

            };

            return model;
        }

        [Authorize]
        [HttpGet("/account/aboutBusiness/{id}")]
        public AboutBusiness AboutBusiness(string id)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (id != userId || !authenticated)
            {
                return null;
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return null;
            }

            AboutBusiness model = new AboutBusiness
            {
                Text = user.BusinessDescription,
                UserId = user.Id,
            };

            return model;
        }

        [Authorize]
        [HttpPost("/account/aboutBusiness")]
        public IActionResult AboutBusiness([FromBody]AboutBusiness model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            user.BusinessDescription = model.Text;
            _db.Users.Update(user);
            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpGet("/account/synopsis/{id}")]
        public Synopsis Synopsis(string id)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (id != userId || !authenticated)
            {
                return null;
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return null;
            }

            var appAmenities = _db.Amenities.ToList();
            List<BizService> list = new List<BizService>();

            foreach (var am in appAmenities)
            {
                if (!_db.UsersAmenities.Any(x => x.AmenitieId == am.Id && x.UserId == user.Id))
                {
                    list.Add(new BizService {  Name = am.FrenchName, Checked = false, AmenitieId = am.Id });
                }
                else
                {
                    list.Add(new BizService {  Name = am.FrenchName, Checked = true, AmenitieId = am.Id });
                }
            }

            Synopsis model = new Synopsis { UserId = user.Id, Services = list };

            return model;
        }


        [Authorize]
        [HttpPost("/account/synopsis")]
        public IActionResult Synopsis([FromBody]Synopsis model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            var amenities = _db.UsersAmenities.Where(x => x.UserId == user.Id).ToList();

            foreach (var am in amenities)
            {
                _db.UsersAmenities.Remove(am);
                _db.SaveChanges();
            }

            foreach (var am in model.Services)
            {
               
                if (am.Checked)
                {
                    var amenitie = _db.Amenities.Find(am.AmenitieId);
                    _db.UsersAmenities.Add(new UsersAmenities { Id = Guid.NewGuid().ToString(), IsChecked = am.Checked, AmenitieId = amenitie.Id, UserId = user.Id });
                    _db.SaveChanges();
                }
               
            }

            return Ok();
        }


        [Authorize]
        [HttpGet("/account/verify/{id}")]
        public bool Verification(string id)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (id != userId || !authenticated)
            {
                return false;
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return false;
            }
            if(!user.BusinessVerified && _db.Verifications.Any( x => x.UserId == user.Id))
            {
                return true;
            }

            return user.BusinessVerified;

        }

        [Authorize]
        [HttpGet("/account/deleteAccount/{id}")]
        public IActionResult DeleteAccount(string id)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;
            var user = _db.Users.Find(id);

            if(user == null)
            {
                return NotFound();
            }

            if(!authenticated || user.Id != userId)
            {
                return BadRequest();
            }

            if(user.ProfileType == 1)
            {
               var reviews =  _db.Reviews.Where(x => x.AuthorId == user.Id).ToList();
              
                foreach (var item in reviews)
                {
                    var biz = _db.Users.Find(item.BusinessId);

                    if (biz != null)
                    {
                        var pics = _db.ReviewsImages.Where(x => x.ReviewId == item.Id).ToList();

                        foreach (var item1 in pics)
                        {
                            Tools.DeleteImageProduction(item1.Name);

                            _db.ReviewsImages.Remove(item1);

                            _db.SaveChanges();
                        }

                        biz.TotalReviewsCount = biz.TotalReviewsCount - 1;
                        var totalRate = biz.TotalRatingCount - item.Rating;
                        biz.TotalRatingCount = totalRate;
                        biz.Rating = totalRate / biz.TotalReviewsCount;
                       
                        _db.Users.Update(biz);

                        _db.SaveChanges();

                        _db.Reviews.Remove(item);

                        _db.SaveChanges();
                    }
                   
                }
                
                string profilePicName = $"pfp-{user.Id}.jpg";
                if (_db.Photos.Any( x => x.PhotoName == profilePicName))
                {
                    Tools.DeleteImageProduction(profilePicName);
                }
            
                _db.Users.Remove(user);

                _db.SaveChanges();

                return Ok();

            }

            if(user.ProfileType == 2)
            {
                var reviews = _db.Reviews.Where( x => x.BusinessId == user.Id ).ToList();
                var hours = _db.UsersHours.Where( x => x.UserId == user.Id).ToList();
                var amenities = _db.UsersAmenities.Where( x => x.UserId == user.Id).ToList();
                var reports = _db.Reports.Where( x => x.AuthorId == user.Id || x.BizId == user.Id).ToList();
                var verifications = _db.Verifications.Where( x => x.UserId == user.Id).ToList();
                var photos = _db.Photos.Where( x => x.UserId == user.Id).ToList();

                foreach (var item in reviews)
                {
                   
                        var pics = _db.ReviewsImages.Where(x => x.ReviewId == item.Id).ToList();

                        foreach (var item1 in pics)
                        {
                        
                           Tools.DeleteImageProduction(item1.Name);
                       
                          _db.ReviewsImages.Remove(item1);

                           _db.SaveChanges();
                        }

                        _db.Reviews.Remove(item);

                        _db.SaveChanges();

                }

                foreach (var item in hours)
                {
                    _db.UsersHours.Remove(item);

                    _db.SaveChanges();

                }

                foreach (var item in amenities)
                {
                    _db.UsersAmenities.Remove(item);

                    _db.SaveChanges();

                }

                foreach (var item in reports)
                {
                    _db.Reports.Remove(item);

                    _db.SaveChanges();

                }

                foreach (var item in verifications)
                {
                    _db.Verifications.Remove(item);

                    _db.SaveChanges();

                }

                foreach (var item in photos)
                {
                    Tools.DeleteImageProduction(item.PhotoName);

                    _db.Photos.Remove(item);

                    _db.SaveChanges();

                }

                string profilePicName = $"pfp-{user.Id}.jpg";
                if (_db.Photos.Any(x => x.PhotoName == profilePicName))
                {
                    Tools.DeleteImageProduction(profilePicName);
                }

                _db.Users.Remove(user);

                _db.SaveChanges();

                return Ok();

            }

            return BadRequest();
        }

        //[Authorize]
        //[HttpPost("/account/verify")]
        //public IActionResult Verification([FromForm]Verify model)
        //{

        //    var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
        //    var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

        //    if(model == null)
        //    {
        //        return BadRequest();
        //    }

        //    if (model.IdCard == null || model.LegalDocument == null)
        //    {
        //        return BadRequest();
        //    }

        //    if (model.UserId != userId || !authenticated)
        //    {
        //        return BadRequest();
        //    }

        //    var user = _db.Users.Find(userId);
        //    if (user == null)
        //    {
        //        return BadRequest();
        //    }

        //    var idCard = Tools.ConvertFile(model.IdCard, $"ID-CARD-{user.BusinessName.ToUpper()}");
        //    var document = Tools.ConvertFile(model.LegalDocument, $"LEGAL-DOCUMENT-{user.BusinessName.ToUpper()}");

        //    _db.Verifications.Add(new Verification {
        //        Id = Guid.NewGuid().ToString(),
        //        Date = Tools.GetLocalTime(user.TimeZone),
        //        Extension = idCard.Extension,
        //        File = idCard.File,
        //        Name = idCard.Name,
        //        Size = idCard.Size,
        //        UserId = user.Id,

        //    });

        //    _db.SaveChanges();

        //    _db.Verifications.Add(new Verification
        //    {
        //        Id = Guid.NewGuid().ToString(),
        //        Date = Tools.GetLocalTime(user.TimeZone),
        //        Extension = document.Extension,
        //        File = document.File,
        //        Name = document.Name,
        //        Size = document.Size,
        //        UserId = user.Id,

        //    });

        //    _db.SaveChanges();

        //    return Ok();

        //}






        //take total number of certified users divided by 10.
        //[HttpGet("/getPages")]
        //public double GetNumb()
        //{
        //    double users = Convert.ToDouble(104);//_db.Users.Where(x => x.Certified === true).ToList().Count();
        //    double result = users / 10;
        //    double pages = Math.Ceiling(result);
        //    return pages;
        //}

        //take 10 Certified users from each request.
        //[HttpGet("/getUsers")]
        //public IEnumerable<ApplicationUser>  GetUsers(int skip)
        //{
        //    return _db.Users.Where( x => x.BusinessVerified == true).Skip(skip).Take(10);
        //}

        [HttpGet("/getRandomCode")]
        public int GenerateCode()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random();
            return _rdm.Next(_min, _max);
        }

    }
}