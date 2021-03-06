import { ErrorPage } from 'src/components/pages/errorPage/ErrorPage'
import Button from 'src/components/button/Button'
import Path from 'src/constants/Path'
import Router from 'src/utils/router/Router'

export const notFoundPage = new ErrorPage({
    errorNumber: '404',
    pageText: 'Страница не найдена',
    button: new Button(
        {
            text: 'Вернуться к чатам',
            class: 'error-page-btn messenger-button_no-background',
            eventData: {
                name: 'click',
                callback: () => {
                    new Router('.app').go(Path.CHATS)
                }
            }
        }
    )
})
