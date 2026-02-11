/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Cards-Category")
 * - Row 2-N: One row per category tile with [image | link text] (2 columns)
 *
 * Source HTML Pattern:
 * div.ws10-m-carousel-secondary
 *   > div.ws10-c-carousel
 *     > ul.ws10-c-carousel__list
 *       > li.ws10-c-carousel__list-element
 *         > a.ws10-c-image-strip-element (per category)
 *           > div (image container) > picture > img
 *           > div.__text (category name)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all category items
  // VALIDATED: .ws10-c-image-strip-element found in captured DOM (7 items)
  const items = element.querySelectorAll('.ws10-c-image-strip-element');

  items.forEach((item) => {
    // Column 1: Category image
    // VALIDATED: img found inside image-strip-element via Satellite blob URLs
    const img = item.querySelector('img');
    const imageCell = document.createElement('div');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Column 2: Category name with link
    // VALIDATED: .ws10-c-image-strip-element__text found in DOM
    const textEl = item.querySelector('.ws10-c-image-strip-element__text') ||
                   item.querySelector('[class*="__text"]');
    const contentCell = document.createElement('div');

    // The item itself is usually an <a> element
    const linkEl = item.tagName === 'A' ? item : item.querySelector('a');
    const href = linkEl ? (linkEl.getAttribute('href') || '') : '';
    const text = textEl ? textEl.textContent.trim() : (item.textContent.trim() || '');

    if (href && text) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      contentCell.appendChild(link);
    } else if (text) {
      contentCell.textContent = text;
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Category', cells });
  element.replaceWith(block);
}
