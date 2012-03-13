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
        [Required]
        public string SlideTitle { get; set; }
        public string SlideContent { get; set; }
        public int Presentation_Id { get; set; }
    }
}