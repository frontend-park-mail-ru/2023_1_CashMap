export const activeColor = '#B95DD9';

export const maxTextStrings = 3;
export const maxTextLength = 150;

export const maxBirthday = '2017-01-01';

export const groupAvatarDefault = 'static/img/post_icons/group_image.svg';

export const optionsAvatar = ['.png', '.jpeg', '.jpg', '.gif', '.webp'];

export const sideBarConst = {
    logoImgPath: 'static/img/logo.svg',
    logoText: 'Depeche',
    menuItemList: [
        {text: 'Моя страница', jsId: 'js-side-bar-my-page', iconPath: 'static/img/nav_icons/profile.svg', hoveredIconPath: 'static/img/nav_icons/profile_hover.svg', notifies: 1},
        {text: 'Новости', jsId: 'js-side-bar-news', iconPath: 'static/img/nav_icons/news.svg', hoveredIconPath: 'static/img/nav_icons/news_hover.svg', notifies: 0},
        {text: 'Мессенджер', jsId: 'js-side-bar-msg', iconPath: 'static/img/nav_icons/messenger.svg', hoveredIconPath: 'static/img/nav_icons/messenger_hover.svg', notifies: 7},
        // {text: 'Фотографии', jsId: 'js-side-bar-photo', iconPath: 'static/img/nav_icons/photos.svg', hoveredIconPath: 'static/img/nav_icons/photos_hover.svg', notifies: 0},
        {text: 'Друзья', jsId: 'js-side-bar-friends', iconPath: 'static/img/nav_icons/friends.svg', hoveredIconPath: 'static/img/nav_icons/friends_hover.svg', notifies: 0},
        {text: 'Сообщества', jsId: 'js-side-bar-groups', iconPath: 'static/img/nav_icons/groups.svg', hoveredIconPath: 'static/img/nav_icons/groups_hover.svg', notifies: 0},
        // {text: 'Закладки', jsId: 'js-side-bar-bookmarks', iconPath: 'static/img/nav_icons/bookmarks.svg', hoveredIconPath: 'static/img/nav_icons/bookmarks_hover.svg', notifies: 11}
    ]
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
    logoTagline: 'Твоя социальная сеть',
};
export const logoDataSignUp = {
    logoImgPath: 'static/img/logo.svg',
    backgroundImgPath: 'static/img/background_left.svg',
    logoText: 'Depeche',
    logoTagline: 'Твоя социальная сеть',
};

