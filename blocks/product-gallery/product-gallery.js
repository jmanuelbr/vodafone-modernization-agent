import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const images = [];

  // Collect all images from block rows
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        images.push({
          src: img.src,
          alt: img.alt || '',
          picture: pic,
        });
      }
    }
  });

  if (images.length === 0) return;

  // Clear block
  block.textContent = '';

  // Create main image display
  const mainDisplay = document.createElement('div');
  mainDisplay.className = 'product-gallery-main';

  const mainPicture = createOptimizedPicture(images[0].src, images[0].alt, true, [{ width: '600' }]);
  mainDisplay.append(mainPicture);

  // Create thumbnail strip
  const thumbStrip = document.createElement('div');
  thumbStrip.className = 'product-gallery-thumbs';

  images.forEach((image, index) => {
    const thumb = document.createElement('button');
    thumb.className = 'product-gallery-thumb';
    if (index === 0) thumb.classList.add('active');
    thumb.setAttribute('aria-label', image.alt || `Product image ${index + 1}`);

    const thumbPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '150' }]);
    thumb.append(thumbPic);

    thumb.addEventListener('click', () => {
      // Update main image
      const newMain = createOptimizedPicture(image.src, image.alt, true, [{ width: '600' }]);
      mainDisplay.textContent = '';
      mainDisplay.append(newMain);

      // Update active thumb
      thumbStrip.querySelector('.active')?.classList.remove('active');
      thumb.classList.add('active');
    });

    thumbStrip.append(thumb);
  });

  block.append(mainDisplay, thumbStrip);
}
