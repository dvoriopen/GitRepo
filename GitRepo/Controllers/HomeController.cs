using GitRepo.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GitRepo.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SetSessionBookmarkItems(RepositoryItem repoItem)
        {
            string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            dynamic result = new ExpandoObject();
            try
            {
                List<RepositoryItem> repoList = null;
                if (Session["repo_bookmarkItems"] == null)
                {
                    repoList = new List<RepositoryItem>();
                    repoList.Add(repoItem);
                }
                else
                {
                    repoList = Session["repo_bookmarkItems"] as List<RepositoryItem>;
                    if (!repoList.Contains(repoItem))
                        repoList.Add(repoItem);
                }
                Session["repo_bookmarkItems"] = repoList;
                return CreateResult(result);
            }
            catch (Exception ex)
            {
                result.error = true;
                return CreateResult(result);
            }
        }

        [HttpGet]
        public ActionResult GetSessionBookmarkItems()
        {
            dynamic result = new ExpandoObject();
            try
            {
                result.res=Session["repo_bookmarkItems"];
                return CreateResult(result);
            }
            catch (Exception ex)
            {
                result.error = true;
                return CreateResult(result);
            }
        }

        public ActionResult CreateResult(object obj)
        {
            return Content(JsonConvert.SerializeObject(obj), "application/json");
        }

    }
}