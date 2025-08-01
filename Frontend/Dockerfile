#ใช้ NodeJs เวอร์ชัน LTS ที่เป็น Alpine ( ขนาดเล็ก )
FROM node:lts-alpine

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอก packagefles
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ที่เหลือ
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน 5173
EXPOSE 5173

# คำสั่งเริ่มต้น
CMD ["npm", "run", "dev"]