import {renderFeedPage} from "./renderFunc.js";
import {renderSignupPage} from "./renderFunc.js";
import {renderLoginPage} from "./renderFunc.js";
import Ajax from "./ajax.js";

let curPageConfig = null

export const config = {
    signIn: {
        name: 'Авторизация',
        href: '/login',
        render: renderLoginPage,
        key: 'sign-in',
    },
    signUp: {
        name: 'Регистрация',
        href: '/signup',
        render: renderSignupPage,
        key: 'sign-up',
    },
    feed: {
        name: 'Лента',
        href: '/feed',
        render: renderFeedPage,
        key: 'feed',
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

    const request = Ajax.check();
    request
        .then(response => {
            if (response.status === 200) {
                if (curPageConfig) {
                    removePage(curPageConfig);
                }

                curPageConfig = config.feed;
                curPageConfig.render();
                return
            } else {
                if (configSection === config.feed) {
                    if (curPageConfig) {
                        removePage(curPageConfig);
                    }

                    curPageConfig = config.signIn;
                    curPageConfig.render();
                } else {
                    if (curPageConfig) {
                        removePage(curPageConfig);
                    }

                    curPageConfig = configSection;
                    curPageConfig.render();
                }
            }
        })
        .catch(response =>{
            alert('catch go '+ response.message)
        })
}

export function initPage() {
    goToPage(config.feed);
}
