// --------------------------------------------------------------------------
// CookieMonitor
// Copyright (c) 2025 Max Vilimpoc, all rights reserved
// --------------------------------------------------------------------------

'use strict';

console.log('Run service-worker.js');

const stats = {
    active: 0,
    added: 0,
    updated: 0,
    removed: 0,
    expired: 0
};

chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error) => console.error(error));

// import { hello } from './background.js'
// console.log(hello);

// debugger;

// --------------------------------------------------------------------------
// chrome.webNavigation
// --------------------------------------------------------------------------

// onBeforeNavigate -> onCommitted -> [onDOMContentLoaded] -> onCompleted

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    console.log('chrome.webNavigation.onBeforeNavigate');
    console.log(details);
})

chrome.webNavigation.onCommitted.addListener((details) => {
    console.log('chrome.webNavigation.onCommitted');
    console.log(details);
})

chrome.webNavigation.onCompleted.addListener((details) => {
    // chrome.notifications.create({
    //     type: 'basic',
    //     iconUrl: 'cookie.png',
    //     title: 'Page Loaded',
    //     message: `Completed loading: ${details.url} at ${details.timeStamp} milliseconds since the epoch.`
    // });
    console.log('chrome.webNavigation.onCompleted');
    console.log(details);
});

// --------------------------------------------------------------------------
// chrome.webRequest
// --------------------------------------------------------------------------

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    console.log('chrome.webRequest.onBeforeSendHeaders');
    console.log(details);
}, { urls: ['<all_urls>'] }, ['extraHeaders', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener((details) => {
    console.log('chrome.webRequest.onHeadersReceived');
    console.log(details);
}, {urls:['<all_urls>']}, ['extraHeaders', 'responseHeaders']);

// chrome.webRequest.onCompleted.addListener((details) => {
    //     console.log(details);
// }, { urls: ['<all_urls>'] }, ['blocking']
// );

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({
//         url: chrome.extension.getURL('manager.html'),
//         selected: true,
//     })
// })

// --------------------------------------------------------------------------
// chrome.cookies
// --------------------------------------------------------------------------

let updateStatsTimeoutId;

const updateStats = async (stats) => {
    let cookies = await chrome.cookies.getAll({});
    stats.active = cookies.length;

    chrome.storage.local.set({ stats: stats });

    console.log(stats);
}

// Track possible cookie updates
let lastCookie = { name: '', domain: '' };

chrome.cookies.onChanged.addListener((details) => {
    console.log('chrome.cookies.onChanged');

    // https://developer.chrome.com/docs/extensions/reference/api/cookies#type-OnChangedCause
    // The underlying reason behind the cookie's change.
    // If a cookie was inserted, or removed via an explicit call to "chrome.cookies.remove", "cause" will be "explicit".
    // If a cookie was automatically removed due to expiry, "cause" will be "expired".
    // If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite".
    // If a cookie was automatically removed due to garbage collection, "cause" will be "evicted".
    // If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite".
    // Plan your response accordingly.
    // "evicted"
    // "expired"
    // "explicit"
    // "expired_overwrite"
    // "overwrite"

    if (details.cause === 'overwrite' && details.removed === true) {
        // {cause: 'overwrite', cookie: {…}, removed: true}
        lastCookie = details;
    }
    else
    if ((details.cause === 'expired_overwrite' && details.removed === true) ||
        (details.cause === 'evicted') ||
        (details.cause === 'expired') ) {
        // {cause: 'expired_overwrite', cookie: {…}, removed: true}
        stats.removed++;
    }
    else
    if (details.cause === 'explicit' && details.removed === false) {
        // {cause: 'explicit', cookie: {…}, removed: false}
        if (lastCookie.name === details.name && lastCookie.domain === details.domain) {
            stats.updated++;
        }
        else {
            stats.added++;
        }

        lastCookie = { name: '', domain: '' };
    }
    else {
        console.log('Unknown combination of details seen.');
        console.log(details);
    }

    // Rate limit the updates to once every 2 seconds.
    // Since cookies are set rapidly in groups while a page is loading, we
    // don't need to hammer the storage instance.
    if (updateStatsTimeoutId) {
        clearTimeout(updateStatsTimeoutId);
        updateStatsTimeoutId = 0;
    }

    updateStatsTimeoutId = setTimeout(updateStats, 2000, stats);
});

// var optionsTab;

// chrome.action.onClicked.addListener((tab) => {
//     // if (optionsTab) {
//     //     debugger;
//     // }
//     // else {
//         chrome.tabs.create({url: "options.html"}, (createdTab) => {
//             console.log('Tab created.');
//             console.log(createdTab);

//             optionsTab = createdTab;
//         });
//     // }
// });
