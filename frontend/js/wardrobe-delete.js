(function () {
  if (typeof Utils === 'undefined' || typeof Utils.showClothingDetail !== 'function') {
    console.warn('[wardrobe-delete] Utils.showClothingDetail nahi mila. Script order check kar.');
    return;
  }

  const original = Utils.showClothingDetail.bind(Utils);

  // api.js me delete/remove naam wala function khud dhoondh leta hai
  function findDeleteFn() {
    if (typeof API === 'undefined') return null;
    const key = Object.keys(API).find(k => typeof API[k] === 'function' && /(delete|remove)/i.test(k));
    if (!key) console.warn('[wardrobe-delete] API ke methods:', Object.keys(API));
    return key ? API[key].bind(API) : null;
  }

  function inject(item) {
    const body = document.getElementById('detail-body');
    if (!body || body.querySelector('.detail-actions')) return;

    const wrap = document.createElement('div');
    wrap.className = 'detail-actions';
    wrap.innerHTML = `<button type="button" class="btn btn-danger" id="btn-delete-clothing">
      <i data-lucide="trash-2"></i> Delete this item</button>`;
    body.appendChild(wrap);
    if (window.lucide) lucide.createIcons();

    wrap.querySelector('button').addEventListener('click', async e => {
      const name = item.type || 'this item';
      if (!confirm('Delete ' + name + ' from your wardrobe?')) return;
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        const del = findDeleteFn();
        if (!del) throw new Error('api.js me delete function nahi mila (console dekh)');
        await del(item.id);
        document.getElementById('clothing-detail-modal').classList.remove('active');
        if (typeof Toast !== 'undefined') Toast.success('Deleted', name + ' removed.');
        setTimeout(() => location.reload(), 500);
      } catch (err) {
        console.error(err);
        btn.disabled = false;
        if (typeof Toast !== 'undefined') Toast.error('Delete failed', err.message);
      }
    });
  }

  Utils.showClothingDetail = function (item) {
    const result = original(item);
    inject(item);
    // agar modal ka content baad me render hota hai
    const body = document.getElementById('detail-body');
    if (body) {
      const obs = new MutationObserver(() => inject(item));
      obs.observe(body, { childList: true });
      setTimeout(() => obs.disconnect(), 1500);
    }
    return result;
  };

  console.log('[wardrobe-delete] ready');
})();