export const signInData = {
    title: 'Авторизация',
    inputFields: [
        { text: '', help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
        { text: '', help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'}],
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
    errorInfo: { jsId: 'js-sign-up-error' },
    link: { text:'У вас уже есть аккаунт? Войти', jsId: 'js-have-account-btn'},
};

export const settingsConst = {
  avatar_url: "static/img/post_icons/profile_image.svg",
  inputFields:
      [
      { help: 'Имя',
        data: '',
        type: 'text',
        jsIdInput: 'js-first-name-input',
        jsIdError: 'js-first-name-error'},
      { help: 'Фамилия',
        data: '',
        type: 'text',
        jsIdInput: 'js-last-name-input',
        jsIdError: 'js-last-name-error'},
      { help: 'О себе',
        data: '',
        type: 'text',
        jsIdInput: 'js-bio-input',
        jsIdError: 'js-bio-error'},
      { help: 'Дата рождения',
        data: '',
        type: 'date',
        jsIdInput: 'js-birthday-input',
        jsIdError: 'js-birthday-error'},
      { help: 'Статус',
        data: '',
        type: 'text',
        jsIdInput: 'js-status-input',
        jsIdError: 'js-status-error'}
      ],
  buttonInfo: { text: 'Сохранить',
      jsId: 'js-settings-save-btn'},
  errorInfo: { jsId: 'js-sign-in-error'},
  menuInfo: [
      {text: 'Основные', jsId: 'js-menu-main'},
      //{text: 'Безопасность', jsId: 'js-menu-safety'}
  ]
}

export const safetyConst = {
  header: 'Смена пароля',
  inputFields:
      [
      { help: 'Введите старый пароль',
        type: 'text',
        jsIdInput: 'js-password-input',
        jsIdError: 'js-password-error'},
      { help: 'Введите новый пароль',
        type: 'text',
        jsIdInput: 'js-new-password-input',
        jsIdError: 'js-new-password-error'},
      { help: 'Повторите пароль',
        type: 'email',
        jsIdInput: 'js-repeat-password-input',
        jsIdError: 'js-repeat-password-error'},
      ],
  buttonInfo: { text: 'Изменить пароль',
      jsId: 'js-change-password-btn'},
  menuInfo: [
      {text: 'Основные', jsId: 'js-menu-main'},
      {text: 'Безопасность', jsId: 'js-menu-safety'}]
}

export const friendsMenuInfo = [
  {text: 'Друзья', jsId: 'js-menu-friends'},
  {text: 'Подписчики', jsId: 'js-menu-subscribers'},
  {text: 'Подписки', jsId: 'js-menu-subscriptions'},
  {text: 'Поиск друзей', jsId: 'js-menu-find-friends'}]

export const searchDropdownConst = {
    emptyQueryTitle: 'Ваш запрос не дал результатов',
    showMoreTitle: 'Показать все результаты',
    peopleSectionTitle: 'Люди',
    communitySectionTitle: 'Сообщества',
    sendMessageIconPath: 'static/img/messenger.svg',
    sendMessageHoveredIconPath: 'static/img/messenger_hover.svg',
    showMoreIconPath: 'static/img/show_all.svg',
    showMoreIconPathHover: 'static/img/show_all_hover.svg',
}

export const groupsConst = {
  menuInfo: [
    {text: 'Мои сообщества', jsId: 'js-menu-groups'},
    {text: 'Управление', jsId: 'js-menu-manage-groups'},
    {text: 'Поиск сообществ', jsId: 'js-menu-find-groups'},
    //{text: 'Популярные сообщества', jsId: 'js-menu-popular-groups'}
  ],
  buttonInfo: { text: 'Создать сообщество',
      jsId: 'js-create-group-btn'}
  }

export const NewGroupConst = {
  inputInfo:
      { help: 'Название',
        type: 'text',
        jsIdInput: 'js-title-input',
        jsIdError: 'js-title-error'},
        buttonInfo: {text: 'Создать сообщество',
                    jsId: 'js-add-group-btn'},
}

export const deleteGroupConst = {
  buttonInfo: { text: 'Да',
    jsId: 'js-group-delete-btn'}
}

export const settingsGroupConst = {
  avatar_url: "static/img/post_icons/group_image.svg",
  inputInfo: 
  { help: 'Название',
    data: '',
    type: 'text',
    jsIdInput: 'js-title-input',
    jsIdError: 'js-title-error'},
  info: '',
  type: '',
  showAuthor: '',
  buttonInfo: { text: 'Сохранить',
      jsId: 'js-settings-save-btn'},
  menuInfo: [
      {text: 'Настройки', jsId: 'js-menu-main'},
      //{text: 'Подписчики', jsId: 'js-menu-subscribers'},
      //{text: 'Заявки', jsId: 'js-menu-requests'}
  ],
  errorInfo: { jsId: 'js-sign-in-error'},
  buttonDelete: { text: 'Удалить группу',
      jsId: 'js-delete-group-btn'},
  buttonGoToGroup: { text: 'Вернуться в сообщество',
      jsId: 'js-go-to-group-btn'},
  deleteGroupData : { text: 'Да',
      jsId: 'js-group-delete-btn'},
}

export const emotionKeyboard = {
  smiles: [
    {text: '😀'},
    {text: '😃'},
    {text: '😄'},
    {text: '😁'},
    {text: '😅'},
    {text: '😆'},
    {text: '😂'},
    {text: '🤣'},
    {text: '😉'},
    {text: '😊'},
    {text: '🙂'},
    {text: '🙃'},
    {text: '😇'},
    {text: '😗'},
    {text: '😙'},
    {text: '😚'},
    {text: '😘'},
    {text: '😍'},
    {text: '🥰'},
    {text: '🤩'},
    {text: '🤗'},
    {text: '😋'},
    {text: '😜'},
    {text: '🤪'},
    {text: '😛'},
    {text: '😝'},
    {text: '🤑'},
    {text: '🤭'},
    {text: '🤐'},
    {text: '🤫'},
    {text: '😶'},
    {text: '🤔'},
    {text: '🤨'},
    {text: '🧐'},
    {text: '😐'},
    {text: '😑'},
    {text: '🙄'},
    {text: '😬'},
    {text: '🤥'},
    {text: '😏'},
    {text: '😌'},
    {text: '🤤'},
    {text: '😴'},
    {text: '🤓'},
    {text: '😎'},
    {text: '🥳'},
    {text: '🤠'},
    {text: '😒'},
    {text: '😔'},
    {text: '😪'},
    {text: '😕'},
    {text: '😟'},
    {text: '🙁'},
    {text: '😮'},
    {text: '😯'},
    {text: '😲'},
    {text: '😳'},
    {text: '🥺'},
    {text: '😦'},
    {text: '😧'},
    {text: '😨'},
    {text: '😰'},
    {text: '😥'},
    {text: '😢'},
    {text: '😭'},
    {text: '😱'},
    {text: '😖'},
    {text: '😣'},
    {text: '😞'},
    {text: '😓'},
    {text: '😩'},
    {text: '😫'},
    {text: '😷'},
    {text: '🤒'},
    {text: '🤕'},
    {text: '🤢'},
    {text: '🤮'},
    {text: '🤧'},
    {text: '🥶'},
    {text: '🥵'},
    {text: '🥴'},
    {text: '😵'},
    {text: '🤯'},
    {text: '😤'},
    {text: '😠'},
    {text: '😡'},
    {text: '🤬'},
    {text: '😈'},
    {text: '👿'},
    {text: '💀'},
    {text: '☠'},
    {text: '💩'},
    {text: '🤡'},
    {text: '👹'},
    {text: '👺'},
    {text: '👻'},
    {text: '👽'},
    {text: '👾'},
    {text: '🤖'},
    {text: '😺'},
    {text: '😸'},
    {text: '😹'},
    {text: '😻'},
    {text: '😼'},
    {text: '😽'},
    {text: '🙀'},
    {text: '😿'},
    {text: '😾'},
    {text: '🙈'},
    {text: '🙉'},
    {text: '🙊'},
    {text: '🦠'},
    {text: '❤️'},
  ]
}
