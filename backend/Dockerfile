FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/build

FROM base AS final
WORKDIR /app
COPY --from=build /app/build .
COPY condensate.db ./condensate.db
ENTRYPOINT ["dotnet", "WebApiDemo.dll"]