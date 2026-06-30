(() => {
  const PROGRAM_START_KEY = 'hi_tri_program_start';
  const TOTAL_WEEKS = 13;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function parseIsoLocalDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function toIsoLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getProgramStartDate() {
    return parseIsoLocalDate(localStorage.getItem(PROGRAM_START_KEY));
  }

  function formatDateShort(date) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
  }

  function formatWeekDateRange(start, end) {
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()}–${formatDateShort(end)}`;
    }
    return `${formatDateShort(start)} – ${formatDateShort(end)}`;
  }

  function getWeekDateRangeDates(weekNum) {
    const programStart = getProgramStartDate();
    if (!programStart) return null;
    // Convention calendrier : la semaine 1 commence exactement à la date choisie.
    // Chaque semaine est ensuite un bloc fixe de 7 jours, sans recalage automatique au lundi.
    const start = addDays(programStart, (weekNum - 1) * 7);
    return { start, end: addDays(start, 6) };
  }

  function getWeekDateRange(weekNum) {
    const range = getWeekDateRangeDates(weekNum);
    return range ? formatWeekDateRange(range.start, range.end) : 'début à définir';
  }

  function startOfToday() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function getCalendarActiveWeekNum() {
    const programStart = getProgramStartDate();
    if (!programStart) return 1;
    const today = startOfToday();
    const planEnd = addDays(programStart, (TOTAL_WEEKS * 7) - 1);
    if (today <= programStart) return 1;
    if (today >= planEnd) return TOTAL_WEEKS;
    return Math.min(TOTAL_WEEKS, Math.floor((today - programStart) / (7 * MS_PER_DAY)) + 1);
  }

  function injectStyles() {
    if (document.getElementById('calendar-runtime-styles')) return;
    const style = document.createElement('style');
    style.id = 'calendar-runtime-styles';
    style.textContent = `
.program-date-panel{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 16px;padding:12px 14px;border:1px solid var(--border);border-radius:8px;background:var(--card)}
.program-date-copy{min-width:0}.program-date-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted2);margin-bottom:3px}.program-date-status{font-size:13px;color:var(--text)}.program-date-status span{color:var(--accent);font-weight:600}.program-date-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.program-date-actions input{color-scheme:dark;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);border:1px solid var(--border);border-radius:6px;background:var(--bg2);padding:7px 9px}.program-date-actions button{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:7px 11px;border-radius:6px;border:1px solid var(--border);background:var(--bg2);color:var(--muted);cursor:pointer}.program-date-actions button:hover{border-color:var(--accent);color:var(--accent)}.program-date-actions .primary{border-color:rgba(56,189,248,.45);color:var(--accent);background:var(--accent-dim)}.week-title-date{color:var(--muted);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:400;margin-left:4px}@media(max-width:650px){.program-date-panel{align-items:flex-start;flex-direction:column}.program-date-actions{justify-content:flex-start}}
`;
    document.head.appendChild(style);
  }

  function injectProgramStartPanel() {
    if (document.getElementById('program-date-panel')) return;
    const sportTab = document.querySelector('.sport-tab');
    if (!sportTab) return;
    const panel = document.createElement('div');
    panel.className = 'program-date-panel';
    panel.id = 'program-date-panel';
    panel.innerHTML = `
      <div class="program-date-copy">
        <div class="program-date-label">Calendrier du programme</div>
        <div class="program-date-status" id="program-date-status">Définis une date de début pour caler les 13 semaines.</div>
      </div>
      <div class="program-date-actions">
        <input type="date" id="programStartInput" aria-label="Date de début du programme">
        <button class="primary" id="programStartSaveBtn" onclick="saveProgramStartFromInput()">Valider</button>
        <button id="programStartEditBtn" onclick="enableProgramStartEdit()" style="display:none">✏️ modifier la date de début</button>
      </div>`;
    sportTab.parentNode.insertBefore(panel, sportTab);
  }

  function renderProgramStartControl(editing = false) {
    const input = document.getElementById('programStartInput');
    const saveBtn = document.getElementById('programStartSaveBtn');
    const editBtn = document.getElementById('programStartEditBtn');
    const status = document.getElementById('program-date-status');
    if (!input || !saveBtn || !editBtn || !status) return;
    const storedIso = localStorage.getItem(PROGRAM_START_KEY);
    const programStart = getProgramStartDate();
    const shouldEdit = editing || !programStart;
    input.value = programStart ? toIsoLocalDate(programStart) : '';
    input.style.display = shouldEdit ? '' : 'none';
    saveBtn.style.display = shouldEdit ? '' : 'none';
    editBtn.style.display = shouldEdit ? 'none' : '';
    if (!programStart) {
      if (storedIso) localStorage.removeItem(PROGRAM_START_KEY);
      status.textContent = 'Définis une date de début pour caler les 13 semaines.';
      return;
    }
    const planEnd = addDays(programStart, (TOTAL_WEEKS * 7) - 1);
    const activeWeek = getCalendarActiveWeekNum();
    status.innerHTML = `Début <span>${formatDateShort(programStart)}</span> · semaine calendaire <span>S${activeWeek}</span> · fin prévue ${formatDateShort(planEnd)}`;
  }

  function postProcessWeekBlocks() {
    document.querySelectorAll('.week-block').forEach(block => {
      const num = Number((block.id || '').replace('week-', ''));
      if (!num) return;
      const title = block.querySelector('.week-title');
      const date = block.querySelector('.week-date');
      const range = getWeekDateRange(num);
      if (title && !title.querySelector('.week-title-date')) {
        title.insertAdjacentHTML('beforeend', ` <span class="week-title-date">· ${range}</span>`);
      } else if (title?.querySelector('.week-title-date')) {
        title.querySelector('.week-title-date').textContent = `· ${range}`;
      }
      if (date) date.remove();
    });
  }

  function refreshCalendarViews() {
    renderProgramStartControl();
    if (window.currentSport === 'week') {
      window.currentWeekView = getCalendarActiveWeekNum();
      window.buildWeekView?.(window.currentWeekView);
    } else {
      window.buildPlan?.();
      window.updateStats?.();
      window.addActiveWeekIndicator?.();
    }
  }

  window.getWeekDateRange = getWeekDateRange;
  window.getWeekActiveNum = getCalendarActiveWeekNum;
  window.getActiveWeekNum = getCalendarActiveWeekNum;
  window.saveProgramStartFromInput = () => {
    const input = document.getElementById('programStartInput');
    const date = parseIsoLocalDate(input?.value);
    if (!date) return window.showToast ? window.showToast('date-error') : alert('Choisis une date valide');
    localStorage.setItem(PROGRAM_START_KEY, toIsoLocalDate(date));
    refreshCalendarViews();
    if (window.showToast) window.showToast('date-saved');
  };
  window.enableProgramStartEdit = () => {
    renderProgramStartControl(true);
    document.getElementById('programStartInput')?.focus();
  };

  const originalShowToast = window.showToast;
  if (originalShowToast) {
    window.showToast = function(state) {
      if (state !== 'date-saved' && state !== 'date-error') return originalShowToast(state);
      const t = document.getElementById('toast');
      if (!t) return;
      t.textContent = state === 'date-saved' ? '✓ Date de début enregistrée' : 'Choisis une date valide';
      t.style.background = state === 'date-saved' ? 'var(--green)' : 'var(--orange)';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2200);
    };
  }

  const originalBuildPlan = window.buildPlan;
  if (originalBuildPlan) {
    window.buildPlan = function(...args) {
      const result = originalBuildPlan.apply(this, args);
      postProcessWeekBlocks();
      return result;
    };
  }

  const originalBuildWeekView = window.buildWeekView;
  if (originalBuildWeekView) {
    window.buildWeekView = function(weekNum) {
      const result = originalBuildWeekView.call(this, weekNum == null ? getCalendarActiveWeekNum() : weekNum);
      document.querySelectorAll('.week-nav-title span').forEach(span => {
        span.textContent = span.textContent.replace('📍 SEMAINE EN COURS', '📍 CETTE SEMAINE');
      });
      return result;
    };
  }

  window.addActiveWeekIndicator = function() {
    const weekNum = getCalendarActiveWeekNum();
    const header = document.querySelector(`#week-${weekNum} .week-header`);
    if (!header || header.querySelector('.calendar-active-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'calendar-active-badge';
    badge.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);border:1px solid rgba(56,189,248,.4);padding:2px 6px;border-radius:3px;white-space:nowrap";
    badge.textContent = '📍 CETTE SEMAINE';
    const chevron = header.querySelector('.week-chevron');
    header.insertBefore(badge, chevron);
    document.getElementById(`week-${weekNum}`).style.borderColor = 'rgba(56,189,248,0.5)';
  };

  function neutralizeRaceHeader() {
    const title = [...document.querySelectorAll('#objectives-section div')].find(el => el.textContent.trim() === 'IRONMAN 70.3 NICE — 28 JUIN 2026');
    if (title) title.textContent = 'IRONMAN 70.3 NICE';
    const subtitle = title?.nextElementSibling;
    if (subtitle) subtitle.textContent = 'Date reportée — en attente de confirmation Ironman';
  }

  injectStyles();
  injectProgramStartPanel();
  neutralizeRaceHeader();
  renderProgramStartControl();
  refreshCalendarViews();
})();
