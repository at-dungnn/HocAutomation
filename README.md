# 📚 Nền tảng Học tập & Luyện thi Công chức

Một nền tảng **học tập và luyện thi trực tuyến** chuyên về pháp luật, ngân hàng và các kỳ thi tuyển công chức, giúp học viên ôn luyện hiệu quả và đạt kết quả cao.

---

## 🌟 Tổng quan dự án

Trong bối cảnh nhu cầu thi tuyển công chức, ngân hàng và các vị trí nhà nước ngày càng tăng cao, việc ôn tập có hệ thống và chất lượng là yếu tố then chốt.  
Dự án này ra đời với mục tiêu:

- Cung cấp **kho câu hỏi phong phú** theo từng chuyên ngành và cấp độ.
- Hỗ trợ **luyện thi thử** với đề thi mô phỏng thực tế.
- Tạo **trải nghiệm học tập cá nhân hóa** với dashboard theo dõi tiến độ.
- Kết nối **học viên và giảng viên** qua các khóa học và tư vấn trực tuyến.

---

## 🔑 Tính năng nổi bật

### 👨‍💼 Dành cho Admin
- 📝 **Quản lý nội dung**: Tạo và đăng bài viết, tin tức, kinh nghiệm ôn thi
- 📊 **Quản lý câu hỏi**: Tạo kho câu hỏi theo danh mục (Pháp luật, Ngân hàng, Hành chính...)
- 📋 **Quản lý đề thi**: Tạo bộ đề thi, cấu hình thời gian và độ khó
- 🗂️ **Master Data**: Quản lý danh mục, chủ đề, cấp độ câu hỏi
- ❓ **FAQ Management**: Quản lý câu hỏi thường gặp
- 🔥 **Hot News**: Đăng tin nóng về tuyển dụng, thay đổi quy định

### 👨‍🎓 Dành cho Học viên (Customer)
- 🎯 **Luyện thi miễn phí**: Làm thử vài câu hỏi không cần đăng nhập
- 📚 **Khóa học**: Đăng ký và tham gia các khóa học luyện thi
- 📝 **Làm đề thi**: Luyện tập với các bộ đề thi theo chuyên ngành
- 📈 **Theo dõi tiến độ**: Dashboard cá nhân hiển thị kết quả, điểm số, thống kê
- 💡 **Kinh nghiệm ôn thi**: Đọc bài viết chia sẻ từ người đã đỗ
- 📞 **Đăng ký tư vấn**: Liên hệ để được tư vấn lộ trình học tập
- 🛒 **Mua tài liệu**: Mua sách, tài liệu ôn thi chất lượng

---

## 🏗️ Kiến trúc hệ thống

Hệ thống được xây dựng với công nghệ hiện đại:

- **Frontend**: Angular 19 + PrimeNG + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Refresh Token
- **Cloud & DevOps**: Docker, Docker Compose

---

## 🚀 Cài đặt & Chạy thử

### Yêu cầu

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL

### ⚡ Quick Start - Backend

```bash
# Di chuyển vào thư mục Backend
cd Backend

# Cài đặt dependencies
npm install

# Khởi động database
npm run docker:up

# Setup database (tạo schema, migration, seed)
npm run db:setup

# Cấu hình môi trường local
npm run config:local

# Chạy development server
npm run dev
```

**Lưu ý**: Project này sử dụng schema `exam_prep` riêng biệt, có thể chạy song song với Shipping Service (schema `public`).

Xem chi tiết: [Backend/SETUP-GUIDE.md](Backend/SETUP-GUIDE.md)

### Cách chạy Frontend

```bash
# Di chuyển vào thư mục Frontend
cd Frontend

# Cài đặt dependencies
npm install

# Chạy development server
ng serve
```

Sau đó truy cập:

- **Web App**: http://localhost:4200
- **API Backend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

---

## 📈 Lợi ích

- **Học viên**: Ôn tập hiệu quả, tiết kiệm thời gian, nâng cao tỷ lệ đỗ
- **Giảng viên**: Dễ dàng quản lý học viên, theo dõi tiến độ
- **Tổ chức**: Tạo nguồn thu từ khóa học và tài liệu chất lượng

---

## 🤝 Đối tượng sử dụng

- **Học viên**: Người chuẩn bị thi công chức, ngân hàng, nhà nước
- **Giảng viên/Admin**: Người tạo nội dung, quản lý khóa học
- **Tổ chức đào tạo**: Trung tâm luyện thi, trường học

---

## 📌 Roadmap

- ✅ Database schema design (PostgreSQL với schema riêng)
- ✅ API specification (OpenAPI 3.0)
- ✅ Hệ thống đăng nhập/đăng ký
- ✅ Quản lý người dùng và phân quyền
- 🔄 Implement API handlers
- 🔄 Quản lý câu hỏi và đề thi
- 🔄 Dashboard học tập
- 📝 Hệ thống làm bài thi trực tuyến
- 📊 Thống kê và báo cáo
- 💳 Tích hợp thanh toán
- 📱 Phát triển Mobile App

---

## 🔄 Migration từ Shipping Service

Project này được chuyển đổi từ **Shipping Service Platform**. Xem chi tiết tại [MIGRATION-SUMMARY.md](MIGRATION-SUMMARY.md).

**Chạy song song**: Cả 2 projects có thể chạy cùng lúc trên cùng database PostgreSQL nhờ sử dụng schema riêng biệt:
- Shipping Service: schema `public`
- Exam Prep Platform: schema `exam_prep`
