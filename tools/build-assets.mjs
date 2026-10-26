// Generates every diagram and synthetic visual in /assets. No external data: all numbers are
// fictional or taken from the author's own Fitness RPG level table. Run: node tools/build-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

const C = { ink: '#1f2933', mute: '#616e7c', line: '#cbd2d9', bg: '#ffffff', soft: '#f5f7fa',
  blue: '#1d4ed8', blueSoft: '#dbeafe', teal: '#0f766e', tealSoft: '#ccfbf1',
  amber: '#b45309', amberSoft: '#fef3c7', red: '#b91c1c', redSoft: '#fee2e2' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}" font-family="Segoe UI, Helvetica, Arial, sans-serif">
<rect width="${w}" height="${h}" fill="${C.bg}"/>
<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.mute}"/></marker></defs>
${body}</svg>`;
const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 13}" fill="${o.fill || C.ink}" font-weight="${o.weight || 400}" text-anchor="${o.anchor || 'start'}">${esc(s)}</text>`;
const box = (x, y, w, h, title, sub, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${o.fill || C.soft}" stroke="${o.stroke || C.line}"/>` +
  text(x + w / 2, y + (sub ? h / 2 - 3 : h / 2 + 5), title, { anchor: 'middle', weight: 600 }) +
  (sub ? text(x + w / 2, y + h / 2 + 15, sub, { anchor: 'middle', size: 11, fill: C.mute }) : '');
const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.mute}" stroke-width="1.5" marker-end="url(#a)"/>`;
const head = (w, t, s) => text(24, 32, t, { size: 18, weight: 700 }) + text(24, 52, s, { size: 12, fill: C.mute });
const write = (name, s) => writeFileSync(join(out, name), s);

// 1. Follow-up CRM workflow
{
  let b = head(900, 'Follow-up engine: from customer status to a reviewed message', 'Workflow diagram. Table-driven rules decide what is due; AI drafts; eligibility and review gate every send.');
  b += box(24, 90, 180, 56, 'CRM + Quote Lines', 'customers, quoted lines, renewals', { fill: C.blueSoft, stroke: C.blue });
  b += box(24, 160, 180, 56, 'Opportunities', 'future / waiting-on-budget', { fill: C.blueSoft, stroke: C.blue });
  b += box(24, 230, 180, 56, 'Post-Sale Tasks', 'documents, programs', { fill: C.blueSoft, stroke: C.blue });
  b += box(260, 140, 170, 90, 'Workflow rules', 'status + step + offset days + template', { fill: C.amberSoft, stroke: C.amber });
  b += box(480, 140, 170, 90, 'Follow-Up Engine', 'one queue row per action, deterministic ID', { fill: C.tealSoft, stroke: C.teal });
  b += box(700, 90, 176, 56, 'AI draft', 'email + text, per-customer context', { fill: C.soft });
  b += box(700, 160, 176, 56, 'Eligibility + hold checks', 'contact preference, hold-until, language', { fill: C.soft });
  b += box(700, 230, 176, 56, 'Owner reviews and sends', 'email draft, text queue', { fill: C.soft });
  b += box(480, 330, 170, 56, 'Activity Log', 'every send, skip, result', { fill: C.soft });
  b += box(260, 330, 170, 56, 'Needs Attention', 'superseded or stale drafts', { fill: C.redSoft, stroke: C.red });
  b += box(24, 330, 180, 56, 'Today', 'unified action list', { fill: C.tealSoft, stroke: C.teal });
  for (const y of [118, 188, 258]) b += arrow(204, y, 260, 185);
  b += arrow(430, 185, 480, 185);
  b += arrow(650, 170, 700, 118); b += arrow(650, 185, 700, 188); b += arrow(650, 200, 700, 258);
  b += arrow(788, 286, 650, 350); b += arrow(480, 358, 430, 358); b += arrow(260, 358, 204, 358);
  write('followup-workflow.svg', svg(900, 410, b, 'Follow-up engine workflow'));
}

// 2. Follow-up CRM mockup (synthetic)
{
  const rows = [['Dana Whitfield', 'Quote: waiting on decision', 'Step 1', 'Today', 'Email + Text', 'English'],
    ['Luis Ortega', 'Renewal in 45 days', 'Step 1', 'Today', 'Email', 'Spanish'],
    ['Priya Raman', 'Future: waiting on budget', 'Step 1', 'In 6 days', 'Email', 'English'],
    ['Tom Brennan', 'Post-sale: documents pending', 'Step 2', 'Tomorrow', 'Text', 'English'],
    ['Marta Silva', 'Quote: active', 'Step 3', 'In 3 days', 'Email + Text', 'Spanish']];
  let b = head(900, 'Today view (illustrative mockup, synthetic data)', 'Fictional customers. Shows the shape of the daily action list, not a screenshot of the production system.');
  const cols = [24, 190, 420, 500, 600, 730]; const names = ['Customer', 'Why it is due', 'Step', 'Due', 'Contact via', 'Language'];
  b += `<rect x="24" y="76" width="852" height="34" fill="${C.ink}"/>` + names.map((n, i) => text(cols[i] + 10, 98, n, { fill: '#fff', weight: 600, size: 12 })).join('');
  rows.forEach((r, i) => { const y = 110 + i * 44; b += `<rect x="24" y="${y}" width="852" height="44" fill="${i % 2 ? C.soft : '#fff'}" stroke="${C.line}"/>` + r.map((c, j) => text(cols[j] + 10, y + 27, c, { size: 12 })).join(''); });
  b += box(24, 350, 260, 40, 'Draft ready: review before send', null, { fill: C.tealSoft, stroke: C.teal });
  b += box(300, 350, 260, 40, '1 item in Needs Attention', null, { fill: C.redSoft, stroke: C.red });
  write('followup-today-mockup.svg', svg(900, 410, b, 'Synthetic Today view mockup'));
}

// 3 + 4. Compensation model (all fictional)
{
  const tiers = lim => wp => wp >= lim[1] ? 0.065 : wp >= lim[0] ? 0.05 : 0.04;
  const before = tiers([30000, 50000]), after = tiers([30000, 40000]);
  const W = 900, H = 400, x0 = 70, y0 = 330, pw = 780, ph = 250, maxWP = 70000, maxPay = 4800;
  const X = v => x0 + v / maxWP * pw, Y = v => y0 - v / maxPay * ph;
  const path = f => { let d = ''; for (let wp = 0; wp <= maxWP; wp += 250) d += `${d ? 'L' : 'M'}${X(wp).toFixed(1)} ${Y(wp * f(wp)).toFixed(1)}`; return d; };
  let b = head(W, 'Why a tier cliff matters (illustrative, fictional agency and rates)', 'Retroactive tiers pay the higher rate on all premium once the threshold is hit. Just under the line, extra premium earns nothing extra.');
  for (let v = 0; v <= 4000; v += 1000) b += `<line x1="${x0}" x2="${x0 + pw}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.line}"/>` + text(x0 - 8, Y(v) + 4, '$' + v.toLocaleString(), { anchor: 'end', size: 11, fill: C.mute });
  for (let v = 0; v <= 70000; v += 10000) b += text(X(v), y0 + 20, '$' + v / 1000 + 'k', { anchor: 'middle', size: 11, fill: C.mute });
  b += `<path d="${path(before)}" fill="none" stroke="${C.red}" stroke-width="2.5"/><path d="${path(after)}" fill="none" stroke="${C.teal}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  b += text(X(50000) - 8, Y(50000 * 0.065) - 26, 'Cliff: $50k threshold, payout jumps $750', { anchor: 'end', size: 12, fill: C.red });
  b += text(X(40000) - 8, Y(40000 * 0.065) - 12, 'Lower threshold: $40k', { anchor: 'end', size: 12, fill: C.teal });
  b += text(x0, y0 + 46, 'Monthly written premium', { size: 12, fill: C.mute }) + `<line x1="560" x2="590" y1="${y0 + 42}" y2="${y0 + 42}" stroke="${C.red}" stroke-width="2.5"/>` + text(596, y0 + 46, 'Current structure', { size: 12 }) + `<line x1="720" x2="750" y1="${y0 + 42}" y2="${y0 + 42}" stroke="${C.teal}" stroke-width="2.5" stroke-dasharray="6 4"/>` + text(756, y0 + 46, 'Adjusted threshold', { size: 12 });
  write('compensation-cliff.svg', svg(W, H, b, 'Illustrative compensation tier cliff chart'));

  // synthetic agent-months, seeded
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
  const months = Array.from({ length: 120 }, () => Math.max(8000, 38000 + 11000 * gauss()));
  const share = f => { const c = { 0.04: 0, 0.05: 0, 0.065: 0 }; months.forEach(m => c[f(m)]++); return Object.values(c).map(v => v / months.length); };
  const sb = share(before), sa = share(after), pay = (f) => months.reduce((t, m) => t + m * f(m), 0) / months.length;
  const labels = ['4.0% tier', '5.0% tier', '6.5% tier']; const bw = 220;
  let d = head(W, 'Where agents land (120 synthetic agent-months, fictional agency)', `Average payout per agent-month: $${Math.round(pay(before)).toLocaleString()} current vs $${Math.round(pay(after)).toLocaleString()} adjusted. Illustrative, not real agency data.`);
  [[sb, 'Current structure', C.red, 40], [sa, 'Adjusted threshold', C.teal, 470]].forEach(([arr, name, col, ox]) => {
    d += text(ox, 92, name, { weight: 600 });
    arr.forEach((v, i) => { const y = 110 + i * 58; d += `<rect x="${ox}" y="${y}" width="${v * bw * 1.8}" height="30" fill="${col}" opacity="0.85"/>` + text(ox + v * bw * 1.8 + 8, y + 20, `${Math.round(v * 100)}%`, { size: 13, weight: 600 }) + text(ox, y + 46, labels[i], { size: 11, fill: C.mute }); });
  });
  d += text(24, 330, 'Method: seeded random draw (mean $38k, sd $11k), tiers applied to every agent-month. Rates and thresholds are invented for demonstration.', { size: 11, fill: C.mute });
  write('compensation-distribution.svg', svg(W, 350, d, 'Synthetic agent distribution by tier'));
}

// 5. CoreOps pipeline + architecture
{
  let b = head(900, 'CoreOps CRM: lead-to-customer pipeline', 'Each step is a separate, guarded module. Paid providers sit behind a cost guard; every send passes one eligibility gate.');
  const steps = [['Discover', 'scheduled map search'], ['Dedupe', 'against existing prospects'], ['Enrich', 'site crawl, email lookup'], ['Score', 'opportunity grade'], ['Eligibility gate', 'verify, suppress, cooldown'], ['Campaign', 'paced multi-step email'], ['Replies', 'classify, STOP / HOLD'], ['Pipeline', 'stages, tasks, My Day']];
  steps.forEach((s2, i) => { const x = 24 + (i % 4) * 220, y = 90 + Math.floor(i / 4) * 110; b += box(x, y, 190, 62, s2[0], s2[1], { fill: i === 4 ? C.amberSoft : i < 4 ? C.blueSoft : C.tealSoft, stroke: i === 4 ? C.amber : i < 4 ? C.blue : C.teal }); if (i % 4 < 3) b += arrow(x + 190, y + 31, x + 220, y + 31); });
  b += arrow(110, 152, 110, 200).replace('y2="200"', 'y2="200"'); // visual hint only
  b += box(24, 320, 852, 52, 'Google Sheet (system of record) + Apps Script web app with role-based access', 'time-driven triggers, provider cost guard, audit ledgers', { fill: C.soft });
  write('coreops-pipeline.svg', svg(900, 400, b, 'CoreOps pipeline'));

  let a = head(900, 'CoreOps CRM: system architecture (simplified)', 'Infrastructure details intentionally omitted. Public view shows components and responsibilities only.');
  a += box(24, 96, 200, 60, 'Staff (browser)', 'domain sign-in, Admin / Caller', { fill: C.blueSoft, stroke: C.blue });
  a += box(300, 96, 300, 60, 'Apps Script web app', '25 source files, 4 scheduled triggers', { fill: C.tealSoft, stroke: C.teal });
  a += box(676, 96, 200, 60, 'Google Sheet', 'prospects, campaigns, logs', { fill: C.soft });
  a += box(24, 230, 190, 56, 'Maps discovery API', 'budget-capped', { fill: C.amberSoft, stroke: C.amber });
  a += box(234, 230, 190, 56, 'Email lookup + verify', 'allowance-capped', { fill: C.amberSoft, stroke: C.amber });
  a += box(444, 230, 210, 56, 'Research service', 'self-hosted, authenticated', { fill: C.amberSoft, stroke: C.amber });
  a += box(674, 230, 202, 56, 'Gmail send + reply sync', 'per-mailbox daily limits', { fill: C.soft });
  a += arrow(224, 126, 300, 126) + arrow(600, 126, 676, 126);
  [119, 329, 549, 775].forEach((x, i) => a += arrow(450 + (i - 1.5) * 40, 156, x, 230));
  a += text(24, 340, 'Safeguards: one outreach eligibility gate, suppression and Do-Not-Contact lists, business-hours pacing, provider cost guard, reply-driven STOP / HOLD.', { size: 12, fill: C.mute });
  write('coreops-architecture.svg', svg(900, 370, a, 'CoreOps architecture'));
}

// 6. Fitness RPG: architecture + level curve (values copied from the author's LEVELS sheet)
{
  let b = head(900, 'Fitness RPG: V1 data model and planned integrations', 'Solid = built in the Google Sheets backend. Dashed = designed, not yet built or connected.');
  const dashed = (x, y, w, h, t, s) => box(x, y, w, h, t, s, { fill: '#fff', stroke: C.mute }).replace('<rect ', '<rect stroke-dasharray="5 4" ');
  b += box(330, 90, 240, 70, 'Rules + state (Sheets)', '19 tabs: logs, ledger, scheduler, levels', { fill: C.tealSoft, stroke: C.teal });
  b += box(24, 200, 190, 56, 'Workout + set logs', 'progression targets', { fill: C.blueSoft, stroke: C.blue });
  b += box(234, 200, 190, 56, 'Quest / penalty engine', 'XP, discipline', { fill: C.blueSoft, stroke: C.blue });
  b += box(444, 200, 190, 56, 'Scheduler', 'recovery-aware day type', { fill: C.blueSoft, stroke: C.blue });
  b += box(654, 200, 222, 56, 'Level curve + stats', '200 levels, 6 character stats', { fill: C.blueSoft, stroke: C.blue });
  b += dashed(24, 320, 190, 56, 'Web app UI', 'next build') + dashed(234, 320, 190, 56, 'Apple Health bridge', 'awaiting endpoint');
  b += dashed(444, 320, 190, 56, 'Food photo estimate', 'user confirms') + dashed(654, 320, 222, 56, 'Notifications', 'quest + calorie warnings');
  [119, 329, 539, 765].forEach(x => b += arrow(450, 160, x, 200));
  [119, 329, 539, 765].forEach(x => b += arrow(x, 256, x, 320));
  write('fitness-architecture.svg', svg(900, 400, b, 'Fitness RPG architecture'));

  const pts = [[1, 0], [2, 1000], [3, 2549], [4, 4407], [5, 6498], [6, 8782], [7, 11233]];
  const x0 = 80, y0 = 290, pw = 760, ph = 200; const X = l => x0 + (l - 1) / 6 * pw, Y = v => y0 - v / 12000 * ph;
  let c = head(900, 'Level curve (levels 1 to 7 from the LEVELS sheet)', 'Each level costs more XP than the last: 1,000 then 1,549, 1,858, 2,091, 2,284, 2,451.');
  for (let v = 0; v <= 12000; v += 4000) c += `<line x1="${x0}" x2="${x0 + pw}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.line}"/>` + text(x0 - 8, Y(v) + 4, v.toLocaleString(), { anchor: 'end', size: 11, fill: C.mute });
  c += `<path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join('')}" fill="none" stroke="${C.blue}" stroke-width="2.5"/>`;
  pts.forEach(p => c += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="${C.blue}"/>` + text(X(p[0]), y0 + 20, 'L' + p[0], { anchor: 'middle', size: 11, fill: C.mute }) + text(X(p[0]), Y(p[1]) - 10, p[1].toLocaleString(), { anchor: 'middle', size: 11 }));
  c += text(x0, 340, 'Cumulative XP required', { size: 12, fill: C.mute });
  write('fitness-level-curve.svg', svg(900, 360, c, 'Fitness RPG level curve'));
}
console.log('assets written to', out);
