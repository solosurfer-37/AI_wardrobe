window.WardrobeStories = (function () {
  const $ = id => document.getElementById(id);

  function count(el, to, fmt) {
    const t0 = performance.now(), dur = 900;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function render(d) {
    count($('st-items'), d.items, v => Math.round(v));
    $('st-items-text').textContent = d.idle > 0
      ? `pieces, and ${d.idle} are waiting for their moment.`
      : 'pieces, and every one gets love.';

    count($('st-value'), d.value, v => '₹' + Math.round(v).toLocaleString('en-IN'));
    $('st-value-text').textContent = 'in how you show up every day.';

    count($('st-cpw'), d.cpw, v => '₹' + v.toFixed(2));
    $('st-cpw-text').textContent = d.cpw > 10
      ? 'wear a few favourites more to bring this down.'
      : 'nice, your pieces are earning their keep.';

    count($('st-util'), d.util, v => Math.round(v) + '%');
    $('st-util-text').textContent = d.util >= 70
      ? 'of what you own. Great rotation!'
      : 'of what you own. Time to explore the rest.';
    $('st-ring').style.strokeDashoffset = 163.4 * (1 - Math.min(100, d.util) / 100);
  }

  // items array se hisaab: har item me price aur wearCount (field names apne data ke hisaab se badal lena)
  function fromItems(list) {
    const n = list.length;
    const value = list.reduce((s, i) => s + (+i.price || 0), 0);
    const wears = list.reduce((s, i) => s + (+(i.wearCount ?? i.wears) || 0), 0);
    const worn = list.filter(i => (i.wearCount ?? i.wears) > 0).length;
    const idle = list.filter(i => ((i.wearCount ?? i.wears) || 0) <= 1).length;
    return { items: n, value, cpw: wears ? value / wears : value, util: n ? (worn / n) * 100 : 0, idle };
  }

  document.addEventListener('DOMContentLoaded', () =>
    render({ items: 42, value: 3240, cpw: 4.2, util: 68, idle: 6 })); // demo, real data aane tak

  return { render, fromItems };
})();