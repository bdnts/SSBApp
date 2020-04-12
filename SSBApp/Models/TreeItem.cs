
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SSBApp.Models
{
    public class TreeItem
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int? ParentIdValue { get; set; }
        public bool HasChildren { get; set; }
        public string Page { get; set; }
        public bool Expanded { get; set; }
    }
}
