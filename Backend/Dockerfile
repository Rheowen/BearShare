# ใช้ Node.js base image
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json ไปใน container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ต
EXPOSE 5000

# รันแอป
CMD ["npm", "run", "dev"]
