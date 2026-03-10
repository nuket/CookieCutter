// --------------------------------------------------------------------------
// CookieMonitor
// Copyright (c) 2025 Max Vilimpoc, all rights reserved
// --------------------------------------------------------------------------

'use strict';

console.log('Run side-panel.js');

// --------------------------------------------------------------------------
// Stats counters
// --------------------------------------------------------------------------

const displayed = { active: 0, added: 0, updated: 0, removed: 0, expired: 0 };
const target    = { active: 0, added: 0, updated: 0, removed: 0, expired: 0 };

const valEls = {
    active:  document.getElementById('val-active'),
    added:   document.getElementById('val-added'),
    updated: document.getElementById('val-updated'),
    removed: document.getElementById('val-removed'),
    expired: document.getElementById('val-expired'),
};

function updateDOM() {
    for (const key of Object.keys(displayed)) {
        valEls[key].textContent = displayed[key].toLocaleString();
    }
}

// Step displayed counters toward target, returning true if any changed.
function stepCounters() {
    let changed = false;
    for (const key of Object.keys(displayed)) {
        const gap = target[key] - displayed[key];
        if (gap === 0) continue;
        const step = gap > 0
            ? Math.max(1, Math.ceil(gap / 8))
            : Math.min(-1, Math.floor(gap / 8));
        displayed[key] += step;
        // Clamp to target to avoid overshoot.
        displayed[key] = gap > 0
            ? Math.min(displayed[key], target[key])
            : Math.max(displayed[key], target[key]);
        changed = true;
    }
    return changed;
}

// --------------------------------------------------------------------------
// Chart
// --------------------------------------------------------------------------

// chartData: { [secondStr]: { added, updated, removed } }
let chartData = {};

const CHART_BARS = 60;
const BAR_GAP    = 1;

const COLORS = { added: '', updated: '', removed: '', grid: '', marker: '' };

function syncColors() {
    const s = getComputedStyle(document.documentElement);
    COLORS.added   = s.getPropertyValue('--green').trim();
    COLORS.updated = s.getPropertyValue('--blue').trim();
    COLORS.removed = s.getPropertyValue('--red').trim();
    COLORS.grid    = s.getPropertyValue('--chart-grid').trim();
    COLORS.marker  = s.getPropertyValue('--chart-marker').trim();
}

syncColors();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncColors);

const canvas  = document.getElementById('chart');
const ctx     = canvas.getContext('2d');
let canvasW   = 0;
let canvasH   = 0;

function drawChart() {
    if (canvasW === 0 || canvasH === 0) return;

    const W = canvasW;
    const H = canvasH;

    // Clear to background colour.
    ctx.clearRect(0, 0, W, H);

    const nowMs    = Date.now();
    const nowSec   = Math.floor(nowMs / 1000);
    const fraction = (nowMs % 1000) / 1000;

    // Bar width distributes evenly across the canvas.
    const bw = (W - BAR_GAP * (CHART_BARS - 1)) / CHART_BARS;

    // Build visible bucket array: index 0 = newest, index 59 = oldest.
    const buckets = [];
    for (let i = 0; i < CHART_BARS; i++) {
        const key = String(nowSec - i);
        buckets.push(chartData[key] ?? { added: 0, updated: 0, removed: 0 });
    }

    // Find the maximum combined value for y-scaling.
    let maxTotal = 1;
    for (const b of buckets) {
        const t = b.added + b.updated + b.removed;
        if (t > maxTotal) maxTotal = t;
    }

    // Draw grid lines (horizontal, at 25% / 50% / 75% of chart height).
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (const pct of [0.25, 0.5, 0.75]) {
        const y = Math.round(H * (1 - pct));
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // Draw bars: i=0 is newest (rightmost), i=59 is oldest (leftmost).
    // Smooth-scroll formula: as `fraction` goes 0→1, bars shift one
    // full bar-slot to the left, then a new bar snaps in at the right.
    for (let i = 0; i < CHART_BARS; i++) {
        const x = W - (fraction + i + 1) * (bw + BAR_GAP);
        if (x + bw < 0) break;   // remaining bars are off the left edge
        if (x > W)      continue; // bar is off the right edge

        const b = buckets[i];
        const total = b.added + b.updated + b.removed;
        if (total === 0) continue;

        // Draw segments from bottom up: removed, updated, added.
        let yBase = H;
        for (const [field, color] of [
            ['removed', COLORS.removed],
            ['updated', COLORS.updated],
            ['added',   COLORS.added],
        ]) {
            const segH = (b[field] / maxTotal) * H;
            if (segH < 0.5) continue;
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.round(x),
                Math.round(yBase - segH),
                Math.ceil(bw),
                Math.ceil(segH),
            );
            yBase -= segH;
        }
    }

    // "Now" marker — subtle vertical line at the right edge.
    ctx.strokeStyle = COLORS.marker;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W - 1, 0);
    ctx.lineTo(W - 1, H);
    ctx.stroke();


}

// --------------------------------------------------------------------------
// Cookie list
// --------------------------------------------------------------------------

const cookieListEl = document.getElementById('cookie-list');

