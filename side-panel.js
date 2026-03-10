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

const COLORS = {
    added:   '#22c55e',
    updated: '#3b82f6',
    removed: '#ef4444',
};

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
    ctx.strokeStyle = '#1e1e3a';
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
    ctx.strokeStyle = '#3a3a60';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W - 1, 0);
    ctx.lineTo(W - 1, H);
    ctx.stroke();


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
chrome.storage.local.get(['stats', 'chartData'], (result) => {
    if (result.stats) {
        applyStats(result.stats);
        Object.assign(displayed, target);
        updateDOM();
    }
    if (result.chartData) {
        chartData = result.chartData;
    }
});

// Subsequent updates: animate counters, update chart data.
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.stats)     applyStats(changes.stats.newValue ?? {});
    if (changes.chartData) chartData = changes.chartData.newValue ?? {};
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

function rafLoop() {
    if (stepCounters()) updateDOM();
    drawChart();
    requestAnimationFrame(rafLoop);
}

requestAnimationFrame(rafLoop);
