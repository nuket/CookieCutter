// --------------------------------------------------------------------------
// CookieMonitor
// Copyright (c) 2025 Max Vilimpoc, all rights reserved
// --------------------------------------------------------------------------

'use strict';

console.log('Run side-panel.js');

// // Filter out properties that chrome.cookies.set() does not like.
// function cookieDetails(cookie) {
//     const details = ['domain', 'expirationDate', 'httpOnly', 'name', 'partitionKey', 'path', 'sameSite', 'secure', 'storeId', 'url', 'value'];

//     let out = {};
//     details.forEach(detail => {
    //         if (cookie[detail]) out[detail] = cookie[detail];
//     });

//     const protocol = cookie.secure ? 'https:' : 'http:';
//     out['url'] = `${protocol}//${cookie.domain}${cookie.path}`;

//     console.log(out['url']);

//     return out;
// }

// const slider = document.getElementById('customSlider');
// const valueDisplay = document.getElementById('value');
// const customSteps = [5, 60, 6 * 60, 12 * 60, 24 * 60, 2 * 24 * 60, 3 * 24 * 60];

// slider.addEventListener('input', function() {
//     const index = Math.round(this.value / (this.max / (customSteps.length - 1)));
//     this.value = customSteps[index];
//     valueDisplay.textContent = this.value;
// });

let currentStats = {
    active: 0,
    added: 0,
    updated: 0,
    removed: 0,
    expired: 0
};

let newStats = {
    active: 0,
    added: 0,
    updated: 0,
    removed: 0,
    expired: 0
};

let updateStatsIntervalId = 0;

const updateStats = (a, b) => {
    let diff = 0;

    if (a.active  < b.active)  { diff++; a.active++;  }
    if (a.added   < b.added)   { diff++; a.added++;   }
    if (a.updated < b.updated) { diff++; a.updated++; }
    if (a.removed < b.removed) { diff++; a.removed++; }
    if (a.expired < b.expired) { diff++; a.expired++; }

    document.getElementById('stats-active').textContent  = a.active;
    document.getElementById('stats-added').textContent   = a.added;
    document.getElementById('stats-updated').textContent = a.updated;
    document.getElementById('stats-removed').textContent = a.removed;
    document.getElementById('stats-expired').textContent = a.expired;

    if (diff == 0) {
        if (updateStatsIntervalId) {
            clearInterval(updateStatsIntervalId);
            updateStatsIntervalId = 0;
        }
    }
};

window.addEventListener('statsUpdateEvent', (e) => {
    newStats = e.detail.stats;
    updateStatsIntervalId = setInterval(updateStats, 33, currentStats, newStats);
});

function stripCookie(cookie, newExpiry) {
    const protocol = cookie.secure ? 'https:' : 'http:';
    const domain = (String(cookie.domain).startsWith('.')) ? String(cookie.domain).substring(1) : cookie.domain;

    const url = `${protocol}//${domain}${cookie.path}`;

    // domain: cookie.domain,
    return {
        url: url,
        name: cookie.name,
        expirationDate: newExpiry,
        storeId: cookie.storeId
    };
}

async function clickGetAll(e) {
    console.log(e);

    let all = await chrome.cookies.getAll({});
    let stored = all.filter(cookie => cookie.session === false);

    console.log(all);
    console.log(stored);

    let now = new Date().getTime(); // time since epoch in ms

    console.log(now);
    console.log(stored[0].expirationDate * 1000);
    console.log(stored[0].expirationDate * 1000 - now);

    stored.forEach(async cookie => {
        const remainingMs = Math.ceil(cookie.expirationDate * 1000 - now);
        const threeDaysMs = 3 * 86400 * 1000;
        const newExpirationDateSeconds = (now + threeDaysMs) / 1000;

        if (remainingMs > threeDaysMs) {
            console.log(`cookie expires more than 3 days from now: ${remainingMs} ms`);
            // console.log(cookie["expirationDate"]);

            // Rewrite cookie to expire in 3 days.
            // cookie.set({expirationDate: newExpirationDateSeconds});
            // cookie["expirationDate"] = newExpirationDateSeconds;
            // console.log(cookie["expirationDate"]);

            // const newCookie = copyCookie(cookie, newExpirationDateSeconds);
            let newCookie = stripCookie(cookie, newExpirationDateSeconds);
            console.log(newCookie);

            // await chrome.cookies.remove(newCookie);
            try {
                await chrome.cookies.set(newCookie);
            }
            catch {
                console.log('could not set');
                console.log(cookie);
                console.log(newCookie);
            }
        }
    });

    stored.forEach(async cookie => {
        try {
            if (cookie.domain.contains('bing.com')) {
                console.log('Cookie from bing.com');
            }
        }
        catch {
            console.log('Ok')
        }
    });
};

// document.getElementById('getAll').addEventListener('click', clickGetAll);

// // The async IIFE is necessary because Chrome <89 does not support top level await.
// (async function initPopupWindow() {

//     // How many cookies are non-session (disk-stored) with an expiration date?

//     let all = await chrome.cookies.getAll({});
//     let stored = all.filter(cookie => cookie.session === false);
// })();

// async function deleteDomainCookies(domain) {
//     let cookiesDeleted = 0;
//     try {
//         const cookies = await chrome.cookies.getAll({ domain });

//         if (cookies.length === 0) {
//             return 'No cookies found';
//         }

//         let pending = cookies.map(deleteCookie);
//         await Promise.all(pending);

//         cookiesDeleted = pending.length;
//     } catch (error) {
//         return `Unexpected error: ${error.message}`;
//     }

//     return `Deleted ${cookiesDeleted} cookie(s).`;
// }

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );

        if (key === 'stats') {
            // const stats = newValue;
            // console.log(newValue);

            // Update the various observers.
            window.dispatchEvent(new CustomEvent('statsUpdateEvent', {
                detail: {
                    stats: newValue
                }
            }));
        }
    }
});
