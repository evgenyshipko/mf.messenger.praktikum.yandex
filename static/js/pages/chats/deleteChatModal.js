import Modal from '../../components/Modal.js';
import Header from '../../components/Header.js';
import Button from '../../components/Button.js';
export const deleteChatModal = new Modal({
    modalClass: 'add-user-modal',
    backgroundClass: 'add-user-modal-shadow',
    content: [
        new Header({
            text: 'Вы действительно хотите удалить чат?',
            class: 'add-user-modal-header'
        }),
        new Button({
            class: 'messenger-button delete-chat-modal-delete-btn',
            text: 'Удалить'
        }),
        new Button({
            class: 'messenger-button_no-background delete-chat-modal-reject-btn',
            text: 'Отмена',
            eventData: {
                name: 'click',
                callback: () => {
                    deleteChatModal.hide();
                }
            }
        })
    ]
});
deleteChatModal.hide();
//# sourceMappingURL=deleteChatModal.js.map