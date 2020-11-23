using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NiceWixApp.Data;
using NiceWixApp.Models;
using NiceWixApp.Services;
using NiceWixApp.ViewModels;

namespace NiceWixApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private IWebHostEnvironment Environment;
        private readonly IHttpContextAccessor _http;
        public ReviewController(
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


        [Authorize]
        [HttpPost("/review/postReview1")]
        public IActionResult Post1([FromForm]PostReviewWithFiles model)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";

            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (model.AuthorId != userId || !authenticated)
            {
                return BadRequest();
            }

            var biz = _db.Users.Find(model.BusinessId);
            var author = _db.Users.Find(userId);

            if (biz == null || author == null)
            {
                return BadRequest();
            }

            biz.TotalReviewsCount = biz.TotalReviewsCount + 1;
            var totalRate = biz.TotalRatingCount + model.Rating;
            biz.TotalRatingCount = totalRate;
            biz.Rating = totalRate / biz.TotalReviewsCount;

            Review review = new Review
            {
                AuthorId = author.Id,
                Id = Guid.NewGuid().ToString(),
                BusinessId = biz.Id,
                Date = Tools.GetLocalTime(biz.TimeZone),
                Rating = model.Rating,
                Text = model.Text,
                City = biz.City,
            };

            string contentPath = Environment.ContentRootPath;

            if (model.Image1 != null)
            {
                ReviewImage image = new ReviewImage
                {
                    AuthorId = review.AuthorId,
                    BusinessId = review.BusinessId,
                    Id = Guid.NewGuid().ToString(),
                    ReviewId = review.Id,
                    
                };

                string fileName = $"yaillo-review-{image.Id}.jpg";

                image.imageUrl = Tools.SaveImageProduction(model.Image1, fileName);
                image.Name = fileName;

                _db.ReviewsImages.Add(image);

                _db.SaveChanges();
            }

            if (model.Image2 != null)
            {
                ReviewImage image = new ReviewImage
                {
                    AuthorId = review.AuthorId,
                    BusinessId = review.BusinessId,
                    Id = Guid.NewGuid().ToString(),
                    ReviewId = review.Id
                };

                string fileName = $"yaillo-review-{image.Id}.jpg";

                image.imageUrl = Tools.SaveImageProduction(model.Image1, fileName);
                image.Name = fileName;

                _db.ReviewsImages.Add(image);

                _db.SaveChanges();
            }

            _db.Reviews.Add(review);
            _db.SaveChanges();
            _db.Users.Update(biz);
            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpPost("/review/postReview2")]
        public IActionResult Post2([FromBody]PostReviewWithoutFiles model)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";

            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (model.AuthorId != userId || !authenticated)
            {
                return BadRequest();
            }

            var biz = _db.Users.Find(model.BusinessId);
            var author = _db.Users.Find(userId);

            if (biz == null || author == null)
            {
                return BadRequest();
            }

            biz.TotalReviewsCount = biz.TotalReviewsCount + 1;
            var totalRate = biz.TotalRatingCount + model.Rating;
            biz.TotalRatingCount = totalRate;
            biz.Rating = totalRate / biz.TotalReviewsCount;

            Review review = new Review
            {
                AuthorId = author.Id,
                Id = Guid.NewGuid().ToString(),
                BusinessId = biz.Id,
                Date = Tools.GetLocalTime(biz.TimeZone),
                Rating = model.Rating,
                Text = model.Text,
                City = biz.City,
                 
            };

            _db.Reviews.Add(review);
            _db.SaveChanges();
            _db.Users.Update(biz);
            _db.SaveChanges();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("/review/getSingle/{reviewId}")]
        public ReviewViewModel GetSingle(string reviewId)
        {
            if (reviewId == null)
            {
                return null;
            }
            var review = _db.Reviews.Find(reviewId);

            if (review == null)
            {
                return null;
            }
            var pics = _db.ReviewsImages.Where(x => x.ReviewId == review.Id).ToList();
            List<string> list = new List<string>();
            foreach (var pic in pics)
            {
                list.Add(pic.imageUrl);
            }


            string authorName = "Anonyme";
            string authorProfilePic = "";
            if (_db.Users.Any(x => x.Id == review.AuthorId))
            {
                var author = _db.Users.Find(review.AuthorId);
                authorName = $"{author.FirstName} {author.LastName}";
                authorProfilePic = author.ProfilePictureUrl;
            }
            var biz = _db.Users.Find(review.BusinessId);
            if (biz == null)
            {
                return null;
            }

            ReviewViewModel model = new ReviewViewModel
            {
                AuthorId = review.AuthorId,
                AuthorName = authorName,
                AuthorProfileUrl = authorProfilePic,
                Date = Tools.GetTime(review.Date, biz.TimeZone),
                Id = review.Id,
                PicturesUrls = list,
                Rating = review.Rating,
                Text = review.Text,

            };

            return model;
        }

        [HttpGet("/review/moreReviews/{bizId}/{skip}")]
        public List<ReviewViewModel> MoreReviews(string bizId, int skip)
        {

            List<ReviewViewModel> model = new List<ReviewViewModel>();

            var biz = _db.Users.Find(bizId);
            var reviews = _db.Reviews.Where(x => x.BusinessId == biz.Id).OrderByDescending(x => x.Date).Skip(skip).Take(12).ToList();
            if(reviews.Count() == 0)
            {
                return model;
            }
            foreach (var item in reviews)
            {
                var author = _db.Users.Find(item.AuthorId);
                if (author != null)
                {
                    var pics = _db.ReviewsImages.Where(x => x.AuthorId == author.Id && x.ReviewId == item.Id).Select(x => x.imageUrl).ToList();

                    model.Add(new ReviewViewModel
                    {
                        AuthorId = item.AuthorId,
                        AuthorName = $"{author.FirstName} {author.LastName}",
                        Date = Tools.GetTime(item.Date, biz.TimeZone),
                        Rating = item.Rating,
                        AuthorProfileUrl = author.ProfilePictureUrl,
                        Id = item.Id,
                        PicturesUrls = pics,
                        Text = item.Text
                    });

                }

            }

            return model;
        }

        [HttpGet("/review/getLocal/{city}/{skip}")]
        public List<ReviewViewModel> GetLocal(string city, int skip)
        {
            List<ReviewViewModel> model = new List<ReviewViewModel>();

            var reviews = _db.Reviews.Where(x => x.City.ToLower() == city.ToLower() ).OrderByDescending(x => x.Date).Skip(skip).Take(16).ToList();
            if (reviews.Count() == 0)
            {
                return model;
            }
            foreach (var item in reviews)
            {
                var author = _db.Users.Find(item.AuthorId);
                if (author != null)
                {
                    var pics = _db.ReviewsImages.Where(x => x.AuthorId == author.Id && x.ReviewId == item.Id).Select(x => x.imageUrl).ToList();

                    model.Add(new ReviewViewModel
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

            return model;
        }

        [Authorize]
        [HttpGet("/review/deleteReview/{reviewId}/{userId}")]
        public IActionResult Delete(string reviewId, string userId)
        {
            var id = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";

            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (reviewId == null)
            {
                return BadRequest();
            }

            if (id != userId|| !authenticated || !_db.Reviews.Any( x => x.Id == reviewId))
            {
                return BadRequest();
            }
            var owner = _db.Users.Find(userId);
            if (owner == null)
            {
                return BadRequest();
            }
            var review = _db.Reviews.Find(reviewId);
            if (review.AuthorId != owner.Id)
            {
                return BadRequest();
            }
            var biz = _db.Users.Find(review.BusinessId);
            if(biz == null || owner.Id != review.AuthorId)
            {
                return BadRequest();
            }
            biz.TotalReviewsCount = biz.TotalReviewsCount - 1;
            var totalRate = biz.TotalRatingCount - review.Rating;
            biz.TotalRatingCount = totalRate;
            biz.Rating =  totalRate / biz.TotalReviewsCount;
            var pics = _db.ReviewsImages.Where(x => x.ReviewId == review.Id).ToList();
            foreach (var item in pics)
            {
          
                 Tools.DeleteImageProduction(item.Name);
               
                _db.ReviewsImages.Remove(item);
                _db.SaveChanges();
            }
            _db.Users.Update(biz);
            _db.SaveChanges();
            _db.Reviews.Remove(review);
            _db.SaveChanges();
            return Ok();
           
        }

        [Authorize]
        [HttpPost("/review/reportReview")]
        public IActionResult ReportReview(ReportReview model)
        {
            var id = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";

            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (id != model.AuthorId || !authenticated || !_db.Reviews.Any(x => x.Id == model.ReviewId))
            {
                return BadRequest();
            }
            var owner = _db.Users.Find(model.AuthorId);
            if (owner == null)
            {
                return BadRequest();
            }

            if (!_db.Users.Any( x => x.Id == model.BizId))
            {
                return BadRequest();
            }

            Report report = new Report
            {
                AuthorId = owner.Id,
                Id = Guid.NewGuid().ToString(),
                BizId = model.BizId,
                ReviewId = model.ReviewId,
                IsAboutBiz = false,
                Degree = model.Reason == 1 ? 1 : 2,
                Reason = model.Reason,
                Date = Tools.GetLocalTime(owner.TimeZone),
            };

            _db.Reports.Add(report);

            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpPost("/review/reportPage")]
        public IActionResult ReportPage(ReportPage model)
        {
            var id = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";

            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return BadRequest();
            }

            if (id != model.AuthorId || !authenticated || !_db.Users.Any(x => x.Id == model.BizId))
            {
                return BadRequest();
            }
            var owner = _db.Users.Find(model.AuthorId);
            if (owner == null)
            {
                return BadRequest();
            }
            

            Report report = new Report
            {
                AuthorId = owner.Id,
                Id = Guid.NewGuid().ToString(),
                BizId = model.BizId,
                IsAboutBiz = true,
                Degree = model.Reason == 1 ? 1 : 2,
                Reason = model.Reason,
                Date = Tools.GetLocalTime(owner.TimeZone),
            };

            _db.Reports.Add(report);

            _db.SaveChanges();

            return Ok();

        }

    }
    }