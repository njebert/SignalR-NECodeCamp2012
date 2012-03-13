using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PushSlides.Models;

namespace PushSlides.Controllers
{ 
    public class PresentationController : Controller
    {
        private PushSlidesContext db = new PushSlidesContext();

        //
        // GET: /Presentation/

        public ViewResult Index()
        {
            return View(db.Presentations.ToList());
        }

        //
        // GET: /Presentation/Details/5

        public ViewResult Details(int id)
        {
            Presentation presentation = db.Presentations.Find(id);
            presentation.Slides = db.Slides.Where(slide => slide.Presentation_Id == presentation.Id).ToArray();
            return View(presentation);
        }

        //
        // GET: /Presentation/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Presentation/Create

        [HttpPost]
        public ActionResult Create(Presentation presentation)
        {
            if (ModelState.IsValid)
            {
                db.Presentations.Add(presentation);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            return View(presentation);
        }
        
        //
        // GET: /Presentation/Edit/5
 
        public ActionResult Edit(int id)
        {
            Presentation presentation = db.Presentations.Find(id);
            return View(presentation);
        }

        //
        // POST: /Presentation/Edit/5

        [HttpPost]
        public ActionResult Edit(Presentation presentation)
        {
            if (ModelState.IsValid)
            {
                db.Entry(presentation).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(presentation);
        }

        //
        // GET: /Presentation/Delete/5
 
        public ActionResult Delete(int id)
        {
            Presentation presentation = db.Presentations.Find(id);
            return View(presentation);
        }

        //
        // POST: /Presentation/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {            
            Presentation presentation = db.Presentations.Find(id);
            db.Presentations.Remove(presentation);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}