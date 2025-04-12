# Gas Condensate Field Management System

This is a full-stack web application to manage gas condensate fields. The system is based on:

- **Backend**: ASP.NET Core Web API + SQLite + JWT
- **Frontend**: Angular + Auth + Routing + Leaflet + Chart.js
- **Deployment**: Docker-ready (customizable)

---

## 🔧 How to Run

### Prerequisites
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Node.js & Angular CLI](https://angular.io/cli)
- [SQLite](https://www.sqlite.org/index.html)
- (Optional) Docker

---

### 🚀 Backend

```bash
cd backend
dotnet restore
dotnet ef database update  # if migrations added
dotnet run
```

Runs on: `http://localhost:5000`

---

### 🌐 Frontend

```bash
cd frontend
npm install
ng serve
```

Runs on: `http://localhost:4200`

---

## 🧪 Default APIs

| Function             | Method | Endpoint                                 |
|----------------------|--------|------------------------------------------|
| Login                | POST   | /api/auth/login                          |
| Register             | POST   | /api/auth/register                       |
| Get All Fields       | GET    | /api/condensatefields                    |
| Manage Users         | GET    | /api/users                               |

---

## 👤 Roles & Permissions

- **Admin**: full access, user management
- **Engineer**: can edit maintenance type
- **Operator**: can update production rate only

---

## 🧱 Folder Structure

```
gas-condensate-app/
├── backend/
│   ├── Controllers/
│   ├── Models.cs
│   ├── Program.cs
│   └── WebApiDemo.csproj
├── frontend/
│   ├── src/app/
│   ├── angular.json
├── docker-compose.yml (optional)
```

---

## 📄 Author
Faisal Al Salmani – 2025