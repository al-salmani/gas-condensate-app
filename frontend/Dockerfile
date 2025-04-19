
# المرحلة الأولى: بناء تطبيق Angular
FROM node:18-alpine as build

WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ ملفات المشروع
COPY . .

# تنفيذ البناء للإنتاج
RUN npm run build

# المرحلة الثانية: تشغيل الناتج باستخدام NGINX
FROM nginx:alpine

# نسخ ملفات Angular النهائية إلى مجلد nginx
COPY --from=build /app/dist/gas-condensate-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# فتح المنفذ 4200
EXPOSE 4200

# الأمر الافتراضي لتشغيل NGINX
CMD ["nginx", "-g", "daemon off;"]
