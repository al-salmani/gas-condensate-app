namespace WebApiDemo
{
    public class CondensateField
    {
        public int Id { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int ProductionRate { get; set; }
        public decimal Cost { get; set; }
        public int YearOfExtraction { get; set; }
        public string MaintenanceType { get; set; } = string.Empty;
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Operator";
    }
}