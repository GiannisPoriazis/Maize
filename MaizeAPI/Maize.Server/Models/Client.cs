using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class Client
{
    [Key]
    public short id { get; set; }

    [MaxLength(50)]
    public string? first_name { get; set; } = null!;

    [MaxLength(50)]
    public string? last_name { get; set; } = null!;

    public string? email { get; set; } = null!;

    [MaxLength(10)]
    public string? taxId { get; set; }

    [MaxLength(50)]
    public string? mobile_phone { get; set; }

    public string? birth_date { get; set; }
    public string? created_at { get; set; }
}

public class Client_Request
{
    public short? id { get; set; }

    public string? first_name { get; set; } = null!;

    public string? last_name { get; set; } = null!;

    public string? email { get; set; } = null!;

    public string? taxId { get; set; }

    public string? mobile_phone { get; set; }

    public string? birth_date { get; set; }
}

public class GetClientsLineChartData_Response
{
    public IEnumerable<GetClientsLineChartDataListItem> data { get; set; }
}

public class GetClientsLineChartDataListItem
{
    public string? key { get; set; }
    public int value { get; set; }
}
