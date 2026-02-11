/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-promo block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: carousel
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Carousel-Promo")
 * - Row 2-N: One row per slide with [image | content] (2 columns)
 *
 * Source HTML Pattern:
 * section.ws10-m-cards-discovery-standard-medium-price
 *   > div.ws10-c-carousel
 *     > ul.ws10-c-carousel__list
 *       > li.ws10-c-carousel__list-element (per slide)
 *         > section.ws10-c-card-discovery-standard-medium-price
 *           > div.__content (pill badge, title h2/h3, text, price)
 *           > div.__w-cta (buttons/links)
 *           > picture > img (hero image)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all carousel slides
  // VALIDATED: .ws10-c-carousel__list-element found in captured DOM (3 instances)
  const slides = element.querySelectorAll('.ws10-c-carousel__list-element');

  slides.forEach((slide) => {
    // Each slide becomes a row with 2 columns: [image, content]
    const card = slide.querySelector('.ws10-c-card-discovery-standard-medium-price') || slide;

    // Column 1: Image
    // VALIDATED: picture > img found inside each slide in captured DOM
    const picture = card.querySelector('picture');
    const img = card.querySelector('img');
    const imageCell = document.createElement('div');
    if (picture) {
      imageCell.appendChild(picture.cloneNode(true));
    } else if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Column 2: Content (badge, title, subtitle, price, CTAs)
    const contentCell = document.createElement('div');

    // Badge/pill
    // VALIDATED: .ws10-c-pill found in carousel slides
    const pill = card.querySelector('.ws10-c-pill');
    if (pill) {
      const pillText = document.createElement('p');
      pillText.textContent = pill.textContent.trim();
      contentCell.appendChild(pillText);
    }

    // Title
    // VALIDATED: h2 and h3 found inside .ws10-c-card-discovery-standard-medium-price__content
    const title = card.querySelector('h2, h3');
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title.textContent.trim();
      const headingP = document.createElement('p');
      headingP.appendChild(heading);
      contentCell.appendChild(headingP);
    }

    // Description text
    // VALIDATED: .ws10-c-card-discovery-standard-medium-price__text found in DOM
    const desc = card.querySelector('[class*="__text"]');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      contentCell.appendChild(descP);
    }

    // Price
    // VALIDATED: .ws10-c-price with __amount and __recurrence found in DOM
    const priceEl = card.querySelector('.ws10-c-price');
    if (priceEl) {
      const amount = priceEl.querySelector('.ws10-c-price__amount');
      const recurrence = priceEl.querySelector('.ws10-c-price__recurrence');
      const priceText = priceEl.querySelector('.ws10-c-price__text');
      const priceP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = amount ? amount.textContent.trim() : '';
      priceP.appendChild(strong);
      if (recurrence) {
        priceP.appendChild(document.createTextNode(recurrence.textContent.trim()));
      }
      contentCell.appendChild(priceP);

      if (priceText) {
        const noteP = document.createElement('p');
        const noteStrong = document.createElement('strong');
        noteStrong.textContent = priceText.textContent.trim();
        noteP.appendChild(noteStrong);
        contentCell.appendChild(noteP);
      }
    }

    // CTA buttons/links
    // VALIDATED: a tags inside .ws10-c-card-discovery-standard-medium-price (6 links, 2 per slide)
    const ctaContainer = card.querySelector('[class*="__w-cta"]');
    const ctas = ctaContainer
      ? ctaContainer.querySelectorAll('a')
      : card.querySelectorAll('a[class*="button"]');
    if (ctas.length > 0) {
      const ctaP = document.createElement('p');
      ctas.forEach((cta, i) => {
        if (i > 0) ctaP.appendChild(document.createTextNode(' '));
        const link = document.createElement('a');
        link.href = cta.getAttribute('href') || '';
        link.textContent = cta.textContent.trim();
        ctaP.appendChild(link);
      });
      contentCell.appendChild(ctaP);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Promo', cells });
  element.replaceWith(block);
}
