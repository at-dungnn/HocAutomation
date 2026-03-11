# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN - Linh thay đổi code

---

## MỤC LỤC

1. [Tổng quan Business](#1-tổng-quan-business)
2. [Hướng dẫn sử dụng cho ADMIN](#2-hướng-dẫn-sử-dụng-cho-admin)
3. [Hướng dẫn sử dụng cho Học viên](#3-hướng-dẫn-sử-dụng-cho-học-viên)

---

## 1. TỔNG QUAN BUSINESS

### 1.1 Giới thiệu hệ thống

Hệ thống Thi Trắc Nghiệm Trực Tuyến là nền tảng học tập và luyện thi được thiết kế để hỗ trợ học viên ôn luyện và kiểm tra kiến thức thông qua các bài thi trắc nghiệm. Hệ thống phù hợp cho các lĩnh vực:

- Thi tuyển công chức, viên chức
- Thi chứng chỉ ngân hàng
- Ôn thi đại học
- Đào tạo nội bộ doanh nghiệp

### 1.2 Đối tượng sử dụng

| Vai trò | Mô tả |
|---------|-------|
| **ADMIN** | Quản trị viên hệ thống, có toàn quyền quản lý nội dung và người dùng |
| **Học viên (CUSTOMER)** | Người dùng đăng ký tài khoản để làm bài thi và theo dõi kết quả |

### 1.3 Tính năng chính

#### Dành cho Admin:
- Quản lý danh mục (Categories)
- Quản lý khóa học (Courses)
- Quản lý ngân hàng câu hỏi (Questions)
- Quản lý bài thi (Exams)
- Quản lý bài viết/tin tức (Articles)

#### Dành cho Học viên:
- Đăng ký/Đăng nhập tài khoản
- Xem danh sách đề thi
- Làm bài thi trắc nghiệm
- Xem kết quả và lịch sử thi
- Quản lý thông tin cá nhân

### 1.4 Quy trình hoạt động

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUY TRÌNH ADMIN                          │
├─────────────────────────────────────────────────────────────────┤
│  1. Tạo Danh mục → 2. Tạo Khóa học → 3. Tạo Câu hỏi → 4. Tạo Đề thi  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      QUY TRÌNH HỌC VIÊN                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Đăng ký → 2. Đăng nhập → 3. Chọn đề thi → 4. Làm bài → 5. Xem kết quả │
└─────────────────────────────────────────────────────────────────┘
```

### 1.5 Cấu trúc dữ liệu

```
Danh mục (Category)
    └── Khóa học (Course)
            └── Câu hỏi (Question)
                    └── Bài thi (Exam) ← Bốc ngẫu nhiên từ ngân hàng câu hỏi
```

---

## 2. HƯỚNG DẪN SỬ DỤNG CHO ADMIN

### 2.1 Đăng nhập Admin

**Đường dẫn:** `/login`

**Các bước thực hiện:**
1. Truy cập trang đăng nhập
2. Nhập số điện thoại và mật khẩu
3. Nhấn nút "Đăng nhập"
4. Hệ thống tự động chuyển đến trang quản trị nếu tài khoản có quyền Admin

**Lưu ý:** Tài khoản Admin được tạo sẵn hoặc được cấp bởi quản trị viên cấp cao.

---

### 2.2 Trang chủ Admin (Dashboard)

**Đường dẫn:** `/admin`

**Mô tả:** Trang tổng quan hiển thị các menu quản lý chính.

**Các chức năng:**
| Menu | Mô tả | Đường dẫn |
|------|-------|-----------|
| Quản lý Danh mục | Tạo và quản lý các danh mục thi | `/admin/categories` |
| Quản lý Khóa học | Tạo và quản lý khóa học | `/admin/courses` |
| Ngân hàng Câu hỏi | Tạo và quản lý câu hỏi trắc nghiệm | `/admin/questions` |
| Quản lý Bài thi | Tạo và quản lý đề thi | `/admin/exams` |
| Quản lý Bài viết | Tạo và quản lý tin tức, bài viết | `/admin/articles` |

---

### 2.3 Quản lý Danh mục (Categories)

**Đường dẫn:** `/admin/categories`

**Mô tả:** Danh mục là cấp cao nhất để phân loại nội dung thi (VD: Luật, Ngân hàng, Hành chính công...)

#### 2.3.1 Xem danh sách danh mục

**Thông tin hiển thị:**
- STT
- Tên danh mục
- Loại (LAW, BANKING, PUBLIC_ADMINISTRATION, GENERAL_KNOWLEDGE, ENGLISH, IT, OTHER)
- Mô tả
- Trạng thái (Hoạt động/Tắt)
- Thao tác (Sửa, Bật/Tắt, Xóa)

#### 2.3.2 Tạo danh mục mới

**Các bước:**
1. Nhấn nút "Tạo danh mục"
2. Điền thông tin:
   - Tên danh mục (bắt buộc)
   - Loại danh mục (bắt buộc)
   - Mô tả (tùy chọn)
3. Nhấn "Lưu"

#### 2.3.3 Sửa danh mục

**Các bước:**
1. Nhấn icon bút chì (✏️) tại dòng cần sửa
2. Chỉnh sửa thông tin
3. Nhấn "Cập nhật"

#### 2.3.4 Bật/Tắt danh mục

- Nhấn icon mắt (👁️) để bật/tắt trạng thái hoạt động
- Danh mục bị tắt sẽ không hiển thị cho học viên

#### 2.3.5 Xóa danh mục

- Nhấn icon thùng rác (🗑️)
- Xác nhận xóa trong hộp thoại

**Lưu ý:** Không thể xóa danh mục đang có khóa học hoặc câu hỏi liên kết.

---

### 2.4 Quản lý Khóa học (Courses)

**Đường dẫn:** `/admin/courses`

**Mô tả:** Khóa học thuộc về một danh mục, dùng để nhóm các câu hỏi theo chủ đề cụ thể.

#### 2.4.1 Xem danh sách khóa học

**Thông tin hiển thị:**
- STT
- Tên khóa học
- Danh mục
- Mô tả
- Trạng thái
- Thao tác

#### 2.4.2 Tạo khóa học mới

**Các bước:**
1. Nhấn nút "Tạo khóa học"
2. Điền thông tin:
   - Tên khóa học (bắt buộc)
   - Chọn danh mục (bắt buộc)
   - Mô tả (tùy chọn)
3. Nhấn "Lưu"

#### 2.4.3 Sửa/Xóa khóa học

Tương tự như quản lý danh mục.

---

### 2.5 Ngân hàng Câu hỏi (Questions)

**Đường dẫn:** `/admin/questions`

**Mô tả:** Nơi lưu trữ tất cả câu hỏi trắc nghiệm. Câu hỏi được phân loại theo Danh mục và Khóa học.

#### 2.5.1 Xem danh sách câu hỏi

**Thông tin hiển thị:**
- STT
- Nội dung câu hỏi
- Đáp án 1, 2, 3, 4
- Đáp án đúng
- Độ khó (Dễ, Trung bình, Khó, Chuyên gia)
- Danh mục
- Thao tác

**Bộ lọc:**
- Lọc theo danh mục
- Lọc theo độ khó

#### 2.5.2 Tạo câu hỏi mới

**Các bước:**
1. Nhấn nút "Tạo câu hỏi"
2. Điền thông tin:
   - Chọn Danh mục (bắt buộc)
   - Chọn Khóa học (bắt buộc) - danh sách khóa học sẽ lọc theo danh mục đã chọn
   - Nội dung câu hỏi (bắt buộc)
   - Đáp án 1 (bắt buộc)
   - Đáp án 2 (bắt buộc)
   - Đáp án 3 (tùy chọn)
   - Đáp án 4 (tùy chọn)
   - Chọn đáp án đúng (1, 2, 3 hoặc 4)
   - Độ khó
   - Giải thích (tùy chọn)
3. Nhấn "Lưu"

#### 2.5.3 Sửa câu hỏi

1. Nhấn icon bút chì tại dòng cần sửa
2. Chỉnh sửa thông tin
3. Nhấn "Cập nhật"

#### 2.5.4 Xóa câu hỏi

- Nhấn icon thùng rác
- Xác nhận xóa

---

### 2.6 Quản lý Bài thi (Exams)

**Đường dẫn:** `/admin/exams`

**Mô tả:** Tạo và quản lý các đề thi. Đề thi sẽ bốc ngẫu nhiên câu hỏi từ ngân hàng câu hỏi theo danh mục và khóa học đã chọn.

#### 2.6.1 Xem danh sách bài thi

**Thông tin hiển thị:**
- STT
- Tên bài thi
- Danh mục
- Khóa học
- Loại (Luyện tập, Thi thử, Chính thức)
- Số câu hỏi
- Thời gian
- Điểm đậu
- Trạng thái (Hoạt động/Tắt)
- Công khai (Công khai/Riêng tư)
- Thao tác

**Bộ lọc:**
- Lọc theo danh mục
- Lọc theo loại bài thi

#### 2.6.2 Tạo bài thi mới

**Các bước:**
1. Nhấn nút "Tạo bài thi"
2. Điền thông tin:
   - Tên bài thi (bắt buộc)
   - Chọn Danh mục (bắt buộc)
   - Chọn Khóa học (tùy chọn - để trống sẽ lấy câu hỏi từ tất cả khóa học trong danh mục)
   - Loại bài thi: Luyện tập / Thi thử / Chính thức
   - Số câu hỏi (bắt buộc) - hệ thống hiển thị số câu hỏi có sẵn trong ngân hàng
   - Thời gian làm bài (phút)
   - Điểm đậu (%)
   - Mô tả (tùy chọn)
   - Hướng dẫn làm bài (tùy chọn)
   - Tùy chọn:
     - ☑️ Xáo trộn câu hỏi
     - ☑️ Công khai (miễn phí)
     - ☐ Premium
3. Nhấn "Tạo bài thi"

**Lưu ý quan trọng:**
- Số câu hỏi yêu cầu không được vượt quá số câu hỏi có sẵn trong ngân hàng
- Bài thi cần được đánh dấu "Công khai" để học viên có thể nhìn thấy
- Bài thi cần ở trạng thái "Hoạt động" để học viên có thể làm bài

#### 2.6.3 Các thao tác với bài thi

| Icon | Chức năng |
|------|-----------|
| ▶️ | Vào làm thử bài thi |
| ✏️ | Sửa thông tin bài thi |
| 👁️ | Bật/Tắt trạng thái hoạt động |
| 🔓/🔒 | Công khai/Riêng tư bài thi |
| 🗑️ | Xóa bài thi |

---

### 2.7 Quản lý Bài viết (Articles)

**Đường dẫn:** `/admin/articles`

**Mô tả:** Quản lý tin tức, bài viết, thông báo hiển thị trên trang chủ.

#### 2.7.1 Các loại bài viết

- NEWS: Tin tức
- HOT_NEWS: Tin nổi bật
- STUDY_TIPS: Mẹo học tập
- EXPERIENCE: Kinh nghiệm
- ANNOUNCEMENT: Thông báo

#### 2.7.2 Tạo bài viết

1. Nhấn "Tạo bài viết"
2. Điền thông tin:
   - Tiêu đề
   - Loại bài viết
   - Nội dung
   - Trạng thái (Nháp/Xuất bản)
3. Nhấn "Lưu"

---

## 3. HƯỚNG DẪN SỬ DỤNG CHO HỌC VIÊN

### 3.1 Đăng ký tài khoản

**Đường dẫn:** `/register`

**Các bước:**
1. Truy cập trang đăng ký
2. Điền thông tin:
   - Họ và tên
   - Số điện thoại
   - Email
   - Mật khẩu
   - Xác nhận mật khẩu
3. Nhấn "Đăng ký"
4. Đăng nhập với tài khoản vừa tạo

---

### 3.2 Đăng nhập

**Đường dẫn:** `/login`

**Các bước:**
1. Nhập số điện thoại
2. Nhập mật khẩu
3. Nhấn "Đăng nhập"

---

### 3.3 Trang chủ Học viên (Dashboard)

**Đường dẫn:** `/dashboard`

**Mô tả:** Trang chủ sau khi đăng nhập, hiển thị thông tin tổng quan và các đề thi nổi bật.

**Thanh điều hướng (Footer Navigation):**
| Tab | Mô tả | Đường dẫn |
|-----|-------|-----------|
| 🏠 Trang chủ | Trang chủ học viên | `/dashboard` |
| 📝 Đề thi | Danh sách tất cả đề thi | `/dashboard/exams` |
| 📜 Lịch sử | Lịch sử các bài thi đã làm | `/dashboard/history` |
| 👤 Tài khoản | Thông tin cá nhân | `/profile` |

---

### 3.4 Danh sách Đề thi

**Đường dẫn:** `/dashboard/exams`

**Mô tả:** Hiển thị tất cả đề thi công khai và đang hoạt động.

**Thông tin mỗi đề thi:**
- Tên đề thi
- Danh mục
- Loại (Luyện tập / Thi thử / Chính thức)
- Số câu hỏi
- Thời gian làm bài
- Điểm đậu
- Số lượt thi
- Điểm trung bình

**Bộ lọc:**
- Lọc theo danh mục

**Thao tác:**
- Nhấn "Vào thi" để bắt đầu làm bài

---

### 3.5 Làm bài thi

**Đường dẫn:** `/exam/:id`

**Mô tả:** Màn hình làm bài thi trắc nghiệm.

#### 3.5.1 Giao diện làm bài

**Header:**
- Tên bài thi
- Số câu đã trả lời / Tổng số câu
- Đồng hồ đếm ngược thời gian

**Khu vực câu hỏi:**
- Số thứ tự câu hỏi
- Nội dung câu hỏi
- Các đáp án A, B, C, D (click để chọn)
- Điểm của câu hỏi

**Thanh điều hướng câu hỏi (bên phải - desktop):**
- Danh sách số thứ tự các câu hỏi
- Màu xanh: Đã trả lời
- Màu xám: Chưa trả lời
- Màu xanh đậm: Câu đang xem

**Nút điều hướng:**
- "Câu trước" - Quay lại câu trước
- "Câu tiếp" - Chuyển sang câu tiếp theo
- "Nộp bài" - Nộp bài thi

#### 3.5.2 Cảnh báo thời gian

- **Màu xanh:** Còn nhiều thời gian
- **Màu vàng:** Còn dưới 5 phút
- **Màu đỏ nhấp nháy:** Còn dưới 1 phút

#### 3.5.3 Nộp bài

1. Nhấn nút "Nộp bài"
2. Hệ thống hiển thị xác nhận:
   - Số câu đã trả lời
   - Số câu chưa trả lời
3. Nhấn "Nộp bài" để xác nhận hoặc "Tiếp tục làm bài" để quay lại

**Lưu ý:** 
- Khi hết thời gian, bài thi sẽ tự động được nộp
- Không thể quay lại làm bài sau khi đã nộp

#### 3.5.4 Xem kết quả

Sau khi nộp bài, màn hình kết quả hiển thị:
- Trạng thái: ĐẬU / RỚT
- Điểm số (%)
- Điểm đậu yêu cầu
- Số câu đúng
- Số câu sai
- Số câu bỏ qua
- Thời gian làm bài

**Thao tác:**
- "Về trang chủ" - Quay về dashboard

---

### 3.6 Lịch sử thi

**Đường dẫn:** `/dashboard/history`

**Mô tả:** Xem lại tất cả các bài thi đã làm.

**Thông tin mỗi lần thi:**
- Tên bài thi
- Thời gian làm bài
- Trạng thái (Hoàn thành / Đang làm / Bỏ dở / Hết giờ)
- Điểm số
- Thời gian làm
- Kết quả (Đậu / Rớt)

**Phân trang:**
- Hiển thị 10 kết quả mỗi trang
- Nhấn "Xem thêm" để tải thêm

---

### 3.7 Thông tin tài khoản

**Đường dẫn:** `/profile`

**Mô tả:** Xem và cập nhật thông tin cá nhân.

**Thông tin hiển thị:**
- Họ và tên
- Email
- Số điện thoại
- Vai trò

**Thao tác:**
- Đăng xuất

---

## PHỤ LỤC

### A. Danh sách màn hình

| STT | Màn hình | Đường dẫn | Vai trò |
|-----|----------|-----------|---------|
| 1 | Trang chủ công khai | `/` | Tất cả |
| 2 | Đăng nhập | `/login` | Tất cả |
| 3 | Đăng ký | `/register` | Tất cả |
| 4 | Dashboard Admin | `/admin` | Admin |
| 5 | Quản lý Danh mục | `/admin/categories` | Admin |
| 6 | Quản lý Khóa học | `/admin/courses` | Admin |
| 7 | Ngân hàng Câu hỏi | `/admin/questions` | Admin |
| 8 | Quản lý Bài thi | `/admin/exams` | Admin |
| 9 | Quản lý Bài viết | `/admin/articles` | Admin |
| 10 | Dashboard Học viên | `/dashboard` | Học viên |
| 11 | Danh sách Đề thi | `/dashboard/exams` | Học viên |
| 12 | Làm bài thi | `/exam/:id` | Học viên |
| 13 | Lịch sử thi | `/dashboard/history` | Học viên |
| 14 | Thông tin tài khoản | `/profile` | Học viên |

### B. Loại danh mục (Category Types)

| Mã | Tên tiếng Việt |
|----|----------------|
| LAW | Luật |
| BANKING | Ngân hàng |
| PUBLIC_ADMINISTRATION | Hành chính công |
| GENERAL_KNOWLEDGE | Kiến thức chung |
| ENGLISH | Tiếng Anh |
| IT | Công nghệ thông tin |
| OTHER | Khác |

### C. Loại bài thi (Exam Types)

| Mã | Tên tiếng Việt | Mô tả |
|----|----------------|-------|
| PRACTICE | Luyện tập | Bài thi luyện tập, không giới hạn số lần |
| MOCK_EXAM | Thi thử | Bài thi thử, mô phỏng thi thật |
| OFFICIAL | Chính thức | Bài thi chính thức |

### D. Độ khó câu hỏi (Difficulty Levels)

| Mã | Tên tiếng Việt |
|----|----------------|
| EASY | Dễ |
| MEDIUM | Trung bình |
| HARD | Khó |
| EXPERT | Chuyên gia |

### E. Trạng thái bài thi (Attempt Status)

| Mã | Tên tiếng Việt |
|----|----------------|
| IN_PROGRESS | Đang làm |
| COMPLETED | Hoàn thành |
| ABANDONED | Bỏ dở |
| EXPIRED | Hết giờ |

---

## LIÊN HỆ HỖ TRỢ

*[Thông tin liên hệ sẽ được cập nhật]*

---

**Phiên bản tài liệu:** 1.0  
**Ngày cập nhật:** Tháng 12/2024
