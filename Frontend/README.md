# 📚 Exam Preparation Platform - Frontend

Frontend cho nền tảng học tập và luyện thi công chức, được xây dựng với Angular 19, PrimeNG và Tailwind CSS.

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 18
- Angular CLI >= 19

### Các bước cài đặt

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy development server
npm start
# hoặc
ng serve
```

Ứng dụng sẽ chạy tại: `http://localhost:4200`

## 📁 Cấu trúc thư mục

```
Frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Core services, guards, interceptors
│   │   ├── shared/            # Shared components, directives, pipes
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── admin/         # Admin features
│   │   │   │   ├── articles/
│   │   │   │   ├── questions/
│   │   │   │   ├── exams/
│   │   │   │   └── categories/
│   │   │   ├── customer/      # Customer features
│   │   │   │   ├── exams/
│   │   │   │   ├── courses/
│   │   │   │   ├── materials/
│   │   │   │   └── consultation/
│   │   │   └── public/        # Public pages
│   │   └── layout/            # Layout components
│   ├── assets/                # Static assets
│   └── styles/                # Global styles
├── angular.json
├── tailwind.config.js
└── package.json
```

## 🎨 UI Components

Project sử dụng **PrimeNG** và **Tailwind CSS** cho UI:

### PrimeNG Components
- Table, DataView - Hiển thị danh sách
- Form Controls - Input, Dropdown, Calendar
- Dialog, Toast - Notifications
- Chart - Biểu đồ thống kê
- Menu, Breadcrumb - Navigation

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Custom theme với PrimeUI

## 🔐 Authentication

### Login Flow
1. User nhập phone và password
2. Gọi API `/api/auth/login`
3. Lưu JWT token vào localStorage
4. Redirect đến dashboard

### Protected Routes
```typescript
{
  path: 'admin',
  canActivate: [AuthGuard, AdminGuard],
  loadChildren: () => import('./features/admin/admin.module')
}
```

## 📱 Features

### 🏠 Public Pages (Không cần đăng nhập)
- **Trang chủ** - Giới thiệu, tin tức nổi bật
- **Bài viết** - Kinh nghiệm ôn thi, tin tức
- **Luyện thi thử** - Làm vài câu hỏi miễn phí
- **Khóa học** - Xem danh sách khóa học
- **Tài liệu** - Xem danh sách tài liệu
- **FAQ** - Câu hỏi thường gặp
- **Đăng ký tư vấn** - Form liên hệ

### 👨‍💼 Admin Dashboard
- **Quản lý bài viết** - CRUD articles, hot news
- **Quản lý câu hỏi** - Tạo kho câu hỏi theo danh mục
- **Quản lý đề thi** - Tạo bộ đề thi
- **Quản lý danh mục** - Master data categories
- **Quản lý FAQ** - CRUD FAQs
- **Quản lý tư vấn** - Xem và xử lý yêu cầu tư vấn
- **Thống kê** - Dashboard analytics

### 👨‍🎓 Customer Dashboard
- **Dashboard** - Thống kê học tập, tiến độ
- **Làm bài thi** - Thi thử, thi chính thức
- **Lịch sử thi** - Xem kết quả các lần thi
- **Khóa học của tôi** - Khóa học đã đăng ký
- **Tài liệu của tôi** - Tài liệu đã mua
- **Profile** - Quản lý thông tin cá nhân

## 🎯 Key Pages

### Admin - Quản lý câu hỏi
```
/admin/questions
- List questions với filter (category, difficulty, type)
- Create/Edit question form
- Preview question
- Bulk import từ Excel
```

### Admin - Quản lý đề thi
```
/admin/exams
- List exams
- Create exam wizard:
  1. Thông tin cơ bản
  2. Chọn câu hỏi
  3. Cấu hình (thời gian, điểm đỗ)
  4. Preview & Publish
```

### Customer - Làm bài thi
```
/exams/:id/take
- Timer countdown
- Question navigation
- Mark for review
- Submit confirmation
- Result page với detailed feedback
```

### Customer - Dashboard
```
/dashboard
- Study statistics (charts)
- Recent exam attempts
- Progress by category
- Recommended courses
- Hot news
```

## 🔧 Scripts

```bash
# Development
npm start                 # Start dev server
npm run watch            # Build with watch mode

# Build
npm run build            # Production build
npm run build:dev        # Development build

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Test with coverage

# Code Quality
npm run format           # Format code with Prettier
npm run lint             # Lint code
```

## 🎨 Styling

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        // ...
      }
    }
  },
  plugins: [require('tailwindcss-primeui')]
}
```

### PrimeNG Theme
```typescript
// angular.json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
  "src/styles.scss"
]
```

## 🌐 API Integration

### HTTP Interceptor
```typescript
// Tự động thêm JWT token vào headers
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

### API Service Example
```typescript
@Injectable()
export class ExamService {
  constructor(private http: HttpClient) {}

  getExams(params: any): Observable<Exam[]> {
    return this.http.get<Exam[]>('/api/exams', { params });
  }

  startExam(examId: string): Observable<ExamAttempt> {
    return this.http.post<ExamAttempt>(`/api/exams/${examId}/start`, {});
  }
}
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- PrimeNG responsive components
- Tailwind responsive utilities

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Hoặc push lên GitHub và kết nối với Vercel.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
