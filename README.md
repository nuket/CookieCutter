# CookieMonitor

A Chrome extension that lets you visualize Cookie accesses while you're browsing.

## 28 JULY 2025

```
    <script>
        console.log('ok');
    const slider = document.getElementById('customSlider');
    const valueDisplay = document.getElementById('value');
    const customSteps = [0, 2, 4, 6, 8, 20];

    slider.addEventListener('input', function() {
        const index = Math.round(this.value / (this.max / (customSteps.length - 1)));
        this.value = customSteps[index];
        valueDisplay.textContent = this.value;
    });
    </script>
```

## 27 JULY 2025

Interesting.

pi-hole will take all of these requests and sinkhole them.

I see `chrome.webRequest.onBeforeSendHeaders` calls setting up the communication,
but I do not see `chrome.webRequest.onHeadersReceived` for these domains.

Meaning that Chrome / Edge will try looking them up, but it can't talk to them
because DNS returns sinkhole addresses for them.

```
https://www.googletagmanager.com/gtm.js?id=GTM-P3X3VT7
https://widgets.outbrain.com/outbrain.js
https://www.googletagmanager.com/gtag/js?id=G-31EK5CQB08&l=dataLayer&cx=c
https://securepubads.g.doubleclick.net/tag/js/gpt.js
https://cdn.cookielaw.org/scripttemplates/otSDKStub.js
https://gum.criteo.com/sid/json?origin=prebid&topUrl=https%3A%2F%2Fpeople.com%2F&domain=people.com&gdpr=1
https://match.adsrvr.org/track/rid?ttd_pid=uyuqun9&fmt=json
```



## 12 JULY 2025

Read up about Chrome extension service workers.

* https://developer.chrome.com/docs/extensions/develop/concepts/service-workers
* https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics

```
D3 3.4.6

        // "webNavigation",
        // "webRequest",
        // "webRequestBlocking",
        // "storage",
        // "unlimitedStorage",
        // "tabs",
        // "http://*/*",
        // "https://*/*"

    // "background": {
    //     "scripts": ["libs/lodash.min.js", "libs/logger.min.js", "background.js"]
    // },

    "browser_action": {
        "default_icon": "cookie.png"
    },

    "chrome_url_overrides": {
        "newtab": "newtab.html"
    },
```

## Notes

