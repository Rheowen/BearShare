#ใช้ NodeJs เวอร์ชัน LTS ที่เป็น Alpine ( ขนาดเล็ก )
FROM node:lts-alpine

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install 

# คัดลอกไฟล์ที่เหลือ
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน 5000
EXPOSE 5000

# คำสั่งเริ่มต้น
CMD ["npm", "run", "dev"]