import Button from '../../components/button/Button'
import Input from '../../components/Input'
import Chat from '../../components/chats/chat/Chat'
import ChatHeader from '../../components/chats/chatHeader/ChatHeader'
import MessageList from '../../components/chats/messageList/MessageList'
import ChatsPage from '../../components/pages/chatsPage/ChatsPage'
import ChatList from '../../components/chats/chatList/ChatList'
import Block from '../../components/Block'
import Router from '../../utils/router/Router'
import Path from '../../constants/Path'
import Store from '../../utils/Store'
import { MessengerStore } from '../../types/Types'
import { attachPopup } from './attachPopup'
import { actionsPopup } from './actionsPopup'
import { addChatModal } from './addChatModal'
import { deleteChatModal } from './deleteChatModal'
import { addUserModal } from './addUserModal'
import { deleteUserModal } from './deleteUserModal'
import Message from '../../components/chats/message/Message'
import EventController from '../../utils/EventController'
import EventName from '../../constants/EventName'

/* global HTMLInputElement, KeyboardEvent */

// создаем внутренние компоненты для компоненты-страницы CreatePage
const functionsBlockComponents = [
    new Block({
        class: 'chats-buttons-block',
        content: [
            new Button({
                class: 'messenger-button_no-background chats-add-chat-btn',
                text: 'Добавить чат',
                eventData: {
                    name: 'click',
                    callback: () => {
                        addChatModal.show()
                    }
                }
            }),
            new Button({
                text: 'Профиль',
                class: 'chats-profile-btn',
                eventData: {
                    name: 'click',
                    callback: () => {
                        new Router('.app').go(Path.PROFILE)
                    }
                }
            })
        ]
    }),
    new Input({
        inputName: 'search',
        placeholder: 'Поиск',
        type: 'text',
        class: 'chats-search-input'
    })
]

const chatHeader = new ChatHeader({
    chatName: 'chat',
    actionsBtn: new Button({
        class: 'chats-head-btn',
        iconClass: 'chats-head-btn__icon',
        eventData: {
            name: 'click',
            callback: () => {
                actionsPopup.toggle()
            }
        }
    })
})

export const messageListComponent = new MessageList({
    messageItemList: []
})

const chatsFooterInputClass = 'chats-footer-input'

const sendMessage = () => {
    const inputEntrails = footerComponents.find((component) => {
        return component.props.class === chatsFooterInputClass
    })?.getContent()
    if (inputEntrails) {
        const input = inputEntrails[0] as HTMLInputElement
        const store = new Store<MessengerStore>()
        const messageDriver = store.content.chatList.find((chatData) => {
            return chatData.id === store.content.currentChatId
        })?.messageDriver
        if (messageDriver && input.value) {
            messageDriver.send(input.value)
            input.value = ''
        }
    }
}

const footerComponents = [
    new Button({
        class: 'chats-footer-attach-btn',
        eventData: {
            name: 'click',
            callback: () => {
                attachPopup.toggle()
            }
        }
    }),
    new Input({
        type: 'text',
        inputName: 'send-message',
        class: chatsFooterInputClass,
        placeholder: 'Сообщение',
        eventData: {
            name: 'keyup',
            callback: (e:KeyboardEvent) => {
                if (e.code === 'Enter') {
                    sendMessage()
                }
            }
        }
    }),
    new Button({
        class: 'chats-footer-send-btn',
        eventData: {
            name: 'click',
            callback: () => {
                sendMessage()
            }
        }
    })
]

// сама страница чатов
export const chats = new ChatsPage({
    functionsBlockComponents: functionsBlockComponents,
    footerComponents: footerComponents,
    chatList: new ChatList({
        chatItemList: []
    }),
    messageBlockComponents: [attachPopup, actionsPopup, messageListComponent],
    chatHeader: new Block({ class: '', content: '' }),
    addChatModal: addChatModal,
    deleteChatModal: deleteChatModal,
    addUserModal: addUserModal,
    deleteUserModal: deleteUserModal
})

const store = new Store<MessengerStore>()

const generateChatItemList = () => {
    return store.content.chatList.map((chatData) => {
        return new Chat({
            id: chatData.id,
            unreadCount: chatData.unreadCount,
            chatName: chatData.title,
            lastMessage: chatData.messageList?.[0],
            eventData: {
                name: 'click',
                callback: () => {
                    store.setState({ currentChatId: chatData.id })
                    // апдейтим список сообщений на экране
                    updateMessageList(chatData.id)
                    chatHeader.setProps({
                        chatName: chatData.title
                    })
                    chats.setProps({
                        chatHeader: chatHeader
                    })
                }
            }
        })
    })
}

const updateChatItemList = (_state: MessengerStore) => {
    const chatItemList = generateChatItemList()
    console.log('chatItemList', chatItemList)
    chats.props.chatList.setProps({ chatItemList: chatItemList })
}

// подписываем обновление списка чатов на изменение глобального стора
store.subscribe('chatList', updateChatItemList)

const updateMessageList = (chatId: number) => {
    const chatData = store.content.chatList.find((chatData) => {
        return chatData.id === chatId
    })
    if (chatData && chatData.messageList) {
        messageListComponent.setProps({
            messageItemList: chatData.messageList.map((messageData) => {
                return new Message({
                    id: messageData.id,
                    userId: messageData.userId,
                    chatId: chatId,
                    content: messageData.content,
                    time: messageData.time
                })
            }).reverse()
        })
        messageListComponent.moveViewToBottom()
    }
}

const eventController = new EventController()
eventController.subscribe(EventName.newMessageReceived, updateMessageList)
