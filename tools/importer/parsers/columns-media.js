/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: columns
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Columns-Media")
 * - Row 2: [text content with heading, description, price, CTA | media image] (2 columns)
 *
 * Source HTML Pattern:
 * section.ws10-m-header-section
 *   > div.__w (wrapper)
 *     > div.__i (inner)
 *       > div.__content (text side)
 *         > div.__content-text (heading, description)
 *         > div.__w-logos (streaming logos)
 *         > div.__price (price text)
 *         > div.__w-ctas (CTA links)
 *       > div.__content-image (image side)
 *         > div.__content-image-wrapper
 *           > img.__img
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Column 1: Text content
  const textCell = document.createElement('div');

  // Heading
  // VALIDATED: h2 "Vodafone TV" found inside ws10-m-header-section__content-text
  const heading = element.querySelector('.ws10-m-header-section__content-text h2') ||
                  element.querySelector('h2, h3');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.appendChild(h);
  }

  // Description text
  // VALIDATED: text content found in __content-text div
  const contentText = element.querySelector('.ws10-m-header-section__content-text');
  if (contentText) {
    const paragraphs = contentText.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text) {
        const para = document.createElement('p');
        para.textContent = text;
        textCell.appendChild(para);
      }
    });
  }

  // Streaming logos (optional)
  // VALIDATED: .ws10-m-header-section__w-logos with __logo img children
  const logosContainer = element.querySelector('.ws10-m-header-section__w-logos');
  if (logosContainer) {
    const logos = logosContainer.querySelectorAll('.ws10-m-header-section__logo img');
    if (logos.length > 0) {
      const logosDiv = document.createElement('div');
      logos.forEach((logo) => {
        logosDiv.appendChild(logo.cloneNode(true));
      });
      textCell.appendChild(logosDiv);
    }
  }

  // Price
  // VALIDATED: .ws10-m-header-section__price found with "Desde 5EUR/mes"
  const priceEl = element.querySelector('.ws10-m-header-section__price');
  if (priceEl) {
    const priceP = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = priceEl.textContent.trim();
    priceP.appendChild(strong);
    textCell.appendChild(priceP);
  }

  // CTA links
  // VALIDATED: a elements inside .ws10-m-header-section__w-ctas (1 CTA: "Descubre Vodafone TV")
  const ctaContainer = element.querySelector('.ws10-m-header-section__w-ctas');
  const ctas = ctaContainer
    ? ctaContainer.querySelectorAll('a')
    : element.querySelectorAll('a[class*="button"]');
  if (ctas.length > 0) {
    const ctaP = document.createElement('p');
    ctas.forEach((cta, i) => {
      if (i > 0) ctaP.appendChild(document.createTextNode(' '));
      const link = document.createElement('a');
      link.href = cta.getAttribute('href') || '';
      link.textContent = cta.textContent.trim();
      ctaP.appendChild(link);
    });
    textCell.appendChild(ctaP);
  }

  // Column 2: Media image
  // VALIDATED: .ws10-m-header-section__img found with src /c/statics/imagen/tv-mobile.jpg
  const imageCell = document.createElement('div');
  const mainImg = element.querySelector('.ws10-m-header-section__img') ||
                  element.querySelector('.ws10-m-header-section__content-image img');
  const picture = element.querySelector('.ws10-m-header-section__content-image picture');

  if (picture) {
    imageCell.appendChild(picture.cloneNode(true));
  } else if (mainImg) {
    imageCell.appendChild(mainImg.cloneNode(true));
  }

  cells.push([textCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Media', cells });
  element.replaceWith(block);
}
