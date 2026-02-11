/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pricing block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Cards-Pricing")
 * - Row 2-N: One row per pricing card (single column with badge, price, features, CTAs)
 *
 * Source HTML Pattern:
 * div.ws10-m-card-rate-list
 *   > div (wrapper per card)
 *     > div.ws10-m-card-rate-simple
 *       > div.ws10-c-label-card (badge text, optional)
 *       > div.ws10-c-price (price amount, recurrence, text)
 *       > ul (feature list items)
 *       > div.__button > a (CTA links)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all rate cards
  // VALIDATED: .ws10-m-card-rate-simple found in captured DOM (4 cards)
  const cards = element.querySelectorAll('.ws10-m-card-rate-simple');

  cards.forEach((card) => {
    const contentCell = document.createElement('div');

    // Badge/label (e.g., "Tarifa exclusiva web", "Oferta especial -30%")
    // VALIDATED: .ws10-c-label-card found with __content and __outstanding children
    const labelCard = card.querySelector('.ws10-c-label-card');
    if (labelCard) {
      const outstanding = labelCard.querySelector('.ws10-c-label-card__outstanding');
      const labelContent = labelCard.querySelector('.ws10-c-label-card__content');

      if (outstanding) {
        const highlightP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = outstanding.textContent.trim();
        highlightP.appendChild(strong);
        contentCell.appendChild(highlightP);
      }

      if (labelContent) {
        const badgeP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = labelContent.textContent.trim();
        badgeP.appendChild(strong);
        contentCell.appendChild(badgeP);
      }
    }

    // Price
    // VALIDATED: .ws10-c-price with __amount, __recurrence, __text in DOM
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
        noteP.textContent = priceText.textContent.trim();
        contentCell.appendChild(noteP);
      }
    }

    // Feature list
    // VALIDATED: ul > li structure found inside card-rate-simple
    const featureList = card.querySelector('ul');
    if (featureList) {
      const ul = document.createElement('ul');
      const listItems = featureList.querySelectorAll('li');
      listItems.forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        ul.appendChild(newLi);
      });
      contentCell.appendChild(ul);
    }

    // CTA links
    // VALIDATED: a tags found inside card-rate-simple (2 per card)
    const ctas = card.querySelectorAll('a[class*="button"], .ws10-m-card-rate-simple__button a, a');
    const seenHrefs = new Set();
    if (ctas.length > 0) {
      const ctaP = document.createElement('p');
      let addedCount = 0;
      ctas.forEach((cta) => {
        const href = cta.getAttribute('href') || '';
        const text = cta.textContent.trim();
        if (text && !seenHrefs.has(href)) {
          seenHrefs.add(href);
          if (addedCount > 0) ctaP.appendChild(document.createTextNode(' '));
          const link = document.createElement('a');
          link.href = href;
          link.textContent = text;
          ctaP.appendChild(link);
          addedCount++;
        }
      });
      if (addedCount > 0) contentCell.appendChild(ctaP);
    }

    cells.push([contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Pricing', cells });
  element.replaceWith(block);
}
