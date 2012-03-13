using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace PushSlides.Models
{
    public class PushSlidesContext : DbContext
    {
        public DbSet<Slide> Slides { get; set; }

        public DbSet<Presentation> Presentations { get; set; }
    }
}