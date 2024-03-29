/*! Copyright ©2015-2024 AppFer S.R.L. - All rights reserved. */
handleUrl();

function handleUrl() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params) {
        if (params["isad"] === "1") {
            window.localStorage.setItem("isad", "1");
            window.localStorage.setItem("cid", params["cid"]);
        }
    }
    handleLanguagePath();
}

function handleLanguagePath() {
    let url = window.location.href;
    if (!url || url.search("/localized/") < 0) {
        return;
    }
    const languageCode = getLangCodeFromUrl(url);
    if (!!languageCode) {
        changeLanguageCookie(languageCode);
        if (languageCode === "en") {
            window.location.replace(url.replace("/localized/en", ""));
        }
    }
}

function changeLanguage(newLanguageCode) {
    changeLanguageCookie(newLanguageCode);
    let url = window.location.href;
    if (!url || url.search("/localized/") < 0) {
        window.location.reload();
    } else {
        const languageCode = getLangCodeFromUrl(url);
        if (!!languageCode) {
            window.location.replace(url.replace("/localized/" + languageCode, "/localized/" + newLanguageCode));
        }
    }
}

function getLangCodeFromUrl(url) {
    if (url.endsWith("#")) {
        url = url.substring(0, url.length - 1);
    }
    let localePath = RegExp("/localized/..$").exec(url);
    if (!!localePath && !!localePath[0]) {
        return localePath[0].substring(localePath[0].length - 2, localePath[0].length);
    } else {
        localePath = RegExp("/localized/../").exec(url);
        if (!!localePath && !!localePath[0]) {
            return localePath[0].substring(localePath[0].length - 3, localePath[0].length - 1);
        }
    }
    return null;
}

function changeLanguageCookie(languageCode) {
    if (typeof Cookies !== "undefined") {
        Cookies.set("firebase-language-override", languageCode);
    } else {
        document.cookie = "firebase-language-override=" + languageCode + ";path=/";
    }
}

function initializeNavbar() {
    let webAppAuthUrl = "https://webapp.fastbudget.app/authentication";
    let webAppSignUpUrl = "https://webapp.fastbudget.app/registration";
    if (window.localStorage.getItem("isad") === "1") {
        webAppAuthUrl = webAppAuthUrl.concat("?isad=1&cid=" + window.localStorage.getItem("cid"));
        webAppSignUpUrl = webAppSignUpUrl.concat("?isad=1&cid=" + window.localStorage.getItem("cid"));
    }
    $("#navbutton_web_app_auth").on("click", () => {
        window.location.href = webAppAuthUrl;
    });
    $("#navbutton_web_app_signup").on("click", () => {
        window.location.href = webAppSignUpUrl;
    });
    return webAppAuthUrl;
}

function initializeFaqAnswerPage(title, contentHtml, appName, translatedContent = true) {
    const url = translatedContent ? "/faq/faq-question-base.html" : "/faq/faq-question-base-with-tr.html";
    $("body").load(url, null, function () {
        $("#faq_card_title").text(title);
        $("#faq_card_content").html(contentHtml);
    });
    const titleHead = title.trim();
    const contentHead = contentHtml.trim().substring(0, 250) + "...";
    const $head = $("head");
    $head.prepend('<meta name="description" content="' + contentHtml + '">');
    $head.prepend('<meta property="og:description" content="' + contentHead + '">');
    $head.find("title").text(titleHead + " - Fast Budget");
    $head.prepend('<meta name="og:title" content="' + titleHead + " - " + appName + '">');
    _setFaqHrefLangTags();
}

function _setFaqHrefLangTags() {
    let fileName = location.pathname.split("/").slice(-1)[0];
    const $head = $("head");
    $head.prepend('<link rel="alternate" hreflang="en" href="https://fastbudget.app/faq/answer/' + fileName + '"/>');
    $head.prepend('<link rel="alternate" hreflang="it" href="https://fastbudget.app/localized/it/faq/answer/' + fileName + '"/>');
    $head.prepend('<link rel="alternate" hreflang="pt" href="https://fastbudget.app/localized/pt/faq/answer/' + fileName + '"/>');
    $head.prepend('<link rel="alternate" hreflang="x-default" href="https://fastbudget.app/faq/answer/' + fileName + '"/>');
    switch (Cookies.get("firebase-language-override")) {
        case "en":
            $head.prepend('<link rel="canonical" href="https://fastbudget.app/faq/answer/' + fileName + '"/>');
            break;
        case "it":
            $head.prepend('<link rel="canonical" href="https://fastbudget.app/localized/it/faq/answer/' + fileName + '"/>');
            break;
        case "pt":
            $head.prepend('<link rel="canonical" href="https://fastbudget.app/localized/pt/faq/answer/' + fileName + '"/>');
            break;
        default:
    }
}

function mctAlert() {
    let element = document.getElementById("mct_alert");
    if (!element) {
        return;
    }
    let isDismissed = (window.localStorage.getItem("mct_alert_dismissed") || "false") === "true";
    element.style.display = isDismissed ? "none" : "block";
    let closeButton = document.getElementById("mct_alert_close");
    if (!!closeButton) {
        closeButton.addEventListener("click", function () {
            window.localStorage.setItem("mct_alert_dismissed", "true");
        });
    }
}

function setSessionItem(key, val) {
    if (val != null) {
        window.sessionStorage.setItem(key, val);
    } else {
        window.sessionStorage.removeItem(key);
    }
}

function getSessionItem(key, defaultValue) {
    let val = window.sessionStorage.getItem(key);
    if (val == null) {
        val = defaultValue;
    }
    return val;
}
