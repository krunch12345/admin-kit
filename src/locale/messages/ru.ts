import type { AdminKitMessages } from '../types'

export const ruMessages: AdminKitMessages = {
  common: {
    yes: 'Да',
    no: 'Нет',
    cancel: 'Отменить',
    cancelShort: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    apply: 'Применить',
    back: 'Назад',
    add: 'Добавить',
    copy: 'Скопировать',
    clear: 'Очистить',
    close: 'Закрыть',
    open: 'Открыть',
    all: 'Все',
    or: 'ИЛИ',
    settings: 'Настройки',
    signOut: 'Выход',
    menu: 'меню',
    home: 'На главную',
    selectAll: 'Выбрать все',
    changeSelection: 'Изменить выбор',
    noCompression: 'Без сжатия',
    compressionMode: 'Режим сжатия',
    description: 'Описание',
    source: 'Источник',
    creating: 'Создание',
    editing: 'Редактирование',
  },

  auth: {
    sessionExpired: 'Сессия истекла. Пожалуйста, войдите снова.',
    authorizationRequired: 'Требуется авторизация',
  },

  account: {
    pageTitle: 'Аккаунт',
    nicknameLabel: 'Никнейм',
    twoFaLabel: 'Двухфакторная аутентификация',
    twoFaGenerateQr: 'Сгенерировать QR-код',
    twoFaSetupHint: 'Отсканируйте QR-код в приложении-аутентификаторе, затем введите код подтверждения. 2FA станет активной только после успешной проверки.',
    twoFaQrAlt: 'QR-код для 2FA',
    twoFaQrGenerated: 'QR-код сгенерирован. Подтвердите код из приложения, чтобы активировать 2FA.',
    twoFaCodeLabel: 'Код подтверждения',
    twoFaCodePlaceholder: 'Введите код из приложения',
    twoFaConfirmActivate: 'Подтвердить и активировать',
    twoFaEnabled: 'Двухфакторная аутентификация успешно активирована.',
    twoFaDisableTitle: 'Отключить двухфакторную аутентификацию',
    twoFaDisablePrompt: 'Для отключения двухфакторной аутентификации введите текущий пароль:',
    twoFaDisableAction: 'Отключить',
    twoFaDisabled: 'Двухфакторная аутентификация успешно отключена.',
  },

  login: {
    pageTitle: 'Авторизация',
    authCodeRequired: 'Требуется код аутентификации',
    loginSuccess: 'Успешная авторизация',
    emailLabel: 'Почта',
    emailPlaceholder: 'Введите почту',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    rememberMe: 'Запомнить меня',
    errorLoginFallback: 'Ошибка при попытке авторизации',
    attemptsRemaining: 'Осталось попыток: ${remainingAttempts}',
    userBlocked: 'Пользователь заблокирован',
    retryAfter: 'Повторите через ${retryAfter} с',
    submit: 'Войти',
    totpPrompt: 'Введите код из приложения',
    errorVerify2FAFallback: 'Неверный код аутентификации',
  },

  notFound: {
    title: 'что-то пошло не так...',
    titleSubmit: 'На главную',
  },

  shell: {
    openMenu: 'Открыть меню',
    cacheCleared: 'Кэш успешно очищен',
    cacheResetError: 'Ошибка при сбросе кэша',
    clearCache: 'Очистить кэш',
    closeMenu: 'Закрыть меню',
  },

  main: {
    searchLabel: 'Поиск по сайту',
  },

  autocomplete: {
    loadingText: 'Идет загрузка...',
    enterName: 'Введите название',
    nothingFound: 'Ничего не найдено',
    clearText: 'Очистить',
    closeText: 'Закрыть',
    openText: 'Открыть',
  },

  colorLegend: {
    lessThan1Day: 'время обновления меньше 1 суток',
    lessThan3Days: 'время обновления меньше 3 суток',
  },

  copyButton: {
    title: 'Скопировать',
    success: 'Скопировано в буфер обмена',
    error: 'Не удалось скопировать',
    copied: 'Скопировано!',
  },

  copyImageButton: {
    title: 'Скопировать в буфер',
    success: 'Изображение скопировано в буфер обмена',
    error: 'Не удалось скопировать изображение',
    copied: 'Скопировано!',
  },

  crop: {
    label: 'Обрезка',
    aspectRatio: 'Соотношение сторон',
    free: 'Свободное',
    applyCrop: 'Обрезать',
    confirmDeleteImage: 'Вы точно хотите удалить это изображение?',
  },

  dateRangePicker: {
    startLabel: 'Начало периода',
    endLabel: 'Конец периода',
  },

  datePickers: {
    okButtonLabel: 'Ok',
    cancelButtonLabel: 'Отменить',
    todayButtonLabel: 'Сегодня',
    clearButtonLabel: 'Очистить',
    nextMonth: 'Следующий месяц',
    previousMonth: 'Предыдущий месяц',
    selectView: {
      meridiem: 'Выберите время суток',
      hours: 'Выберите час',
      minutes: 'Выберите минуты',
      seconds: 'Выберите секунды',
      default: 'Выберите время',
    },
    datePickerToolbarTitle: 'Выберите время',
    timePickerToolbarTitle: 'Выберите время',
    dateTimePickerToolbarTitle: 'Выберите время',
  },

  dialogRemove: {
    label: 'Удалить',
    confirmMessage: 'Вы уверены, что хотите удалить ${nameObject} ${name}?',
    confirmDeleteImages: 'Вы уверены, что хотите удалить изображения: ${count} шт.?',
    title: 'Удалить ${nameObject} ${name}',
  },

  editControls: {
    actionCancel: 'Отменить',
    actionDelete: 'Удалить',
    actionSave: 'Сохранить',
    confirmTitle: 'Вы уверены, что хотите ${action}?',
    warningRequiredFields: '⚠ ВНИМАНИЕ! Чтобы "Сохранить" заполните все обязательные поля формы!',
    warningNotEdited: '⚠ ВНИМАНИЕ! Чтобы "Сохранить" при редактировании хотя бы одно поле должно быть изменено!',
    syncPointDeletes: 'Синхронизировать удаление точек с Общей картой',
  },

  unsavedChanges: {
    changedFields: 'Изменённые поля:',
    syncPointDeletesLine: 'Синхронизация удаления точек с Общей карты: ${syncPointDeletesLabel}',
  },

  formDraft: {
    restoreTitle: 'Восстановить несохранённые изменения?',
    restoreMessage: 'Найден локальный черновик. Восстановить его?',
  },

  filterBar: {
    refreshData: 'Обновить данные',
    collapseFilters: 'Свернуть фильтры',
    showAllFilters: 'Отобразить все фильтры',
    clearFilters: 'Удалить фильтры',
  },

  modal: {
    titleSubmit: 'Применить',
    closeConfirmMessage: 'Вы уверены, что хотите отменить?',
    closeButtonTitle: 'Отменить и закрыть',
    cancelButton: 'Отменить',
  },

  noDataBox: {
    missingInDb: '${noDataObject}${idPart} отсутствует в базе данных.',
    idPart: ' с ID ${id}',
    goHome: 'На главную',
  },

  otp: {
    digitAriaLabel: 'Цифра ${index}',
  },

  plus1: {
    title: 'Добавить',
  },

  removeButton: {
    title: 'Удалить ${displayName}',
    confirmMessage: 'Вы уверены, что хотите удалить ${displayName}?',
  },

  resultNameSearch: {
    summaryTitle: 'Результат поиска по имени/названию',
    noMatches: 'Совпадений не найдено',
  },

  select: {
    all: 'Все',
  },

  slugField: {
    label: 'Slug',
    placeholder: 'url-slug',
    regenerateTitle: 'Сгенерировать slug из названия',
  },

  accordion: {
    total: 'всего: ${count}',
  },

  list: {
    total: 'Всего: ${count}',
  },

  imageMeta: {
    name: 'Название',
    namePlaceholder: 'Введите название',
    nameEN: 'Name EN',
    nameENPlaceholder: 'Enter name',
    description: 'Описание',
    descriptionPlaceholder: 'Введите описание',
    descriptionEN: 'Description EN',
    descriptionENPlaceholder: 'Enter description',
    source: 'Источник',
    sourcePlaceholder: 'Введите источник',
    sourceEN: 'Source EN',
    sourceENPlaceholder: 'Enter source',
    comment: 'Дополнительный комментарий',
    commentPlaceholder: 'Введите комментарий',
    commentEN: 'Comment EN',
    commentENPlaceholder: 'Enter comment',
    emptyFilledFields: 'Нет заполненных полей',
  },

  upload: {
    compressionGentle: 'Мягкое',
    compressionAggressive: 'Жёсткое',
    pendingLimitReached: 'Достигнут лимит в ${pendingLimit} изображений. Удалите часть или загрузите текущие.',
    partialAddDueToLimit: 'Добавлено ${acceptedCount} из ${totalSelected}. Лимит — ${pendingLimit} изображений. Остальные не добавлены.',
    chunkUploadProgress: 'Загрузка чанка ${chunkIndex}/${chunkTotal}…',
    singleUploadSuccess: 'Изображение успешно загружено',
    multiUploadSuccess: 'Загружено изображений: ${totalCount}',
    partialUploadSuccess: 'Загружено ${successCount} из ${totalCount}. Повторите загрузку для оставшихся.',
    generalSettings: 'Общие настройки',
    cancelConfirm: 'Вы действительно хотите отменить?',
    fileName: 'Имя файла',
    fileNamePlaceholder: 'Введите имя файла',
    noImagesYet: 'Пока ни одно изображение не загружено',
    pendingCount: 'Изображений: ${current} / ${limit}',
    modalCloseConfirm: 'Вы уверены, что хотите отменить загрузку изображений?',
    modalTitleSubmit: 'Прикрепить',
    attachTitle: '${title}: прикрепить',
    attachTitleFolderRequired: '${title}: прикрепить. Название папки обязательно.',
    copyAnyField: 'Скопировать любое поле любого изображения выбранным изображениям',
    applySetting: 'Применить выбранную настройку для выбранных изображений',
    pickSource: 'Выберете изображение с которого будем копировать.',
    noFilledImages: 'Нет изображений с заполненными выбранными полями',
    pickTargets: 'Выберете изображения куда будем копировать.',
    pickImagesForSetting: 'Выберете изображения для применения настройки.',
    selectFile: 'Выбрать файл',
    selectFiles: 'Выбрать файлы',
    dropHere: 'Вы можете перенести ${fileNoun} сюда',
    fileNounSingular: 'файл',
    fileNounPlural: 'файлы',
    pasteHint: 'Кликнуть на поле рядом и вставить файл из буфера',
    chooseViaButton: 'Выбрать ${fileNoun}, нажав на кнопку',
    clipboardPlaceholder: 'Вставить файл из буфера',
    preview: 'Предпросмотр:',
    confirmDeleteImage: 'Вы точно хотите удалить это изображение?',
    unsupportedImageType: 'Допускаются только растровые изображения (SVG и подобные типы блокируются).',
    skippedUnsafeImages: 'Пропущено неподдерживаемых файлов: ${count}. SVG и подобные типы блокируются.',
  },

  fileSize: {
    bytes: '${value} Б',
    kilobytes: '${value} КБ',
    megabytes: '${value} МБ',
  },

  errors: {
    proxy413: 'Обратный прокси отклонил тело запроса (HTTP 413). Увеличьте nginx client_max_body_size (например, 256m).',
    uploadFallback: 'Ошибка загрузки изображений',
  },

  console: {
    invalidData: 'Ошибка: Входной объект \'data\' некорректен.',
    invalidRequiredFields: 'Ошибка: Массив \'requiredFields\' некорректен.',
    fieldMissing: 'Ошибка: Поле \'${field}\' отсутствует в объекте данных.',
    fieldEmptyOrInvalid: 'Ошибка: Поле \'${field}\' имеет пустое или некорректное значение.',
  },
}
