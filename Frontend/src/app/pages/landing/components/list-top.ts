import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
        <div class="grid grid-cols-12 gap-4 justify-center">
            <div class="col-span-12 text-center mt-20 mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Tính năng nổi bật</div>
                <span class="text-muted-color text-2xl">Những điểm mạnh giúp giải đấu Pickleball của bạn tỏa sáng</span>
            </div>

            <!-- Feature 1 -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                    <div class="p-4 bg-white h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-users !text-2xl text-yellow-700"></i>
                        </div>
                        <h5 class="mb-2 text-gray-900">Giao diện dễ sử dụng</h5>
                        <span class="text-gray-600">Dành cho cả ban tổ chức lẫn vận động viên.</span>
                    </div>
                </div>
            </div>

            <!-- Feature 2 -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2))">
                    <div class="p-4 bg-white h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-palette !text-2xl text-cyan-700"></i>
                        </div>
                        <h5 class="mb-2 text-gray-900">Thiết kế hiện đại</h5>
                        <span class="text-gray-600">Thân thiện với mọi thiết bị.</span>
                    </div>
                </div>
            </div>

            <!-- Feature 3 -->
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2))">
                    <div class="p-4 bg-white h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-map !text-2xl text-indigo-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-gray-900 text-xl font-semibold">Bảng xếp hạng trực tiếp</div>
                        <span class="text-gray-600">Cập nhật liên tục, minh bạch và dễ theo dõi.</span>
                    </div>
                </div>
            </div>

            <!-- Bạn có thể tiếp tục sửa các feature còn lại tương tự như trên -->

            <!-- Testimonial -->
            <div
                class="col-span-12 mt-20 mb-20 p-2 md:p-20"
                style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)"
            >
                <div class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
                    <div class="text-gray-900 mb-2 text-3xl font-semibold">Trần Minh Quân</div>
                    <span class="text-gray-600 text-2xl">Vận động viên Pickleball</span>
                    <p class="text-gray-900 text-2xl mt-6" style="max-width: 800px">
                        “Giao diện dễ nhìn, dễ sử dụng, kết quả được cập nhật cực kỳ nhanh chóng. Đây là nền tảng tổ chức giải đấu tốt nhất mà tôi từng trải nghiệm!”
                    </p>
                    <img src="https://primefaces.org/cdn/templates/sakai/landing/peak-logo.svg" class="mt-6" alt="Company logo" />
                </div>
            </div>
        </div>
    </div>
    `
})
export class FeaturesWidget {}