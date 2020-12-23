import Button from '../../components/Button'
import Form from '../../components/Form'
import { InputName } from '../../utils/validator/InputValidator'
import ProfilePage from '../../components/pages/ProfilePage'
import FormInputLabeled from '../../components/FormInputLabeled'
import Avatar from '../../components/Avatar'
import Path from '../../constants/Path'
import Router from '../../utils/router/Router'
import HTTPExecutor, { ErrorResponse } from '../../utils/httpExecutor/httpExecutor'
import Url, { ApiPath } from '../../constants/Url'
import Store from '../../utils/Store'
import { MessengerStore, UserProps } from '../../types/Types'
import { uploadAvatarModal } from './uploadAvatarModal'
import { handleErrorResponse } from '../../utils/utils'

/* global FormData, HTMLInputElement */

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
                        store.setState({ isLogged: false })
                    })
                    .catch((error) => {
                        const errorData = JSON.parse(error) as ErrorResponse
                        handleErrorResponse(errorData)
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
            value: 'yryr'
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

export const profile = new ProfilePage({
    avatar: new Avatar({
        eventData: {
            name: 'click',
            callback: () => {
                profile.hide()
                uploadAvatarModal.show('flex')
            }
        },
        imageLink: ''
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
    userName: (() => {
        const userProps = new Store<MessengerStore>().content.userProps
        if (userProps && userProps.avatar) {
            return Url.getHostUrl() + userProps.avatar
        }
        return ''
    })(),
    form: formMain,
    buttonList: buttonListMain
})

const sendFormData = (url: string) => {
    return (formData: FormData) => {
        new HTTPExecutor()
            .put(
                url,
                {
                    data: JSON.stringify(Object.fromEntries(formData)),
                    credentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': 'expires=0'
                    }
                })
            .then((_res) => {
                window.alert('Данные изменены успешно!')
            })
            .catch((error) => {
                const errorData = JSON.parse(error) as ErrorResponse
                handleErrorResponse(errorData)
            })
    }
}

// вешаем валидацию на формы
formChangePassword.addValidator(sendFormData(Url.generate(ApiPath.USER_PASSWORD)))
formMain.addValidator(sendFormData(Url.generate(ApiPath.USER_PROFILE)))

const updateFormValues = (_state: MessengerStore) => {
    const elemList = formMain.getContent()
    if (elemList && elemList.length > 0) {
        const form = elemList[0]
        const inputList = form.getElementsByTagName('input')
        for (const input of inputList) {
            const inputName = input.getAttribute('name') as keyof UserProps
            const value = store.content.userProps[inputName] as string
            if (inputName && value) {
                input.setAttribute('value', value)
            }
        }
    }
}

// подписались на изменения стейта глобального стора
const store = new Store<MessengerStore>()
store.subscribe('userProps', updateFormValues)
store.subscribe('userProps', (state) => {
    profile.setProps({ userName: state.userProps.first_name })
})
store.subscribe('userProps', (state) => {
    if (state.userProps.avatar) {
        profile.props.avatar.setProps({ imageLink: Url.getHostUrl() + state.userProps.avatar })
    }
})
