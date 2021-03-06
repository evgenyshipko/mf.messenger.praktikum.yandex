import Modal from 'src/components/modal/Modal'
import Header from 'src/components/Header'
import Button from 'src/components/button/Button'
import InputLabeled from 'src/components/InputLabeled'
import ProfileApi from 'src/pages/profile/profile.api'

/* global FormData, HTMLInputElement, Event */

const inputClass = 'upload-avatar-modal-browse-input'

const uploadAvatar = (_e: Event) => {
    const input = document.getElementsByClassName(inputClass)[0] as HTMLInputElement
    if (input.files && input.files.length > 0) {
        const formData = new FormData()
        formData.append('avatar', input.files[0])
        formData.append('type', 'image/png')
        new ProfileApi().changeUserAvatar(formData)
    } else {
        window.alert('Выберите файл!')
    }
}

export const uploadAvatarModal = new Modal({
    content: [
        new Header({
            text: 'Загрузите файл',
            class: 'upload-avatar-modal-header'
        }),
        new InputLabeled({
            inputName: 'uploadAvatar',
            inputId: 'uploadAvatar',
            labelText: 'Выбрать файл на компьютере',
            inputClass: inputClass,
            labelClass: 'upload-avatar-modal-browse-label',
            type: 'file'
        }),
        new Button({
            text: 'Изменить',
            class: 'messenger-button upload-avatar-modal-change-btn',
            eventData: {
                name: 'click',
                callback: uploadAvatar
            }
        }),
        new Button({
            class: 'messenger-button_no-background',
            text: 'Отмена',
            eventData: {
                name: 'click',
                callback: () => {
                    uploadAvatarModal.hide()
                }
            }
        })
    ]
})
uploadAvatarModal.hide()
