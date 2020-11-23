using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace NiceWixApp.Services
{
    public static class Tools
    {
        public static DateTime GetLocalTime(string timezone)
        {
            DateTime serverTime = DateTime.Now;

            DateTime _localTime = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(serverTime, TimeZoneInfo.Local.Id, timezone);

            return _localTime;
        }

        public static DateTime GetLocalOpening(string timezone, DateTime date)
        {
           
            DateTime _time = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, TimeZoneInfo.Local.Id, timezone);

            return _time;
        }

        public static string GetTime(DateTime date, string zone)
        {

            var time = GetLocalTime(zone);

            var span = time - date;

            string Time = "A l'instant.";
            var min = 60 + span.Minutes;

            if (min == 1 && time.Date == date.Date)
            {
                Time = $"A l'instant.";
                return Time;
            }

            if (min <= 59 && time.Date == date.Date)
            {
                Time = $"il y'a {min} minutes.";
                return Time;
            }

            if (min > 59 && time.Date == date.Date)
            {
                string hour = $"{date.Hour}";
                string minutes = $"{date.Minute}";
                if (date.Hour < 10)
                {
                    hour = $"0{date.Hour}";
                }
                if (date.Minute < 10)
                {
                    minutes = $"0{date.Minute}";
                }
                Time = $"Aujourdh'hui, à {hour}:{minutes}";
                return Time;
            }

            if (span.Days < 2 && (time.Day - 1) == date.Day)
            {
                string hour = $"{date.Hour}";
                string minutes = $"{date.Minute}";
                if (date.Hour < 10)
                {
                    hour = $"0{date.Hour}";
                }
                if (date.Minute < 10)
                {
                    minutes = $"0{date.Minute}";
                }

                Time = $"Hier, à {hour}:{minutes}";
                return Time;
            }

            if (span.Days >= 2 || span.Days < 2 && (time.Day - 2) == date.Day)
            {

                string hour = $"{date.Hour}";
                string minutes = $"{date.Minute}";
                if (date.Hour < 10)
                {
                    hour = $"0{date.Hour}";
                }
                if (date.Minute < 10)
                {
                    minutes = $"0{date.Minute}";
                }

                Time = $"Le {date.Day}/{date.Month}/{date.Year}, à {hour}:{minutes}";


                return Time;
            }

            return Time;
        }


        public static string GetRoundedNumber(long number)
        {
            string result = "0";

            if (number < 1000) // 999
            {
                result = number.ToString();

                return result;
            }
            if (number >= 1000 && number < 10000) //9,9k
            {
                string no = number.ToString();

                string[] numberArray = new string[no.Length];
                int counter = 0;

                for (int i = 0; i < no.Length; i++)
                {
                    numberArray[i] = no.Substring(counter, 1);
                    counter++;
                }

                string num1 = numberArray[0];

                string num2 = numberArray[1];

                result = $"{num1},{num2}k";

                return result;
            }
            if (number >= 10000 && number < 100000) //99k
            {
                long num = takeNDigits(number, 2);

                result = $"{num}k";

                return result;
            }
            if (number >= 100000 && number < 1000000)//999k
            {
                long num = takeNDigits(number, 3);

                result = $"{num}k";

                return result;

            }

            if (number >= 1000000 && number < 10000000) // 9,9m
            {
                string no = number.ToString();

                string[] numberArray = new string[no.Length];
                int counter = 0;

                for (int i = 0; i < no.Length; i++)
                {
                    numberArray[i] = no.Substring(counter, 1);
                    counter++;
                }

                string num1 = numberArray[0];

                string num2 = numberArray[1];

                result = $"{num1},{num2}m";

                return result;


            }
            if (number >= 10000000 && number < 100000000)//99,9m
            {
                string no = number.ToString();

                string[] numberArray = new string[no.Length];
                int counter = 0;

                for (int i = 0; i < no.Length; i++)
                {
                    numberArray[i] = no.Substring(counter, 1); // 1 is split length
                    counter++;
                }

                string num1 = numberArray[0];

                string num2 = numberArray[1];

                string num3 = numberArray[2];

                result = $"{num1}{num2},{num3}m";

                return result;

            }

            return result;
        }

        public static string GetTimezone(string code)
        {
            var western = new string[] { "+221", "+223", "+224", "+225", "+226", "+228", "+233" };
            var central = new string[] { "+227", "+229", "+234", "+235", "+236", "+237", "+241", "+242", "+243", "+244" };
            var southern = new string[] { "+27", "+260", "+250", "+257" };
            var eastern = new string[] { "+251", "+254", "+255", "+256", "+261" };
            if (western.Any(x => x.Contains(code)))
            {
                return "Greenwich Standard Time";
            }
            if (central.Any(x => x.Contains(code)))
            {
                return "W. Central Africa Standard Time";
            }
            if (southern.Any(x => x.Contains(code)))
            {
                return "South Africa Standard Time";
            }
            if (eastern.Any(x => x.Contains(code)))
            {
                return "E. Africa Standard Time";
            }

            return null;
        }


        public static string SaveProfileImage(IFormFile file, string contentPath, string userId)
        {
           
            string base64;
            contentPath = $"{contentPath}\\media\\profiles\\user-{userId}.jpg";

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    base64 = Convert.ToBase64String(fileBytes);

                }


                byte[] bytes = Convert.FromBase64String(base64);

                using (var fileToCreate = new FileStream(contentPath, FileMode.Create))
                {
                    fileToCreate.Write(bytes, 0, bytes.Length);
                    fileToCreate.Flush();
                }
            }
            string baseUrl = "https://localhost:44309/media/profiles/";

            return $"{baseUrl}user-{userId}.jpg";
        }

        public static string SaveProduct(IFormFile file, string contentPath, string productId, int rank)
        {
            string base64;
            contentPath = $"{contentPath}\\media\\items\\{rank}-{productId}.jpg";

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    base64 = Convert.ToBase64String(fileBytes);

                }


                byte[] bytes = Convert.FromBase64String(base64);

                using (var fileToCreate = new FileStream(contentPath, FileMode.Create))
                {
                    fileToCreate.Write(bytes, 0, bytes.Length);
                    fileToCreate.Flush();
                }
            }
            string baseUrl = "https://localhost:44309/media/items/";

            return $"{baseUrl}{rank}-{productId}.jpg";
        }

        public static string SaveIdCard(IFormFile file, string contentPath, string mediaId, string CardSide)
        {
            string base64;
            contentPath = $"{contentPath}\\media\\cards\\{CardSide}-{mediaId}.jpg";

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    base64 = Convert.ToBase64String(fileBytes);

                }


                byte[] bytes = Convert.FromBase64String(base64);

                using (var fileToCreate = new FileStream(contentPath, FileMode.Create))
                {
                    fileToCreate.Write(bytes, 0, bytes.Length);
                    fileToCreate.Flush();
                }
            }
            string baseUrl = "https://localhost:44309/media/cards/";

            return $"{baseUrl}{CardSide}-{mediaId}.jpg";
        }

        
        public static string GetOpeningStatus(string startTime, string EndTime, string nextDayStartTime, string timezone, bool isOpenToday, bool isOpenNow, bool nextDayIsOpened)
        {
            
          
            if (isOpenToday)
            {
                var LocalNow = GetLocalTime(timezone);
                var startHour = new string(startTime.Take(2).ToArray());
                var startMinutes = startTime.Substring(startTime.Length - 2);
                var endHour = new string(EndTime.Take(2).ToArray());
                var endMinutes = EndTime.Substring(EndTime.Length - 2);
                var startDate = new DateTime(LocalNow.Year, LocalNow.Month, LocalNow.Day, Convert.ToInt32(startHour), Convert.ToInt32(startMinutes),0);
                var endDate = new DateTime(LocalNow.Year, LocalNow.Month, LocalNow.Day, Convert.ToInt32(endHour), Convert.ToInt32(endMinutes), 0);
                var LocalOpening = GetLocalOpening(timezone, startDate);
                var LocalClosing = GetLocalOpening(timezone, endDate);

                if(isOpenNow)
                {
                    if (LocalOpening < LocalClosing && LocalOpening < LocalNow && LocalNow < LocalClosing)//opened now all day.
                    {
                        return $"Ouvert jusqu'à {EndTime}";
                    }
                    if (LocalOpening > LocalClosing && LocalNow > LocalOpening && LocalNow < LocalClosing)// opened now overnight
                    {
                        return $"Ouvert jusqu'à {EndTime}";
                    }
                }

                if (LocalOpening < LocalClosing && LocalOpening > LocalNow && LocalNow < LocalClosing || LocalOpening > LocalClosing && LocalOpening > LocalNow )// open this morning or in the evening.
                {
                    return $"Ouvre aujourdhui à {startTime}";
                }

                if (LocalOpening < LocalClosing && LocalNow > LocalClosing && nextDayIsOpened || LocalOpening > LocalClosing && LocalNow > LocalClosing && nextDayIsOpened)// open tomorrow.
                {
                    return $"Ouvre demain à {startTime}";
                }
                if (LocalOpening < LocalClosing  && LocalNow > LocalClosing && !nextDayIsOpened || LocalOpening > LocalClosing && LocalNow > LocalClosing && !nextDayIsOpened)
                {
                    return $"Fermé demain.";
                }
                else
                {
                    return $"Fermé jusqu'à {nextDayStartTime}";
                }
            }
            else
            {
                if (nextDayIsOpened)
                {

                    return $"Fermé jusqu'à demain, {nextDayStartTime}";
                }
                else
                {
                    return $"Fermé aujourdhui et demain.";
                }
            }

        }

        public static FileConverted ConvertFile(IFormFile uploadedFile, string fileName)
        {

            byte[] file = null;

            string extension = "null";
           

            if (uploadedFile != null)
            {

                FileInfo info = new FileInfo(uploadedFile.FileName);


                extension = info.Extension;

                MemoryStream ms = new MemoryStream();

                uploadedFile.OpenReadStream().CopyTo(ms);

                file = ms.ToArray();


            }

            string FileSize = FormatSize(file.Length);

            FileConverted doc = new FileConverted
            {
                Name = fileName,
                File = file,
                Size = FileSize,
                Extension = extension,
            };
            return doc;
        }

        private static string FormatSize(int bytes)
        {

            string[] suffixes =
            { "Bytes", "KB", "MB", "GB", "TB", "PB" };

            int counter = 0;
            decimal number = (decimal)bytes;
            while (Math.Round(number / 1024) >= 1)
            {
                number = number / 1024;
                counter++;
            }
            return string.Format("{0:n1}{1}", number, suffixes[counter]);
        }

  
        private static long takeNDigits(long number, int N)
        {
           
            number = Math.Abs(number);
        
            if (number == 0)
                return number;
          
            int numberOfDigits = (int)Math.Floor(Math.Log10(number) + 1);
     
            if (numberOfDigits >= N)
                return (int)Math.Truncate((number / Math.Pow(10, numberOfDigits - N)));
            else
                return number;
        }

        public static string SaveImageProduction(IFormFile file, string fileName)
        {
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://st6808.ispot.cc/" + fileName);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential("yailloadmin20@st6808.ispot.cc", "$AjT28Dc");

            string base64 = null;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();
                base64 = Convert.ToBase64String(fileBytes);

            }


            byte[] bytes = Convert.FromBase64String(base64);
            request.ContentLength = bytes.Length;

            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(bytes, 0, bytes.Length);
            }

            using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
            {
                Console.WriteLine($"Upload File Complete, status {response.StatusDescription}");
            }

            string baseUrl = "http://st6808.ispot.cc/media/";

            return $"{baseUrl}{fileName}";
        }

        public static void DeleteImageProduction(string fileName)
        {

            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://st6808.ispot.cc/" + fileName);
            request.Method = WebRequestMethods.Ftp.DeleteFile;
            request.Credentials = new NetworkCredential("yailloadmin20@st6808.ispot.cc", "$AjT28Dc");

            var response = (FtpWebResponse)request.GetResponse();

        }

        public class FileConverted
        {
            public string Name { get; set; }
            public string Size { get; set; }
            public string Extension { get; set; }
            public byte[] File { get; set; }
        }


    }
}
