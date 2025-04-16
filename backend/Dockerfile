FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .

RUN dotnet restore ./WebApiDemo.csproj
RUN dotnet publish ./WebApiDemo.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 5000
ENTRYPOINT ["dotnet", "WebApiDemo.dll"]
