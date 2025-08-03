# ใช้ Node.js LTS บน Alpine (ขนาดเล็ก ประหยัดทรัพยากร)
FROM node:lts-alpine

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ dependency ไปก่อน (เพื่อให้ layer นี้ cache ได้)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โปรเจกต์ที่เหลือเข้าไป
COPY . .

# เปิดพอร์ต 5000 สำหรับ backend
EXPOSE 5000

# รันเซิร์ฟเวอร์
CMD ["npm","run","dev"]
