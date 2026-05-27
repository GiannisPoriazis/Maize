using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public class Module
{
    [Key]
    public short id { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public short price { get; set; }
}

public class ActiveModule
{
    [Key]
    public short module_id { get; set; }
    public short activated_by { get; set; }
}