// --------------------------------------------------------------------------
// CookieMonitor
// Copyright (c) 2025 Max Vilimpoc, all rights reserved
// --------------------------------------------------------------------------

'use strict';

console.log('Run service-worker.js');

// --------------------------------------------------------------------------
// State
// --------------------------------------------------------------------------

let stats = { active: 0, added: 0, updated: 0, removed: 0, expired: 0 };
let maxAgeDays = 14;

// chartData: { [secondStr]: { added, updated, removed } }
// Keyed by Unix second string for easy serialization and gap detection.
let chartData = {};

// domainLastModified: { [domain]: timestampMs }
let domainLastModified = {};

// Pending overwrite map: tracks "overwrite+removed" events waiting for
// the matching "explicit+added" event. key = name + "||" + domain, value = timestamp.
const pendingOverwrites = new Map();
const OVERWRITE_TTL_MS = 200;

let debounceTimer = null;

// --------------------------------------------------------------------------
// Startup: restore persisted state
// --------------------------------------------------------------------------

let initialized = false;

async function init() {
    if (initialized) return;
    initialized = true;

    const stored = await chrome.storage.local.get(['stats', 'chartData', 'domainLastModified', 'maxAgeDays']);
    if (stored.stats)               Object.assign(stats, stored.stats);
    if (stored.chartData)           chartData = stored.chartData;
    if (stored.domainLastModified)  domainLastModified = stored.domainLastModified;
    if (stored.maxAgeDays !== undefined) maxAgeDays = stored.maxAgeDays;

    // Recount active cookies to correct any drift.
    const all = await chrome.cookies.getAll({});
    stats.active = all.length;
    await chrome.storage.local.set({ stats, chartData, domainLastModified });
    console.log('Initialized:', stats);
}

init();

// Keep maxAgeDays in sync when the side panel changes it.
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.maxAgeDays) {
        maxAgeDays = changes.maxAgeDays.newValue ?? 14;
        console.log('maxAgeDays updated to', maxAgeDays);
    }
});

// --------------------------------------------------------------------------
// Cookie age enforcement
// --------------------------------------------------------------------------

async function enforceMaxAge(cookie) {
    if (!cookie.expirationDate) return; // session cookie — no expiry to limit

    const maxExpirySec = Date.now() / 1000 + maxAgeDays * 86400;
    if (cookie.expirationDate <= maxExpirySec) return; // already within limit

    const protocol = cookie.secure ? 'https:' : 'http:';
    const host     = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
    const url      = `${protocol}//${host}${cookie.path}`;

    try {
        await chrome.cookies.set({
            url,
            name:           cookie.name,
            value:          cookie.value,
            domain:         cookie.hostOnly ? undefined : cookie.domain,
            path:           cookie.path,
            secure:         cookie.secure,
            httpOnly:       cookie.httpOnly,
            sameSite:       cookie.sameSite === 'unspecified' ? undefined : cookie.sameSite,
            expirationDate: maxExpirySec,
            storeId:        cookie.storeId,
        });
        console.log(`Capped ${cookie.name} on ${cookie.domain} to ${maxAgeDays}d`);
    } catch (e) {
        console.warn('enforceMaxAge failed:', e);
    }
}

// --------------------------------------------------------------------------
// Side panel behavior
// --------------------------------------------------------------------------

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// --------------------------------------------------------------------------
// Chart bucket helpers
// --------------------------------------------------------------------------

const CHART_BUCKETS = 90;

function getBucket() {
    const key = String(Math.floor(Date.now() / 1000));
    if (!chartData[key]) {
        chartData[key] = { added: 0, updated: 0, removed: 0 };
    }
    return chartData[key];
}

function pruneChartData() {
    const cutoff = Math.floor(Date.now() / 1000) - CHART_BUCKETS;
    for (const key of Object.keys(chartData)) {
        if (Number(key) < cutoff) delete chartData[key];
    }
}

// --------------------------------------------------------------------------
// Debounced storage flush
// --------------------------------------------------------------------------

function scheduleFlush() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flush, 500);
}

async function flush() {
    debounceTimer = null;
    pruneChartData();
    const all = await chrome.cookies.getAll({});
    stats.active = all.length;

    // Prune domains that no longer have any active cookies.
    const activeDomains = new Set(all.map(c => c.domain));
    for (const domain of Object.keys(domainLastModified)) {
        if (!activeDomains.has(domain)) delete domainLastModified[domain];
    }

    await chrome.storage.local.set({ stats, chartData, domainLastModified });
    console.log(stats);
}

// --------------------------------------------------------------------------
// Cookie change listener
// --------------------------------------------------------------------------

chrome.cookies.onChanged.addListener((details) => {
    if (!initialized) return;

    const { cause, removed, cookie } = details;
    const overwriteKey = cookie.name + '||' + cookie.domain;
    const now = Date.now();

    // Evict stale pending overwrite entries.
    for (const [k, ts] of pendingOverwrites) {
        if (now - ts > OVERWRITE_TTL_MS) pendingOverwrites.delete(k);
    }

    const bucket = getBucket();

    if (cause === 'overwrite' && removed === true) {
        // First half of an update: old cookie being displaced.
        pendingOverwrites.set(overwriteKey, now);
    }
    else if (cause === 'explicit' && removed === false) {
        // Either a new cookie or the second half of an update.
        if (pendingOverwrites.has(overwriteKey)) {
            pendingOverwrites.delete(overwriteKey);
            stats.updated++;
            bucket.updated++;
        } else {
            stats.added++;
            bucket.added++;
        }
        domainLastModified[cookie.domain] = now;
        enforceMaxAge(cookie);
    }
    else if (cause === 'explicit' && removed === true) {
        stats.removed++;
        bucket.removed++;
        domainLastModified[cookie.domain] = now;
    }
    else if (cause === 'expired' || cause === 'expired_overwrite') {
        stats.removed++;
        stats.expired++;
        bucket.removed++;
        domainLastModified[cookie.domain] = now;
    }
    else if (cause === 'evicted') {
        stats.removed++;
        bucket.removed++;
        domainLastModified[cookie.domain] = now;
    }
    else {
        console.log('Unhandled cookie change:', details);
    }

    scheduleFlush();
});
