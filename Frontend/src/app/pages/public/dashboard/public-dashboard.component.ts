import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { ArticleService, Article } from '../../../core/services/article.service';

@Component({
  selector: 'app-public-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, CarouselModule, TagModule, AccordionModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-6">📚 Nền tảng Luyện thi Công chức</h1>
            <p class="text-xl mb-8 text-blue-100">Học tập thông minh, ôn luyện hiệu quả, đạt kết quả cao</p>
            <div class="flex gap-4 justify-center flex-wrap">
              <p-button label="Luyện thi miễn phí" icon="pi pi-play" severity="secondary" size="large" routerLink="/dashboard"></p-button>
              <p-button label="Đăng ký ngay" icon="pi pi-user-plus" severity="secondary" size="large" [outlined]="true" routerLink="/register"></p-button>
              <p-button label="Đăng nhập" icon="pi pi-user-plus" severity="secondary" size="large" [outlined]="true" routerLink="/login"></p-button>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center p-6 bg-blue-50 rounded-lg">
              <div class="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div class="text-gray-600">Câu hỏi</div>
            </div>
            <div class="text-center p-6 bg-green-50 rounded-lg">
              <div class="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div class="text-gray-600">Đề thi</div>
            </div>
            <div class="text-center p-6 bg-purple-50 rounded-lg">
              <div class="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div class="text-gray-600">Khóa học</div>
            </div>
            <div class="text-center p-6 bg-orange-50 rounded-lg">
              <div class="text-4xl font-bold text-orange-600 mb-2">5,000+</div>
              <div class="text-gray-600">Học viên</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hot News Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">🔥 Tin tức nổi bật</h2>
            <p class="text-gray-600">Cập nhật thông tin mới nhất về tuyển dụng và ôn thi</p>
          </div>

          @if (hotNews.length > 0) {
            <p-carousel [value]="hotNews" [numVisible]="3" [numScroll]="1" [circular]="true" [autoplayInterval]="5000" [responsiveOptions]="carouselResponsiveOptions">
              <ng-template let-article pTemplate="item">
                <div class="p-4">
                  <p-card class="h-full hover:shadow-xl transition-shadow cursor-pointer">
                    @if (article.coverImage) {
                      <ng-template pTemplate="header">
                        <img [src]="article.coverImage" [alt]="article.title" class="w-full h-48 object-cover" />
                      </ng-template>
                    }
                    <div class="space-y-3">
                      <p-tag [value]="article.type" severity="info"></p-tag>
                      <h3 class="text-xl font-bold text-gray-800 line-clamp-2">{{ article.title }}</h3>
                      <p class="text-gray-600 line-clamp-3">{{ article.excerpt }}</p>
                      <div class="flex items-center justify-between text-sm text-gray-500">
                        <span><i class="pi pi-eye mr-1"></i>{{ article.viewCount }} lượt xem</span>
                        <span>{{ article.publishedAt | date: 'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                    <ng-template pTemplate="footer">
                      <p-button label="Đọc thêm" icon="pi pi-arrow-right" [text]="true" [routerLink]="['/articles', article.slug]"></p-button>
                    </ng-template>
                  </p-card>
                </div>
              </ng-template>
            </p-carousel>
          }
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">✨ Tính năng nổi bật</h2>
            <p class="text-gray-600">Những gì chúng tôi mang lại cho bạn</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6">
              <div class="text-5xl mb-4">📝</div>
              <h3 class="text-xl font-bold mb-3">Kho câu hỏi phong phú</h3>
              <p class="text-gray-600">Hơn 10,000 câu hỏi được phân loại theo chuyên ngành và độ khó</p>
            </div>

            <div class="text-center p-6">
              <div class="text-5xl mb-4">🎯</div>
              <h3 class="text-xl font-bold mb-3">Luyện thi thực chiến</h3>
              <p class="text-gray-600">Đề thi mô phỏng 100% theo cấu trúc đề thi thật</p>
            </div>

            <div class="text-center p-6">
              <div class="text-5xl mb-4">📊</div>
              <h3 class="text-xl font-bold mb-3">Theo dõi tiến độ</h3>
              <p class="text-gray-600">Dashboard chi tiết giúp bạn nắm rõ quá trình học tập</p>
            </div>

            <div class="text-center p-6">
              <div class="text-5xl mb-4">👨‍🏫</div>
              <h3 class="text-xl font-bold mb-3">Giảng viên chất lượng</h3>
              <p class="text-gray-600">Đội ngũ giảng viên giàu kinh nghiệm, nhiệt tình</p>
            </div>

            <div class="text-center p-6">
              <div class="text-5xl mb-4">💡</div>
              <h3 class="text-xl font-bold mb-3">Kinh nghiệm ôn thi</h3>
              <p class="text-gray-600">Chia sẻ từ những người đã đỗ kỳ thi</p>
            </div>

            <div class="text-center p-6">
              <div class="text-5xl mb-4">🎓</div>
              <h3 class="text-xl font-bold mb-3">Chứng chỉ hoàn thành</h3>
              <p class="text-gray-600">Nhận chứng chỉ sau khi hoàn thành khóa học</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">❓ Câu hỏi thường gặp</h2>
            <p class="text-gray-600">Những thắc mắc phổ biến của học viên</p>
          </div>

          <p-accordion [multiple]="true">
            <p-accordionTab header="Làm thế nào để bắt đầu học?">
              <p class="text-gray-600">
                Bạn có thể bắt đầu bằng cách đăng ký tài khoản miễn phí, sau đó chọn khóa học phù hợp với mục tiêu của mình. Chúng tôi cũng cung cấp các bài thi thử miễn phí để bạn trải nghiệm.
              </p>
            </p-accordionTab>

            <p-accordionTab header="Chi phí học tập như thế nào?">
              <p class="text-gray-600">Chúng tôi có nhiều gói học phù hợp với mọi nhu cầu. Bạn có thể học thử miễn phí hoặc đăng ký các gói Premium để truy cập đầy đủ tài liệu và đề thi.</p>
            </p-accordionTab>

            <p-accordionTab header="Tôi có thể học trên điện thoại không?">
              <p class="text-gray-600">Có, nền tảng của chúng tôi được tối ưu hóa cho mọi thiết bị. Bạn có thể học mọi lúc, mọi nơi trên điện thoại, máy tính bảng hoặc máy tính.</p>
            </p-accordionTab>

            <p-accordionTab header="Làm sao để theo dõi tiến độ học tập?">
              <p class="text-gray-600">Sau khi đăng nhập, bạn sẽ có dashboard cá nhân hiển thị chi tiết về số bài đã làm, điểm số, thời gian học và các thống kê khác.</p>
            </p-accordionTab>
          </p-accordion>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h2>
          <p class="text-xl mb-8 text-blue-100">Tham gia cùng hàng nghìn học viên đang ôn thi thành công</p>
          <div class="flex gap-4 justify-center flex-wrap">
            <p-button label="Đăng ký miễn phí" icon="pi pi-user-plus" severity="secondary" size="large" routerLink="/register"></p-button>
            <p-button label="Xem khóa học" icon="pi pi-book" severity="secondary" size="large" [outlined]="true" routerLink="/customer-dashboard"></p-button>
          </div>
        </div>
      </section>
    </div>
  `
})
export class PublicDashboardComponent implements OnInit {
  private articleService = inject(ArticleService);

  hotNews: Article[] = [];
  loading = false;

  carouselResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit(): void {
    this.loadHotNews();
  }

  loadHotNews(): void {
    this.loading = true;
    this.articleService.getHotNews().subscribe({
      next: (data) => {
        this.hotNews = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Use mock data if API fails
        this.hotNews = this.getMockNews();
      }
    });
  }

  private getMockNews(): Article[] {
    return [
      {
        id: '1',
        title: 'Thông báo tuyển dụng công chức năm 2025',
        slug: 'tuyen-dung-cong-chuc-2025',
        content: '',
        excerpt: 'Kế hoạch tuyển dụng công chức các bộ, ngành năm 2025 đã được công bố...',
        type: 'HOT_NEWS',
        status: 'PUBLISHED',
        authorId: '1',
        viewCount: 1250,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Kinh nghiệm ôn thi từ thủ khoa',
        slug: 'kinh-nghiem-on-thi-thu-khoa',
        content: '',
        excerpt: 'Chia sẻ phương pháp học tập hiệu quả từ thủ khoa kỳ thi công chức...',
        type: 'EXPERIENCE',
        status: 'PUBLISHED',
        authorId: '1',
        viewCount: 890,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Cập nhật đề thi mới nhất',
        slug: 'cap-nhat-de-thi-moi-nhat',
        content: '',
        excerpt: 'Bộ đề thi mô phỏng mới nhất đã được cập nhật vào hệ thống...',
        type: 'NEWS',
        status: 'PUBLISHED',
        authorId: '1',
        viewCount: 650,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
