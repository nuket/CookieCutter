// --------------------------------------------------------------------------
// CookieMonitor
// Copyright (c) 2025 Max Vilimpoc, all rights reserved
// --------------------------------------------------------------------------

'use strict';

// console.log('Start background.js');

// debugger;

// console.log('Next statement');

// Logger.useDefaults();
// Logger.setLevel(Logger.WARN);

// webnavLogger.setLevel(Logger.WARN);
// webreqLogger.setLevel(Logger.DEBUG);
// cookieLogger.setLevel(Logger.WARN);
// stampsLogger.setLevel(Logger.DEBUG);

console.log('Start service-worker.js');

// debugger;

chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error) => console.error(error));

// import { hello } from './background.js'

// console.log(hello);

// debugger;

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

// chrome.webRequest.onCompleted.addListener((details) => {
    //     console.log(details);
// }, { urls: ['<all_urls>'] }, ['blocking']
// );

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    console.log('chrome.webRequest.onBeforeSendHeaders');
    console.log(details);
}, { urls: ['<all_urls>'] }, ['extraHeaders', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener((details) => {
    console.log('chrome.webRequest.onHeadersReceived');
    console.log(details);
}, {urls:['<all_urls>']}, ['extraHeaders', 'responseHeaders']);

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({
//         url: chrome.extension.getURL('manager.html'),
//         selected: true,
//     })
// })

chrome.cookies.onChanged.addListener((details) => {
    console.log('chrome.cookies.onChanged');
    console.log(details);



});

var optionsTab;

chrome.action.onClicked.addListener((tab) => {
    // if (optionsTab) {
    //     debugger;
    // }
    // else {
        chrome.tabs.create({url: "options.html"}, (createdTab) => {
            console.log('Tab created.');
            console.log(createdTab);

            optionsTab = createdTab;
        });
    // }
});

// "options_page": "options.html",
// "side_panel": {
//     "default_path": "manager.html"
// },
// "action": {
//     "default_popup": "manager.html"
// },

