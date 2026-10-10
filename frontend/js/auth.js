/* ═══════════════════════════════════════════════════════
   AI Wardrobe — Supabase Auth (login, signup, logout, guard)
   ═══════════════════════════════════════════════════════ */

// Supabase dashboard -> Project Settings -> API. Anon/publishable key only, never service_role.
const SUPABASE_URL = 'https://spitnxgxefrsxzbqvdbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yMmLCF-4cgaLF9o9X7v_Bw_DtR5p_rk';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.sb = sb;

const Auth = {
  isLoginPage: document.body.dataset.public === 'true',

  async session() {
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  // users table: id (bigint), auth_user_id (uuid), email, username
  async ensureProfile(user, usernameHint) {
    const { data: existing, error } = await sb
      .from('users').select('id, username, email')
      .eq('auth_user_id', user.id).maybeSingle();
    if (error) throw error;
    if (existing) return existing;

    const username = usernameHint || user.user_metadata?.username || user.email.split('@')[0];
    const { data, error: insErr } = await sb
      .from('users')
      .insert({ auth_user_id: user.id, email: user.email, username })
      .select('id, username, email').single();
    if (insErr) throw insErr;
    return data;
  },

  // Other files can call: const me = await Auth.currentProfile(); me.id is the bigint users.id
  async currentProfile() {
    if (this._profile) return this._profile;
    const s = await this.session();
    if (!s) return null;
    this._profile = await this.ensureProfile(s.user);
    return this._profile;
  },

  async logout() {
    await sb.auth.signOut();
    location.href = 'login.html';
  },

  async guard() {
    const s = await this.session();
    if (!s) { location.replace('login.html'); return; }

    try {
      const me = await this.ensureProfile(s.user);
      this._profile = me;
      document.querySelectorAll('.user-name').forEach(el => el.textContent = me.username);
      document.querySelectorAll('.user-role').forEach(el => el.textContent = me.email);
      document.querySelectorAll('.user-avatar').forEach(el => el.textContent = (me.username || 'U').slice(0, 2).toUpperCase());
    } catch (e) {
      console.warn('[auth] profile load failed', e);
    }
    this.addLogoutLink();
  },

  addLogoutLink() {
    const list = document.querySelector('.glass-links');
    if (!list || document.getElementById('nav-logout')) return;
    const li = document.createElement('li');
    li.innerHTML = '<a href="#" class="glass-link" id="nav-logout"><i data-lucide="log-out"></i><span>Logout</span></a>';
    list.appendChild(li);
    li.querySelector('a').addEventListener('click', e => { e.preventDefault(); Auth.logout(); });
    if (window.lucide) lucide.createIcons();
  },

  initLoginPage() {
    const form = document.getElementById('auth-form');
    const msg = document.getElementById('auth-msg');
    const submit = document.getElementById('auth-submit');
    const userField = document.querySelector('.field-username');
    const title = document.getElementById('auth-title');
    const sub = document.getElementById('auth-sub');
    let mode = 'login';

    const say = (t, ok = false) => { msg.textContent = t; msg.classList.toggle('ok', ok); };

    document.querySelectorAll('.auth-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.toggle('active', b === btn));
        const signup = mode === 'signup';
        userField.hidden = !signup;
        title.textContent = signup ? 'Create your closet' : 'Welcome back';
        sub.textContent = signup ? 'Takes less than a minute.' : 'Sign in to open your closet.';
        submit.textContent = signup ? 'Create account' : 'Sign in';
        document.getElementById('auth-password').autocomplete = signup ? 'new-password' : 'current-password';
        say('');
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      const username = document.getElementById('auth-username').value.trim();

      if (!email || !password) return say('Email and password are required.');
      if (password.length < 6) return say('Password needs at least 6 characters.');
      if (mode === 'signup' && !username) return say('Pick a username.');

      submit.disabled = true;
      say('');
      try {
        if (mode === 'signup') {
          const { data, error } = await sb.auth.signUp({ email, password, options: { data: { username } } });
          if (error) throw error;
          if (!data.session) {
            say('Account created. Check your email to confirm, then sign in.', true);
            return;
          }
          await this.ensureProfile(data.user, username);
        } else {
          const { data, error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw error;
          await this.ensureProfile(data.user);
        }
        location.href = 'index.html';
      } catch (err) {
        say(err.message || 'Something went wrong. Try again.');
      } finally {
        submit.disabled = false;
      }
    });
  },
};

window.Auth = Auth;

(async function () {
  if (Auth.isLoginPage) {
    if (await Auth.session()) { location.replace('index.html'); return; }
    Auth.initLoginPage();
  } else {
    await Auth.guard();
  }
})();
