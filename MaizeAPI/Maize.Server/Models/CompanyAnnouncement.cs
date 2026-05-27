using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public class CompanyAnnouncement
{
    [Key]
    public short id { get; set; }

    public string title { get; set; }

    public string data { get; set; }

    [MaxLength(50)]
    public string created_at { get; set; }

    public short author_id { get; set; }
}

public class CompanyAnnouncement_Request
{
    public short? id { get; set; }

    public string? title { get; set; }

    public string? data { get; set; }

    public string? created_at { get; set; }

    public short? author_id { get; set; }
}

public class UpdateUserAnnouncements
{
    public short userId { get; set; }
    public short companyAnnouncementId { get; set; }
}