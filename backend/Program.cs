using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// 1. إعداد سياسة CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("http://localhost:4200", "http://frontend:80")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var app = builder.Build();

// 🔁 Middleware يدوي (اختياري - يمكن حذفه بعد التأكد من عمل CORS)
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:4200");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.StatusCode = 204;
        return;
    }

    await next();
});

// ✅ الترتيب السليم لميدل وير CORS
app.UseRouting();

app.UseCors("AllowAngularApp"); // ✅ بعد UseRouting وقبل MapControllers

// app.UseAuthentication(); // إن وجدت
// app.UseAuthorization();  // إن وجدت

app.MapControllers();
app.Run();


// 2. إضافة الخدمات الأخرى مثل Controllers و Authentication وغيرها
builder.Services.AddControllers();
// مثال: builder.Services.AddAuthentication(...);
// مثال: builder.Services.AddAuthorization();


// Middleware يدوي مؤقت لحل المشكلة
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:4200");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.StatusCode = 204;
        return;
    }

    await next();
});
// 3. تفعيل البيئة التطويرية
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// 4. ترتيب الـ Middleware بشكل صحيح

// تفعيل CORS قبل أي شيء يستخدم الطلبات
app.UseCors("AllowAngularApp");

// إذا كنت تستخدم المصادقة
// app.UseAuthentication();

// إذا كنت تستخدم التفويض
// app.UseAuthorization();

app.UseRouting();

// تفعيل الـ Controllers
app.MapControllers();

app.Run();