```
service-worker.js:6 start service-worker.js
side-panel.js:1 Run side-panel.js
side-panel.js:34 PointerEvent {isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, …}
side-panel.js:39 (211) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
side-panel.js:40 (183) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
side-panel.js:44 1751903954536
side-panel.js:45 1751904198942.398
side-panel.js:46 244406.39794921875
side-panel.js:54 cookie expires more than 3 days from now: 20388260464 ms
side-panel.js:64 {url: 'https://.bing.com/images', name: '_IDET', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 1730918464 ms
side-panel.js:64 {url: 'https://.bing.com/maps', name: 'mapc', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15724152464 ms
side-panel.js:64 {url: 'http://.msn.com/edge', name: 'pglt-edgeChromium-ntp', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15649872464 ms
side-panel.js:64 {url: 'http://.msn.com/edge', name: 'pglt-edgeChromium-dhp', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262739464 ms
side-panel.js:64 {url: 'http://.lg.com/de', name: 'OptanonAlertBoxClosed', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262748464 ms
side-panel.js:64 {url: 'http://.lg.com/de', name: 'OptanonConsent', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33695350492 ms
side-panel.js:64 {url: 'http://www.bing.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 1961120855 ms
side-panel.js:64 {url: 'http://4.bing.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 281423862 ms
side-panel.js:64 {url: 'https://.edgeservices.bing.com/', name: 'CUID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 2933480602 ms
side-panel.js:64 {url: 'http://edgeservices.bing.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 773479064 ms
side-panel.js:64 {url: 'https://edgeservices.bing.com/', name: 'EDGSRVCPERSIST', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 362210877 ms
side-panel.js:64 {url: 'https://.instagram.com/', name: 'mid', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 2933479464 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'EDGSRCHHPGUSR', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 2353156464 ms
side-panel.js:64 {url: 'https://.web.whatsapp.com/', name: 'wa_web_lang_pref', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_banner-status', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_policy_id', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_marketing', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_statistics', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_preferences', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_functional', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 9919589464 ms
side-panel.js:64 {url: 'https://www.spargelhof-klaistow.de/', name: 'cmplz_consented_services', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 12501497464 ms
side-panel.js:64 {url: 'http://www.richter-steuerkanzlei.de/', name: 'dm_last_visit', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 12501497464 ms
side-panel.js:64 {url: 'http://www.richter-steuerkanzlei.de/', name: 'dm_total_visits', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15527214791 ms
side-panel.js:64 {url: 'http://www.richter-steuerkanzlei.de/', name: '_sp_id.07e2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 12503214464 ms
side-panel.js:64 {url: 'http://www.richter-steuerkanzlei.de/', name: 'dm_last_page_view', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 12503214464 ms
side-panel.js:64 {url: 'http://www.richter-steuerkanzlei.de/', name: 'dm_this_page_view', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 14007085616 ms
side-panel.js:64 {url: 'https://.rheinpfalz.de/', name: '_sp_su', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 18335036086 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'MUID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 18335036086 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'SRCHD', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 18335036086 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'SRCHUID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 16175039464 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'BCP', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 16175045688 ms
side-panel.js:64 {url: 'https://.stackexchange.com/', name: 'prov', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 20388229154 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'MMCASM', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 20388232987 ms
side-panel.js:64 {url: 'http://testfamilysafety.bing.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 20753240464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '__cmpconsentx14485', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 20753240464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '__cmpcccx14485', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23341640464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '_pprv', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23341640464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '_pctx', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23341640464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '_pcid', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777241117 ms
side-panel.js:64 {url: 'http://.morgenpost.de/', name: '_ga', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777308829 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: 'FPID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777241606 ms
side-panel.js:64 {url: 'http://.morgenpost.de/', name: '__tbc', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777241608 ms
side-panel.js:64 {url: 'http://.morgenpost.de/', name: 'xbc', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23341641464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: '_pcus', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 5111241464 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: 'permutive-id', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 20756841464 ms
side-panel.js:64 {url: 'http://www.morgenpost.de/', name: 'pubjs_pubcommonID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777301007 ms
side-panel.js:64 {url: 'https://.morgenpost.de/', name: 'spid.1798', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23777308756 ms
side-panel.js:64 {url: 'http://.morgenpost.de/', name: '_ga_30J8ZHSMNN', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 24713985269 ms
side-panel.js:64 {url: 'http://.nationalgeographic.com/', name: 'SWID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 24722778132 ms
side-panel.js:64 {url: 'http://.nationalgeographic.com/', name: 's_ecid', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 21266779324 ms
side-panel.js:64 {url: 'http://www.nationalgeographic.com/', name: 'loggedin', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 5923547464 ms
side-panel.js:64 {url: 'http://steidl.de/', name: '_pk_ref.74.a052', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 24110748464 ms
side-panel.js:64 {url: 'http://steidl.de/', name: '_pk_id.74.a052', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 24722777717 ms
side-panel.js:64 {url: 'http://.nationalgeographic.com/', name: 'AMCV_5BFD123F5245AECB0A490D45%40AdobeOrg', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 6476230822 ms
side-panel.js:64 {url: 'https://.youtube.com/', name: 'VISITOR_PRIVACY_METADATA', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23209939899 ms
side-panel.js:64 {url: 'https://support.microsoft.com/', name: 'EXPID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23209940647 ms
side-panel.js:64 {url: 'https://support.microsoft.com/', name: 'MicrosoftApplicationsTelemetryDeviceId', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 23209943479 ms
side-panel.js:64 {url: 'https://.microsoft.com/', name: 'MC1', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 671675813 ms
side-panel.js:64 {url: 'https://.web.whatsapp.com/', name: 'wa_ul', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 8972257464 ms
side-panel.js:64 {url: 'https://.microsoft.com/', name: 'MSCC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 28514926025 ms
side-panel.js:64 {url: 'http://heysuper.de/', name: 'cookie_consent_level', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 28514926025 ms
side-panel.js:64 {url: 'http://heysuper.de/', name: 'cookie_consent_user_consent_token', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 28514926025 ms
side-panel.js:64 {url: 'http://heysuper.de/', name: 'cookie_consent_user_accepted', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 28319317014 ms
side-panel.js:64 {url: 'https://.google.com/', name: 'SOCS', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 28378014255 ms
side-panel.js:64 {url: 'https://.google.com/', name: '__Secure-ENID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 27108085464 ms
side-panel.js:64 {url: 'http://.tasteatlas.com/', name: 'didomi_token', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 30045686486 ms
side-panel.js:64 {url: 'http://.tasteatlas.com/', name: '_ga', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 30045692254 ms
side-panel.js:64 {url: 'http://.tasteatlas.com/', name: '_ga_8S6PQJYBCM', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 27021706464 ms
side-panel.js:64 {url: 'https://.gorgonzola.com/', name: '_iub_previous_preference_id', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 27021707464 ms
side-panel.js:64 {url: 'https://.gorgonzola.com/', name: '_iub_cs-73591248', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 11880221640 ms
side-panel.js:64 {url: 'https://community.nxp.com/', name: 'VISITOR_BEACON', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 27636221464 ms
side-panel.js:64 {url: 'http://.nxp.com/', name: 'wa_pers', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 11880222833 ms
side-panel.js:64 {url: 'https://community.nxp.com/', name: 'LithiumVisitor', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 32210944905 ms
side-panel.js:64 {url: 'https://.youtube.com/', name: 'PREF', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31778946541 ms
side-panel.js:64 {url: 'https://.youtube.com/', name: 'SOCS', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31778941842 ms
side-panel.js:64 {url: 'https://.youtube.com/', name: '__Secure-YEC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34286718085 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'USRLOC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33422720653 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'MUID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33422718085 ms
side-panel.js:64 {url: 'http://ntp.msn.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33422718085 ms
side-panel.js:64 {url: 'http://.msn.com/', name: '_EDGE_V', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31535354185 ms
side-panel.js:64 {url: 'https://ntp.msn.com/', name: 'MicrosoftApplicationsTelemetryDeviceId', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33422719599 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'MUIDB', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262718464 ms
side-panel.js:64 {url: 'http://.ntp.msn.com/', name: 'sptmarket_restored', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34286719337 ms
side-panel.js:64 {url: 'http://ntp.msn.com/', name: 'sptmarket', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 7775353739 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'msnup', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33422720653 ms
side-panel.js:64 {url: 'https://.c.msn.com/', name: 'SRM_M', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 331520653 ms
side-panel.js:64 {url: 'https://.c.msn.com/', name: 'MR', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34286721007 ms
side-panel.js:64 {url: 'http://srtb-ax.msn.com/', name: 'sptmarket', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262721464 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'OptanonAlertBoxClosed', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262721464 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'eupubconsent-v2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31283699464 ms
side-panel.js:64 {url: 'http://.lg.com/', name: 'coveo_visitorId', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262748464 ms
side-panel.js:64 {url: 'http://.lg.com/', name: 'DE_LGCOM_ANALYSIS_OF_SITE', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262748464 ms
side-panel.js:64 {url: 'http://.lg.com/', name: 'DE_LGCOM_IMPROVEMENTS', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31262748464 ms
side-panel.js:64 {url: 'http://.lg.com/', name: 'DE_LGCOM_ADVERTISING', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34286749492 ms
side-panel.js:64 {url: 'http://.lg.com/', name: 'mbox', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzma', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmb', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzme', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__ssds', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__ssuzjsr2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmaj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmbj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmc', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmd', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601174 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmf', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmcj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmdj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmlj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15283200464 ms
side-panel.js:64 {url: 'http://.ebay.de/', name: '__uzmfj2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15279601926 ms
side-panel.js:64 {url: 'https://.ebay.de/', name: '__deba', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31263634869 ms
side-panel.js:64 {url: 'https://.ebay.de/', name: 'ns1', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34287634869 ms
side-panel.js:64 {url: 'https://.ebay.de/', name: 'dp1', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34287634869 ms
side-panel.js:64 {url: 'https://.ebay.de/', name: 'nonsession', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15411896464 ms
side-panel.js:64 {url: 'http://developer.chrome.com/', name: 'django_language', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33638447464 ms
side-panel.js:64 {url: 'http://developer.chrome.com/', name: 'cookies_accepted', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31397205676 ms
side-panel.js:64 {url: 'https://.github.com/', name: '_octo', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31397205676 ms
side-panel.js:64 {url: 'https://.github.com/', name: 'logged_in', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31446984337 ms
side-panel.js:64 {url: 'https://ntp.msn.com/', name: 'MSFPC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31461012291 ms
side-panel.js:64 {url: 'https://www.msn.com/', name: 'MicrosoftApplicationsTelemetryDeviceId', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31447669180 ms
side-panel.js:64 {url: 'https://edgecompanion.msn.com/', name: 'MicrosoftApplicationsTelemetryDeviceId', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31447001802 ms
side-panel.js:64 {url: 'https://edgecompanion.msn.com/', name: 'MSFPC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33607209384 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'USRLOC', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 34482679661 ms
side-panel.js:64 {url: 'http://www.msn.com/', name: 'sptmarket', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31472621464 ms
side-panel.js:64 {url: 'http://.w3schools.com/', name: '_sharedID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31472621464 ms
side-panel.js:64 {url: 'http://.w3schools.com/', name: '_sharedID_cst', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31472621464 ms
side-panel.js:64 {url: 'http://.w3schools.com/', name: '_sharedID_last', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33632626007 ms
side-panel.js:64 {url: 'https://.w3schools.com/', name: 'snconsent', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33632626007 ms
side-panel.js:64 {url: 'https://.w3schools.com/', name: 'euconsent-v2', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31534772918 ms
side-panel.js:64 {url: 'https://.stackoverflow.com/', name: 'prov', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 2534040464 ms
side-panel.js:64 {url: 'https://chromewebstore.google.com/', name: 'OTZ', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 15753243465 ms
side-panel.js:64 {url: 'https://.google.com/', name: 'NID', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31535344171 ms
side-panel.js:64 {url: 'https://.bing.com/', name: '_RwBf', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33695343464 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'SRCHHPGUSR', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 33695347408 ms
side-panel.js:64 {url: 'https://.bing.com/', name: 'SRCHUSR', expirationDate: 1752163154.536}
side-panel.js:54 cookie expires more than 3 days from now: 31535352464 ms
side-panel.js:64 {url: 'https://.msn.com/', name: 'OptanonConsent', expirationDate: 1752163154.536}
```