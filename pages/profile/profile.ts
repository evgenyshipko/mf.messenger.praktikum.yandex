import Button from '../../components/Button'
import Form from '../../components/Form'
import { InputName } from '../../utils/validator/InputValidator'
import ProfilePage from './ProfilePage'
import render from '../../utils/renderDom'
import FormInputLabeled from '../../components/FormInputLabeled'
import Modal from '../../components/Modal'
import Header from '../../components/Header'
import Avatar from '../../components/Avatar'
import Path from '../../constants/Path'
import Router from '../../utils/router/Router'
import HTTPExecutor, {ErrorResponse} from '../../utils/httpExecutor/httpExecutor'
import Url, { ApiPath } from '../../constants/Url'
import Store from "../../store/Store";

const formId = 'profile-form'
const inputClass = 'profile-form-item__input'
const inputWrapperClass = 'profile-form-item'

const buttonListMain = [
    new Button({
        class: 'messenger-button',
        text: 'Изменить данные',
        type: 'submit',
        formId: formId
    }),
    new Button({
        class: 'messenger-button',
        text: 'Изменить пароль',
        eventData: {
            name: 'click',
            callback: () => {
                // вешаем на кнопку отображение формы изменения пароля
                profile.setProps({
                    form: formChangePassword,
                    buttonList: buttonListChangePassword
                })
            }
        }
    }),
    new Button({
        class: 'profile-exit-btn messenger-button_no-background',
        text: 'Выйти',
        eventData: {
            name: 'click',
            callback: () => {
                new HTTPExecutor()
                    .post(Url.generate(ApiPath.AUTH_LOGOUT), { credentials: true })
                    .then((_res) => {
                        new Router('.app').go(Path.SIGNIN)
                    })
            }
        }
    })
]

const formMain = new Form({
    id: formId,
    class: 'profile-form',
    formItemList: [
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.EMAIL,
            class: inputClass,
            label: 'Почта',
            wrapperClass: inputWrapperClass
        }),
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.LOGIN,
            class: inputClass,
            label: 'Логин',
            wrapperClass: inputWrapperClass
        }),
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.FIRST_NAME,
            class: inputClass,
            label: 'Имя',
            wrapperClass: inputWrapperClass,
            value: 'test'
        }),
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.SECOND_NAME,
            class: inputClass,
            label: 'Фамилия',
            wrapperClass: inputWrapperClass,
            value: Store.userProps?.second_name
        }),
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.DISPLAY_NAME,
            class: inputClass,
            label: 'Имя для отображения',
            wrapperClass: inputWrapperClass
        }),
        new FormInputLabeled({
            type: 'text',
            inputName: InputName.PHONE,
            class: inputClass,
            label: 'Телефон',
            wrapperClass: inputWrapperClass
        })
    ]
})

const buttonListChangePassword = [
    new Button({
        class: 'messenger-button',
        text: 'Сохранить',
        type: 'submit',
        formId: formId
    }),
    new Button({
        class: 'profile-exit-btn messenger-button_no-background',
        text: 'Отмена',
        eventData: {
            name: 'click',
            callback: () => {
                profile.setProps({
                    form: formMain,
                    buttonList: buttonListMain
                })
            }
        }
    })
]

const formChangePassword = new Form({
    id: formId,
    class: 'profile-form',
    formItemList: [
        new FormInputLabeled({
            label: 'Старый пароль',
            type: 'password',
            inputName: InputName.OLD_PASSWORD,
            class: inputClass,
            wrapperClass: inputWrapperClass
        }),
        new FormInputLabeled({
            label: 'Новый пароль',
            type: 'password',
            inputName: InputName.NEW_PASSWORD,
            class: inputClass,
            wrapperClass: inputWrapperClass
        }),
        new FormInputLabeled({
            label: 'Повторите новый пароль',
            type: 'password',
            inputName: InputName.NEW_PASSWORD_REPEAT,
            class: inputClass,
            wrapperClass: inputWrapperClass
        })
    ]
})

const modalWindow = new Modal({
    backgroundClass: 'upload-avatar-modal-shadow',
    modalClass: 'upload-avatar-modal',
    content: [
        new Header({
            text: 'Загрузите файл',
            class: 'upload-avatar-modal-header'
        }),
        new Button({
            text: 'Выбрать файл на компьютере',
            class: 'upload-avatar-modal-browse-btn messenger-button_no-background'
        }),
        new Button({
            text: 'Изменить',
            class: 'messenger-button upload-avatar-modal-change-btn',
            eventData: {
                name: 'click',
                callback: () => {
                    profile.show('flex')
                    modalWindow.hide()
                }
            }
        })
    ]
})

export const profile = new ProfilePage({
    avatar: new Avatar({
        eventData: {
            name: 'click',
            callback: () => {
                profile.hide()
                modalWindow.show('flex')
            }
        }
    }),
    backButton: new Button({
        class: 'profile-back-btn',
        iconClass: 'profile-back-btn__icon',
        eventData: {
            name: 'click',
            callback: () => {
                new Router('.app').go(Path.CHATS)
            }
        }
    }),
    userName: 'Evgeny',
    form: formMain,
    buttonList: buttonListMain
})

// скрыли модальное окно
modalWindow.hide()

// вешаем валидацию на формы
formMain.addValidator(
    (formData) => {
        new HTTPExecutor()
            .put(
                Url.generate(ApiPath.USER_PROFILE),
                {
                    data: JSON.stringify(Object.fromEntries(formData)),
                    credentials: true,
                    headers: { 'Content-Type': 'application/json' }
                })
            .then((_res) => {
                window.alert('Данные изменены успешно!')
            })
            .catch((error) => {
                const errorData = JSON.parse(error) as ErrorResponse
                window.alert(errorData.responseText)
            })
    }
)

formChangePassword.addValidator()

render(modalWindow)
