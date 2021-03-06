import ChatsApi from 'src/pages/chats/chats.api'
import { isArray, isObject } from 'src/utils/utils'
import { MessageData, MessageDataExcluded, MessengerStore } from 'src/types/Types'
import Store from 'src/utils/Store'
import EventController from 'src/utils/EventController'
import EventName from 'src/constants/EventName'
import Url from 'src/constants/Url'

/* global WebSocket */

class MessageDriver {
    socket!: WebSocket
    chatId!: number
    chatTitle!: string
    userId!: number

    static async build(userId: number, chatId: number, chatTitle?: string) {
        const messageDriver = new MessageDriver()
        messageDriver.chatId = chatId
        messageDriver.userId = userId
        if (chatTitle) {
            messageDriver.chatTitle = chatTitle
        }
        return new ChatsApi()
            .token(chatId)
            .then((token) => {
                messageDriver.socket = new WebSocket(Url.getSocketApiUrl(userId, chatId, token))
                messageDriver._initListeners()
                // пингуем сокеты, чтобы они не отваливались во время сессии
                messageDriver._initPingService()
                return messageDriver
            })
    }

    send(message: string) {
        this.socket.send(JSON.stringify({
            content: message,
            type: 'message'
        }))
    }

    getMessages(count: number = 0) {
        this.socket.send(JSON.stringify({
            content: `${count}`,
            type: 'get old'
        }))
    }

    private _initListeners() {
        const prefix = `${this.chatTitle}(${this.chatId}): `
        this.socket.addEventListener('open', () => {
            console.log(prefix + 'Соединение установлено')
            // при открытии соединения запрашиваем последние сообщения
            this.getMessages()
        })
        this.socket.addEventListener('close', event => {
            event.wasClean ? console.log(prefix + 'Соединение закрыто чисто') : console.log(prefix + 'Обрыв соединения')
            console.log(`Код: ${event.code} | Причина: ${event.reason}`)
        })
        this.socket.addEventListener('message', event => {
            const data = JSON.parse(event.data)
            if (data.type !== 'error') {
                console.log(prefix + 'Получены данные', data)
                // если приходит сообщение или массив сообщений, то записываем их в стор
                if (isArray(data) && data.length > 0 && this._isMessageData(data[0])) {
                    this._updateMessageDataList(data as MessageData[])
                } else if (this._isMessageDataExcluded(data)) {
                    this._addMessageData(data)
                }
            }
        })
        this.socket.addEventListener('error', event => {
            console.log(prefix + 'Ошибка', event)
        })
    }

    private _updateMessageDataList(data: MessageData[]) {
        const store = new Store<MessengerStore>()
        const chatData = store.content.chatList?.find((chatData) => {
            return chatData.id === this.chatId
        })
        if (chatData && data) {
            const messageData = data.map((chatData) => {
                return {
                    id: chatData.id,
                    userId: chatData.user_id,
                    time: chatData.time,
                    content: chatData.content
                } as MessageDataExcluded
            })
            chatData.messageList.push(...messageData)
            const eventController = new EventController()
            if (store.content.currentChatId === this.chatId) {
                eventController.emit(EventName.refreshMessages, this.chatId)
            }
            eventController.emit(EventName.messagesLoaded, this.chatId)
        }
    }

    private _addMessageData(data: MessageDataExcluded) {
        const store = new Store<MessengerStore>()
        const chatData = store.content.chatList.find((chatData) => {
            return chatData.id === this.chatId
        })
        if (chatData && data && chatData.messageList) {
            chatData.messageList?.unshift(data)
        }
        // если сообщение получено и открыт нужный чат - обновить контент окна чата
        const eventController = new EventController()
        if (store.content.currentChatId === this.chatId) {
            eventController.emit(EventName.refreshMessages, this.chatId)
        }
        eventController.emit(EventName.newMessageAdded, this.chatId, data.userId)
    }

    private _isMessageData(obj: unknown): obj is MessageData {
        if (isObject(obj)) {
            return 'id' in obj && 'user_id' in obj && 'chat_id' in obj && 'time' in obj && 'content' in obj
        }
        return false
    }

    private _isMessageDataExcluded(obj: unknown): obj is MessageDataExcluded {
        if (isObject(obj)) {
            return 'id' in obj && 'userId' in obj && 'time' in obj && 'content' in obj && 'type' in obj
        }
        return false
    }

    private _initPingService() {
        setInterval(() => {
            this._ping()
        }, 10000)
    }

    private _ping() {
        this.socket.send('ping')
    }
}
export default MessageDriver
