#!/bin/bash

echo "Installing backend dependencies..."
cd backend
dotnet restore

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Starting backend..."
cd ../backend
dotnet run &
sleep 5

echo "Starting frontend..."
cd ../frontend
ng serve