/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-benefit block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Cards-Benefit")
 * - Row 2-N: One row per benefit card with [image | title + description + optional CTA] (2 columns)
 *
 * Source HTML Patterns (two variants):
 *
 * Variant A: div.ws10-m-module-hifi (Benefits of Vodafone section)
 *   > div.__w-content
 *     > div.__content
 *       > div.__item (per benefit card)
 *         > div.__icon (optional icon/image)
 *         > div.__title (benefit name)
 *         > div.__text (description + optional link)
 *
 * Variant B: div.ws10-m-addons (Choose Your Plan section)
 *   > div (container)
 *     > div.ws10-c-card-addons (per addon card)
 *       > div.__box
 *         > div.__icon img (icon)
 *         > div.__title (card title)
 *         > div.__paragraph (description)
 *       > a (CTA link)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which variant we're parsing
  const isModuleHifi = element.classList.contains('ws10-m-module-hifi') ||
                       element.querySelector('.ws10-m-module-hifi__item');
  const isAddons = element.classList.contains('ws10-m-addons') ||
                   element.querySelector('.ws10-c-card-addons');

  if (isModuleHifi) {
    // Variant A: module-hifi items
    // VALIDATED: .ws10-m-module-hifi__item found in captured DOM (4 items)
    const items = element.querySelectorAll('.ws10-m-module-hifi__item');

    items.forEach((item) => {
      // Column 1: Icon/image
      const iconEl = item.querySelector('.ws10-m-module-hifi__icon img') ||
                     item.querySelector('img');
      const imageCell = document.createElement('div');
      if (iconEl) {
        imageCell.appendChild(iconEl.cloneNode(true));
      }

      // Column 2: Title + description + optional CTA
      const contentCell = document.createElement('div');

      // Title
      // VALIDATED: .ws10-m-module-hifi__title found in DOM
      const titleEl = item.querySelector('.ws10-m-module-hifi__title');
      if (titleEl) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        const titleP = document.createElement('p');
        titleP.appendChild(strong);
        contentCell.appendChild(titleP);
      }

      // Description text
      // VALIDATED: .ws10-m-module-hifi__text found in DOM
      const textEl = item.querySelector('.ws10-m-module-hifi__text');
      if (textEl) {
        // Get text content excluding link text
        const textContent = textEl.cloneNode(true);
        const linkInText = textContent.querySelector('a');
        let descText = '';
        if (linkInText) {
          linkInText.remove();
          descText = textContent.textContent.trim();
        } else {
          descText = textContent.textContent.trim();
        }
        if (descText) {
          const descP = document.createElement('p');
          descP.textContent = descText;
          contentCell.appendChild(descP);
        }
      }

      // CTA link (optional)
      // VALIDATED: Some module-hifi items have links (e.g., "Descubre cómo")
      const linkEl = item.querySelector('a');
      if (linkEl) {
        const href = linkEl.getAttribute('href') || '';
        const text = linkEl.textContent.trim();
        if (href && text) {
          const ctaP = document.createElement('p');
          const a = document.createElement('a');
          a.href = href;
          a.textContent = text;
          ctaP.appendChild(a);
          contentCell.appendChild(ctaP);
        }
      }

      cells.push([imageCell, contentCell]);
    });
  } else if (isAddons) {
    // Variant B: addon cards
    // VALIDATED: .ws10-c-card-addons found in captured DOM (3 cards)
    const cards = element.querySelectorAll('.ws10-c-card-addons');

    cards.forEach((card) => {
      // Column 1: Icon/image
      const iconEl = card.querySelector('.ws10-c-card-addons__icon img') ||
                     card.querySelector('img');
      const imageCell = document.createElement('div');
      if (iconEl) {
        imageCell.appendChild(iconEl.cloneNode(true));
      }

      // Column 2: Title + description + CTA
      const contentCell = document.createElement('div');

      // Title
      // VALIDATED: .ws10-c-card-addons__title found in DOM
      const titleEl = card.querySelector('.ws10-c-card-addons__title');
      if (titleEl) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        const titleP = document.createElement('p');
        titleP.appendChild(strong);
        contentCell.appendChild(titleP);
      }

      // Description
      // VALIDATED: .ws10-c-card-addons__paragraph found in DOM
      const paraEl = card.querySelector('.ws10-c-card-addons__paragraph');
      if (paraEl) {
        const descP = document.createElement('p');
        descP.textContent = paraEl.textContent.trim();
        contentCell.appendChild(descP);
      }

      // CTA link
      // VALIDATED: a elements found in addon cards
      const linkEl = card.querySelector('a');
      if (linkEl) {
        const href = linkEl.getAttribute('href') || '';
        const text = linkEl.textContent.trim();
        if (href && text) {
          const ctaP = document.createElement('p');
          const a = document.createElement('a');
          a.href = href;
          a.textContent = text;
          ctaP.appendChild(a);
          contentCell.appendChild(ctaP);
        }
      }

      cells.push([imageCell, contentCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Benefit', cells });
  element.replaceWith(block);
}
