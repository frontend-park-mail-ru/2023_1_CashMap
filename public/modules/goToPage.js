import {renderFeedPage} from "./renderFunc.js";
import {renderSignupPage} from "./renderFunc.js";
import {renderLoginPage} from "./renderFunc.js";
import Ajax from "./ajax.js";

let curPageConfig = null

export const config = {
    login: {
        name: 'Авторизация',
        href: '/login',
        render: renderLoginPage,
        key: 'main-auth',
    },
    signup: {
        name: 'Регистрация',
        href: '/signup',
        render: renderSignupPage,
        key: 'main-reg',
    },
    feed: {
        name: 'Лента',
        href: '/feed',
        render: renderFeedPage,
        key: 'main',
    },
};


export function initPage() {
    if (window.location.pathname === config.login.href) {
        goToPage(config.login);
    } else if (window.location.pathname === config.feed.href) {
        goToPage(config.feed);
    } else if (window.location.pathname === config.signup.href) {
        goToPage(config.signup);
    } else {
        window.location.pathname = config.login.href;
        goToPage(config.login);
    }
}

/**
 * page cleaning function
 * @param {object} configSection - information about the page being deleted
 *
 * @returns {}
 */
function removePage(configSection) {
    const curPage = document.getElementById(configSection.key);
    if (curPage) {
        curPage.remove();
    }
}

/**
 * page jump function
 * @param {object} configSection - information about the required page
 *
 * @returns {}
 */
export default function goToPage(configSection) {
    if (configSection === curPageConfig) {
        return;
    }

    if (curPageConfig) {
        removePage(curPageConfig);
    }

    curPageConfig = configSection;
    curPageConfig.render();
}
