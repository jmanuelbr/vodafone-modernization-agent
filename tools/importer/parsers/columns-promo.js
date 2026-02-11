/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: columns
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Columns-Promo")
 * - Row 2: [text content with heading, subtitle, CTA | promotional image] (2 columns)
 *
 * Source HTML Pattern:
 * section.ws10-m-text-image
 *   > div (content wrapper)
 *     > div (text column: heading h2/h3, paragraph, CTA link)
 *     > div (image column: picture > img)
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Column 1: Text content (heading, subtitle, CTA)
  const textCell = document.createElement('div');

  // Heading
  // VALIDATED: h2 found inside ws10-m-text-image in captured DOM
  const heading = element.querySelector('h2, h3, h4');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.appendChild(h);
  }

  // Subtitle/description paragraphs
  // VALIDATED: p elements found in text-image module
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text && !p.querySelector('a')) {
      const para = document.createElement('p');
      para.textContent = text;
      textCell.appendChild(para);
    }
  });

  // CTA link
  // VALIDATED: a elements found in text-image module
  const links = element.querySelectorAll('a');
  if (links.length > 0) {
    const ctaP = document.createElement('p');
    links.forEach((link, i) => {
      const text = link.textContent.trim();
      const href = link.getAttribute('href') || '';
      if (text && href) {
        if (i > 0) ctaP.appendChild(document.createTextNode(' '));
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        ctaP.appendChild(a);
      }
    });
    if (ctaP.childNodes.length > 0) textCell.appendChild(ctaP);
  }

  // Column 2: Image
  const imageCell = document.createElement('div');
  const picture = element.querySelector('picture');
  const img = element.querySelector('img');
  if (picture) {
    imageCell.appendChild(picture.cloneNode(true));
  } else if (img) {
    imageCell.appendChild(img.cloneNode(true));
  }

  cells.push([textCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Promo', cells });
  element.replaceWith(block);
}
