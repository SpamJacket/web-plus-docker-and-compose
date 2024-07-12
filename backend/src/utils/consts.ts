export const relations = {
  allOffers: {
    item: {
      owner: true,
      offers: true,
    },
    user: {
      wishes: {
        owner: true,
        offers: true,
      },
      offers: {
        user: true,
      },
      wishlists: {
        owner: true,
        items: true,
      },
    },
  },
  currentUserWishes: {
    wishes: {
      owner: true,
      offers: true,
    },
  },
  userWishes: {
    wishes: {
      owner: true,
      offers: {
        item: {
          owner: true,
          offers: {
            item: {
              owner: true,
              offers: true,
            },
          },
        },
      },
    },
  },
  wishes: ['owner', 'offers'],
  wishlists: ['owner', 'items'],
};

export const selects = {
  userWithEmail: {
    email: true,
    username: true,
    id: true,
    avatar: true,
    about: true,
    createdAt: true,
    updatedAt: true,
  },
};

export const ERR_MSG = {
  USER: {
    FAILED_AUTH: 'Некорректная пара логин и пароль',
    NOT_FOUND: 'Таких тут нет',
    EMAIL_CONFLICT: 'Пользователь с таким email уже существует',
    USERNAME_CONFLICT: 'Пользователь с таким именем уже существует',
    SIGNUP_CONFLICT:
      'Пользователь с таким email или username уже зарегистрирован',
  },
  OFFER: {
    NOT_FOUND: 'Такого нет, попробуй другое',
    NOT_FOUND_WISH: 'Как можно поддержать ничего? Сначала определись',
    SUPPORT_MYSELF: 'Это что самолайк? Не надо так',
    TOO_MUCH: 'Деньги лишние что-ли? Оставь себе немного',
    COLLECTED: 'Уже не надо, спасибо',
  },
  WISH: {
    NOT_FOUND_FOR_UPDATE: 'Может вы хотели обновить что-то другое? Этого нет',
    UPDATE_SOMEONE_GIFT: 'Нельзя обновлять чужие подарки!',
    UPDATE_RAISED_GIFT: 'Этот подарок уже поддержали, не стоит его обновлять',
    ALREADY_DELETED: 'Этого подарка уже нет',
    DELETE_SOMEONE_GIFT: 'Нельзя удалять чужие подарки!',
    EMPTY_COPIED: 'Нельзя скопировать то, чего нет',
    ALREADY_COPIED: 'Вы уже скопировали этот подарок',
  },
  WISHLIST: {
    NOT_FOUND: 'Этого списка нет',
    UPDATE_SOMEONE_WISHLIST: 'Нельзя обновлять чужие списки!',
    DELETE_SOMEONE_WISHLIST: 'Нельзя удалять чужие списки!',
  },
};
