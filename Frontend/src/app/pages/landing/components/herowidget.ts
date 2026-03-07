import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'hero-widget',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  template: `
    <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden">
      <div class="mx-6 md:mx-20 mt-0 md:mt-6">
        <img src="assets/images/banner.webp" alt="Banner" />
      </div>
      <div class="mx-6 md:mx-20 mt-0 md:mt-6 justify-content-center flex flex-col items-center">
        <p-button>Xem Thêm</p-button>
      </div>
      <div class="mx-6 md:mx-20 mt-0 md:mt-6"></div>
    </div>
  `
})
export class HeroWidget {}
