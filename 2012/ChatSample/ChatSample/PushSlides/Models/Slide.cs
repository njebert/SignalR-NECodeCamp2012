using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace PushSlides.Models
{
    public class Slide
    {
        [Key]
        public int Id { get; set; }
        public string SlideTitle { get; set; }
        public string Content { get; set; }
    }
}