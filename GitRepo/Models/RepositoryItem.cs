using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GitRepo.Models
{
    public class RepositoryItem
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string AvatarURL { get; set; }

        public RepositoryItem()
        {

        }

    }
}