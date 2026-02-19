export default function decorate(block) {
  const tabs = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim();
    const meta = cols[1]?.textContent.trim();
    const isActive = meta === 'active';
    tabs.push({
      label,
      content: isActive ? '' : (cols[1]?.innerHTML || ''),
      isActive,
    });
  });

  block.textContent = '';

  // Create tab bar
  const tabBar = document.createElement('div');
  tabBar.className = 'customer-tabs-bar';

  tabs.forEach((tab, idx) => {
    const btn = document.createElement('button');
    btn.className = 'customer-tabs-btn';
    if (idx === 0) btn.classList.add('active');
    btn.textContent = tab.label;
    btn.setAttribute('data-tab', idx);
    tabBar.append(btn);
  });

  block.append(tabBar);

  // Group subsequent sibling wrappers as tab 0 content
  const wrapper = block.closest('.customer-tabs-wrapper');
  if (!wrapper) return;

  const endPatterns = /Somos transparentes|Llévatelo/;
  let next = wrapper.nextElementSibling;
  const tabContent = [];

  while (next) {
    if (next.classList.contains('accordion-wrapper')) break;
    const heading = next.querySelector('h2');
    if (heading && endPatterns.test(heading.textContent)) break;
    tabContent.push(next);
    next = next.nextElementSibling;
  }

  tabContent.forEach((el) => el.classList.add('customer-tab-content', 'customer-tab-0'));

  // Create placeholder for tab 1 (Ya soy cliente)
  const placeholder = document.createElement('div');
  placeholder.className = 'customer-tab-content customer-tab-1';
  placeholder.style.display = 'none';
  placeholder.innerHTML = tabs[1]?.content
    ? `<div class="customer-tabs-placeholder">${tabs[1].content}</div>`
    : '<div class="customer-tabs-placeholder"><p>Accede a Mi Vodafone.</p></div>';

  const insertAfter = tabContent.length > 0 ? tabContent[tabContent.length - 1] : wrapper;
  insertAfter.after(placeholder);

  // Tab click handling
  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.customer-tabs-btn');
    if (!btn) return;
    const tabIdx = btn.getAttribute('data-tab');

    tabBar.querySelectorAll('.customer-tabs-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const section = wrapper.closest('.section');
    section.querySelectorAll('.customer-tab-content').forEach((el) => {
      if (el.classList.contains(`customer-tab-${tabIdx}`)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  });
}
