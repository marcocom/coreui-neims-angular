import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PrimeNgContainerComponent, backgrounds } from './helpers';

import { CarouselModule } from 'primeng/carousel';

export default {
  title: 'Components/Carousel',
  decorators: [
    moduleMetadata({
      declarations: [PrimeNgContainerComponent],
      imports: [CarouselModule, BrowserAnimationsModule, FormsModule],
    }),
    componentWrapperDecorator(PrimeNgContainerComponent),
  ],
  parameters: {
    backgrounds,
  },
  args: {
    images: [
      { image: '/assets/images/login-bg.jpg' },
      { image: '/assets/images/login-bg.jpg' },
      { image: '/assets/images/login-bg.jpg' },
      { image: '/assets/images/login-bg.jpg' },
    ],
  },
} as Meta;

export const Basic: Story = (props) => ({
  props,
  template: `
    <style>
      .wrapper {
        width: 400px;
        height: 400px;
      }
    </style>

    <div class="wrapper">
      <p-carousel [value]="images"
        [numVisible]="1"
        [numScroll]="1">
        <ng-template let-image
          pTemplate="item">
          <img class="item-image"
            [src]="image.image">
        </ng-template>
      </p-carousel>
    </div>
  `,
});
