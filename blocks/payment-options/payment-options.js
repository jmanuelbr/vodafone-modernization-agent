export default function decorate(block) {
  const options = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim();
    const cards = cols.slice(1).map((c) => c.innerHTML.trim()).filter(Boolean);
    options.push({ label, cards });
  });

  block.textContent = '';

  // Create tab buttons
  const tabBar = document.createElement('div');
  tabBar.className = 'payment-options-tabs';

  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'payment-options-tab';
    if (idx === 0) btn.classList.add('active');
    btn.textContent = opt.label;
    btn.setAttribute('data-tab', idx);
    tabBar.append(btn);
  });

  block.append(tabBar);

  // Create panels
  options.forEach((opt, idx) => {
    const panel = document.createElement('div');
    panel.className = 'payment-options-panel';
    if (idx === 0) panel.classList.add('active');
    panel.setAttribute('data-panel', idx);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'payment-options-cards';

    opt.cards.forEach((html) => {
      const card = document.createElement('div');
      card.className = 'payment-options-card';
      card.innerHTML = html;
      cardsContainer.append(card);
    });

    panel.append(cardsContainer);
    block.append(panel);
  });

  // Tab click handling
  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.payment-options-tab');
    if (!btn) return;
    const tabIdx = btn.getAttribute('data-tab');

    tabBar.querySelectorAll('.payment-options-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    block.querySelectorAll('.payment-options-panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-panel') === tabIdx);
    });
  });
}
