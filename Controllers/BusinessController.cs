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
using System.Net;
using System.Globalization;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Text;

namespace NiceWixApp.Controllers
{

    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private IWebHostEnvironment Environment;
        private readonly IHttpContextAccessor _http;
        public BusinessController(
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
        [HttpPost("/business/ownedAlbum")]
        public OwnedAlbum OwnedPhotoAlbum([FromBody]GetAlbum model)
        {

            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (model == null)
            {
                return null;
            }

            if (model.UserId != userId || !authenticated)
            {
                return null;
            }

            var totalCount = _db.Photos.Where(x => x.UserId == model.UserId).ToList().Count();
            var converted = Convert.ToDouble(totalCount);
            double result = converted / 24;
            double pages = Math.Ceiling(result);
            var photos = _db.Photos.Where(x => x.UserId == model.UserId).Skip(model.Skip).Take(24);

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

        [Authorize]
        [HttpPost("/business/addPhoto")]
        public IActionResult AddPhoto([FromForm]AddPhoto model)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;


            if (model == null)
            {
                return BadRequest();
            }

            if (model.UserId != userId || !authenticated || model.Photo == null)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);
            if (user == null)
            {
                return BadRequest();
            }

            Photo photo = new Photo
            {
                Id = Guid.NewGuid().ToString(),
                Date = Tools.GetLocalTime(user.TimeZone),
                HasPrice = model.HasPrice,
                Price = model.HasPrice ? model.Price : null,
                Title = model.Title,
                UserId = user.Id
            };


            string fileName = $"yaillo-item-{photo.Id}.jpg";
           
            photo.Url = Tools.SaveImageProduction(model.Photo, fileName);
            photo.PhotoName = fileName;
            _db.Photos.Add(photo);

            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpPost("/business/editPhoto")]
        public IActionResult EditPhoto([FromBody]EditPhoto model)
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


            var photo = _db.Photos.Find(model.PhotoId);

            photo.Date = Tools.GetLocalTime(user.TimeZone);
           photo.HasPrice = model.HasPrice;
            photo.Price = model.HasPrice ? model.Price : null;
            photo.Title = model.Title;

            _db.Photos.Update(photo);

            _db.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpGet("/business/getInsight/{id}")]
        public GetInsight GetInsight(string id)
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

            GetInsight model = new GetInsight
            {
                ReviewsCount = Tools.GetRoundedNumber(Convert.ToInt64(user.TotalReviewsCount)),
                VisitCount = Tools.GetRoundedNumber(user.TotalVisitCount),

            };

            return model;
          
        }


        [Authorize]
        [HttpGet("/business/deletePhoto/{id}/{photoId}")]
        public IActionResult DeletePhoto(string id, string photoId)
        {
            var userId = _http.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "00000000-0000-0000-0000-000000000000";
            var authenticated = _http.HttpContext.User.Identity.IsAuthenticated;

            if (id != userId || !authenticated)
            {
                return BadRequest();
            }

            var user = _db.Users.Find(userId);

            if (user == null)
            {
                return BadRequest();
            }

            var photo = _db.Photos.Find(photoId);

            if (photo == null)
            {
                return BadRequest();
            }

            Tools.DeleteImageProduction(photo.PhotoName);

            _db.Photos.Remove(photo);

            _db.SaveChanges();

            return Ok();
        }
    }
}