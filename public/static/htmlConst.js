export const sideBarConst = {
    logoImgPath: 'static/img/logo.svg',
    logoText: 'Depeche',
    menuItemList: [
        {text: 'Моя страница', jsId: 'js-side-bar-my-page', iconPath: 'static/img/nav_icons/profile.svg', hoveredIconPath: 'static/img/nav_icons/profile_hover.svg', notifies: 1},
        {text: 'Новости', jsId: 'js-side-bar-news', iconPath: 'static/img/nav_icons/news.svg', hoveredIconPath: 'static/img/nav_icons/news_hover.svg', notifies: 0},
        {text: 'Мессенджер', jsId: 'js-side-bar-msg', iconPath: 'static/img/nav_icons/messenger.svg', hoveredIconPath: 'static/img/nav_icons/messenger_hover.svg', notifies: 7},
        {text: 'Фотографии', jsId: 'js-side-bar-photo', iconPath: 'static/img/nav_icons/photos.svg', hoveredIconPath: 'static/img/nav_icons/photos_hover.svg', notifies: 0},
        {text: 'Друзья', jsId: 'js-side-bar-friends', iconPath: 'static/img/nav_icons/friends.svg', hoveredIconPath: 'static/img/nav_icons/friends_hover.svg', notifies: 0},
        {text: 'Сообщества', jsId: 'js-side-bar-groups', iconPath: 'static/img/nav_icons/groups.svg', hoveredIconPath: 'static/img/nav_icons/groups_hover.svg', notifies: 0},
        {text: 'Закладки', jsId: 'js-side-bar-bookmarks', iconPath: 'static/img/nav_icons/bookmarks.svg', hoveredIconPath: 'static/img/nav_icons/bookmarks_hover.svg', notifies: 11}]
};

export const headerConst = {
    avatarDefault: 'static/img/post_icons/profile_image.svg',
    exitButton: { text: 'Выход', jsId: 'js-exit-btn', iconPath: 'static/img/exit.svg', hoveredIconPath: 'static/img/exit_hover.svg'},
    settingsButton: { text: 'Настройки', jsId: 'js-settings-btn', iconPath: 'static/img/settings.svg', hoveredIconPath: 'static/img/settings_hover.svg'},
};

export const logoDataSignIn = {
    logoImgPath: 'static/img/logo.svg',
    backgroundImgPath: 'static/img/background_right.svg',
    logoText: 'Depeche',
    logoTagline: 'Сервис для общения',
};
export const logoDataSignUp = {
    logoImgPath: 'static/img/logo.svg',
    backgroundImgPath: 'static/img/background_left.svg',
    logoText: 'Depeche',
    logoTagline: 'Сервис для общения',
};

export const signInData = {
    title: 'Авторизация',
    inputFields: [
        { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
        { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'}],
    buttonInfo: { text: 'Войти', jsId: 'js-sign-in-btn'},
    errorInfo: { jsId: 'js-sign-in-error' },
    link: { text:'У вас еще нет аккаунта? Зарегистрироваться', jsId: 'js-create-account-btn'},
    linkInfo: 'После успешной регистрации вы получите доступ ко всем функциям Depeche',
};

export const signUpData = {
    title: 'Регистрация',
    inputFields: [
        { help: 'Имя', type: 'text', jsIdInput: 'js-first-name-input', jsIdError: 'js-first-name-error'},
        { help: 'Фамилия', type: 'text', jsIdInput: 'js-last-name-input', jsIdError: 'js-last-name-error'},
        { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
        { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'},
        { help: 'Повторите пароль', type: 'password', jsIdInput: 'js-repeat-password-input', jsIdError: 'js-repeat-password-error'}],
    buttonInfo: { text: 'Зарегистрироваться', jsId: 'js-sign-up-btn'},
    link: { text:'У вас уже есть аккаунт? Войти', jsId: 'js-have-account-btn'},
};
