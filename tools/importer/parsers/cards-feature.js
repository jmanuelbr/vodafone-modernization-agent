/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Cards-Feature")
 * - Row 2-N: One row per feature card with [image | title text] (2 columns)
 *
 * Source HTML Pattern:
 * section.ws10-m-mobile-pdp-one
 *   > div.__header (section heading)
 *   > div (wrapper)
 *     > div.ws10-c-product-detail (per feature)
 *       > div.__icon img (feature icon)
 *       > div.__text (feature title text)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all product detail items (feature cards)
  // VALIDATED: .ws10-c-product-detail found in captured DOM (3 items)
  const details = element.querySelectorAll('.ws10-c-product-detail');

  // Fallback: try other card-like structures
  const items = details.length > 0 ? details : element.querySelectorAll('[class*="product-detail"]');

  items.forEach((item) => {
    // Column 1: Feature icon/image
    // VALIDATED: img found inside product-detail elements
    const img = item.querySelector('img');
    const imageCell = document.createElement('div');
    if (img) {
      imageCell.appendChild(img.cloneNode(true));
    }

    // Column 2: Feature title text
    // VALIDATED: .ws10-c-product-detail__text found in DOM
    const textEl = item.querySelector('[class*="__text"]') ||
                   item.querySelector('p, span');
    const contentCell = document.createElement('div');
    if (textEl) {
      const p = document.createElement('p');
      p.textContent = textEl.textContent.trim();
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Feature', cells });
  element.replaceWith(block);
}
