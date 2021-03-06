import Button from 'src/components/button/Button'
import { InputName } from 'src/utils/validator/InputValidator'
import FormInput from 'src/components/formInput/FormInput'
import Form from 'src/components/Form'
import SignupPage from 'src/components/pages/signupPage/SignupPage'
import Router from 'src/utils/router/Router'
import Path from 'src/constants/Path'
import SignupApi from 'src/pages/signup/signup.api'
import CommonApi from 'src/api/common.api'
import { ErrorResponse } from 'src/utils/httpExecutor/httpExecutor'

/* global HTMLFormElement, HTMLInputElement */

const postInput = new FormInput({
    type: 'text',
    inputName: InputName.EMAIL,
    class: 'signup-form__email-input form-input',
    placeholder: 'Почта'
})

const loginInput = new FormInput({
    type: 'text',
    inputName: InputName.LOGIN,
    class: 'signup-form__login-input form-input',
    placeholder: 'Логин'
})

const firstNameInput = new FormInput({
    type: 'text',
    inputName: InputName.FIRST_NAME,
    class: 'signup-form__firstname-input form-input',
    placeholder: 'Имя'
})

const lastNameInput = new FormInput({
    type: 'text',
    inputName: InputName.SECOND_NAME,
    class: 'signup-form__lastname-input form-input',
    placeholder: 'Фамилия'
})

const phoneInput = new FormInput({
    type: 'text',
    inputName: InputName.PHONE,
    class: 'signup-form__phone-input form-input',
    placeholder: 'Телефон'
})

const passwordInput = new FormInput({
    type: 'password',
    inputName: InputName.PASSWORD,
    class: 'signup-form__password-input form-input',
    placeholder: 'Пароль'
})

const secondPasswordInput = new FormInput({
    type: 'password',
    inputName: InputName.SECOND_PASSWORD,
    class: 'signup-form__password-input form-input',
    placeholder: 'Повторите пароль'
})

const registrationBtn = new Button({
    class: 'signup-form__submit-btn messenger-button',
    text: 'Зарегистрироваться'
})

const form = new Form({
    class: 'signup-form',
    formItemList: [
        postInput,
        loginInput,
        firstNameInput,
        lastNameInput,
        phoneInput,
        passwordInput,
        secondPasswordInput,
        registrationBtn
    ]
})

form.addValidator((formData) => {
    const data: Record<string, unknown> = Object.fromEntries(formData)
    delete data[InputName.SECOND_PASSWORD]
    new SignupApi(data)
        .signup()
        .then((_res) => {
            return new CommonApi().updateInitialData()
        })
        .then(() => {
            new Router('.app').go(Path.CHATS)
        })
        .catch((e: ErrorResponse) => {
            window.alert(e.responseText)
        })
})

export const signup = new SignupPage({
    form: form,
    entranceBtn: new Button({
        text: 'Войти',
        class: 'signup-registration-btn messenger-button_no-background',
        eventData: {
            name: 'click',
            callback: () => {
                new Router('.app').go(Path.SIGNIN)
            }
        }
    })
})