const GROUPS = [
    { id: 'week',    label: 'Less than 1 week',   minDays: 0,  maxDays: 7        },
    { id: 'month',   label: '1 week – 1 month',   minDays: 7,  maxDays: 30       },
    { id: '2mo',     label: '1 – 2 months',        minDays: 30, maxDays: 60       },
    { id: '3mo',     label: '2 – 3 months',        minDays: 60, maxDays: 90       },
    { id: 'rest',    label: 'More than 3 months',  minDays: 90, maxDays: Infinity },
    { id: 'session', label: 'Session',             session: true                  },
];

// domainLastModified: { [domain]: timestampMs }
let domainLastModified = {};

function timeAgo(ms) {
    const diff = Date.now() - ms;
    if (diff < 10000)    return 'just now';
    if (diff < 60000)    return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
}

// Tracks which groups the user has collapsed.
const collapsedGroups = new Set();

// Last fetched cookie list, cached so toggling groups doesn't re-fetch.
let lastCookies = [];

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderCookies(cookies) {
    const nowSec = Date.now() / 1000;

    // Bucket cookies into groups.
    const buckets = Object.fromEntries(GROUPS.map(g => [g.id, []]));

    for (const c of cookies) {
        if (!c.expirationDate) {
            buckets['session'].push(c);
            continue;
        }
        const days = (c.expirationDate - nowSec) / 86400;
        for (const g of GROUPS) {
            if (g.session) continue;
            if (days >= g.minDays && days < g.maxDays) {
                buckets[g.id].push(c);
                break;
            }
        }
    }

    // Sort: expiring groups by soonest first; session by domain then name.
    for (const g of GROUPS) {
        if (g.session) {
            buckets[g.id].sort((a, b) =>
                a.domain.localeCompare(b.domain) || a.name.localeCompare(b.name));
        } else {
            buckets[g.id].sort((a, b) => (a.expirationDate ?? 0) - (b.expirationDate ?? 0));
        }
    }

    const html = GROUPS.map(g => {
        const items = buckets[g.id];
        if (items.length === 0) return '';

        const open = !collapsedGroups.has(g.id);
        const rows = items.map(c => {
            const name   = escapeHTML(c.name   || '(no name)');
            const domain = escapeHTML(c.domain || '');
            const ts     = domainLastModified[c.domain];
            const time   = ts ? timeAgo(ts) : '';
            return `<li class="cookie-item">` +
                   `<span class="cookie-name">${name}</span>` +
                   `<span class="cookie-domain">${domain}</span>` +
                   `<span class="cookie-time" data-domain="${domain}">${time}</span>` +
                   `</li>`;
        }).join('');

        return `<div class="group" data-id="${g.id}">` +
            `<button class="group-header" aria-expanded="${open}">` +
                `<span class="group-toggle">${open ? '▾' : '▸'}</span>` +
                `<span class="group-label">${escapeHTML(g.label)}</span>` +
                `<span class="group-count">${items.length}</span>` +
            `</button>` +
            (open ? `<ul class="group-items">${rows}</ul>` : '') +
            `</div>`;
    }).join('');

    cookieListEl.innerHTML = html;

    for (const btn of cookieListEl.querySelectorAll('.group-header')) {
        btn.addEventListener('click', () => {
            const id = btn.closest('.group').dataset.id;
            if (collapsedGroups.has(id)) {
                collapsedGroups.delete(id);
            } else {
                collapsedGroups.add(id);
            }
            renderCookies(lastCookies);
        });
    }
}

async function loadCookies() {
    lastCookies = await chrome.cookies.getAll({});
    renderCookies(lastCookies);
}

// --------------------------------------------------------------------------
// Storage
// --------------------------------------------------------------------------

function applyStats(newStats) {
    for (const key of Object.keys(target)) {
        if (newStats[key] !== undefined) {
            target[key] = newStats[key];
        }
    }
}

// Initial load: set displayed and target to the same values (no animation).
chrome.storage.local.get(['stats', 'chartData', 'domainLastModified'], (result) => {
    if (result.stats) {
        applyStats(result.stats);
        Object.assign(displayed, target);
        updateDOM();
    }
    if (result.chartData)          chartData = result.chartData;
    if (result.domainLastModified) domainLastModified = result.domainLastModified;
    loadCookies();
});

// Subsequent updates: animate counters, update chart data, refresh cookie list.
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.stats)               applyStats(changes.stats.newValue ?? {});
    if (changes.chartData)           chartData = changes.chartData.newValue ?? {};
    if (changes.domainLastModified)  domainLastModified = changes.domainLastModified.newValue ?? {};
    if (changes.stats || changes.chartData) loadCookies();
});

// --------------------------------------------------------------------------
// Canvas resize
// --------------------------------------------------------------------------

const dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    canvasW = Math.round(cssW * dpr);
    canvasH = Math.round(cssH * dpr);
    canvas.width  = canvasW;
    canvas.height = canvasH;
}

new ResizeObserver(resizeCanvas).observe(canvas);

// --------------------------------------------------------------------------
// Animation loop
// --------------------------------------------------------------------------

let lastTimeTick = 0;

function tickTimeElements() {
    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec === lastTimeTick) return;
    lastTimeTick = nowSec;
    for (const el of cookieListEl.querySelectorAll('.cookie-time[data-domain]')) {
        const ts = domainLastModified[el.dataset.domain];
        el.textContent = ts ? timeAgo(ts) : '';
    }
}

function rafLoop() {
    if (stepCounters()) updateDOM();
    tickTimeElements();
    drawChart();
    requestAnimationFrame(rafLoop);
}

requestAnimationFrame(rafLoop);
