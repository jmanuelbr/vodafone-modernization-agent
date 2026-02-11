/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-quicklink block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Cards-Quicklink")
 * - Row 2-N: One row per quicklink card with [image | link text] (2 columns)
 *
 * Source HTML Pattern:
 * section.ws10-m-banner-slim
 *   > div.ws10-c-banner-slim (per item)
 *     > span.ws10-c-banner-slim__icon (icon)
 *     > span.ws10-c-banner-slim__title (text)
 *     > a (link wrapping the item)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all banner items
  // VALIDATED: .ws10-c-banner-slim found in captured DOM
  const items = element.querySelectorAll('.ws10-c-banner-slim');

  // Fallback: if no .ws10-c-banner-slim items, try direct children links
  const targets = items.length > 0 ? items : element.querySelectorAll('a');

  targets.forEach((item) => {
    // Column 1: Icon image
    // VALIDATED: .ws10-c-banner-slim__icon contains icon markup
    const iconEl = item.querySelector('.ws10-c-banner-slim__icon img, .ws10-c-icon img, img');
    const imageCell = document.createElement('div');
    if (iconEl) {
      imageCell.appendChild(iconEl.cloneNode(true));
    }

    // Column 2: Link with title text
    // VALIDATED: .ws10-c-banner-slim__title found in DOM
    const titleEl = item.querySelector('.ws10-c-banner-slim__title');
    const linkEl = item.querySelector('a') || (item.tagName === 'A' ? item : null);
    const contentCell = document.createElement('div');

    if (linkEl) {
      const link = document.createElement('a');
      link.href = linkEl.getAttribute('href') || '';
      link.textContent = titleEl ? titleEl.textContent.trim() : linkEl.textContent.trim();
      contentCell.appendChild(link);
    } else if (titleEl) {
      contentCell.textContent = titleEl.textContent.trim();
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Quicklink', cells });
  element.replaceWith(block);
}
