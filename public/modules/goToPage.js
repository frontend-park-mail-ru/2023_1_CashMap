import {renderFeedPage} from "./renderFunc.js";
import {renderSignupPage} from "./renderFunc.js";
import {renderLoginPage} from "./renderFunc.js";

let curPageConfig = null

export const config = {
    feed: {
        name: 'Лента',
        href: '/feed',
        render: renderFeedPage,
        key: 'main',
    },
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
};


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
        configSection.status = false;
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
    configSection.render();
}
