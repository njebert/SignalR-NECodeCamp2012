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
    public class SlideController : Controller
    {
        private PushSlidesContext db = new PushSlidesContext();

        //
        // GET: /Slide/

        public ViewResult Index()
        {
            return View(db.Slides.ToList());
        }

        //
        // GET: /Slide/Details/5

        public ViewResult Details(int id)
        {
            Slide slide = db.Slides.Find(id);
            return View(slide);
        }

        //
        // GET: /Slide/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Slide/Create

        [HttpPost]
        public ActionResult Create(Slide slide)
        {
            if (ModelState.IsValid)
            {
                db.Slides.Add(slide);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            return View(slide);
        }
        
        //
        // GET: /Slide/Edit/5
 
        public ActionResult Edit(int id)
        {
            Slide slide = db.Slides.Find(id);
            return View(slide);
        }

        //
        // POST: /Slide/Edit/5

        [HttpPost]
        public ActionResult Edit(Slide slide)
        {
            if (ModelState.IsValid)
            {
                db.Entry(slide).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(slide);
        }

        //
        // GET: /Slide/Delete/5
 
        public ActionResult Delete(int id)
        {
            Slide slide = db.Slides.Find(id);
            return View(slide);
        }

        //
        // POST: /Slide/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {            
            Slide slide = db.Slides.Find(id);
            db.Slides.Remove(slide);
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