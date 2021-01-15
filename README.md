
####  Проект мессенджер для курса "Яндекс-Практикум: мидл фронтенд разработчик"

**Хостинг проекта на [Netlify](https://distracted-swartz-d8b108.netlify.app/) и на [heroku](https://shipko-messenger.herokuapp.com/)**.
**Макеты в [figma](https://www.figma.com/file/l0jgte4N2dzWv5zMITIC4f/shipko_messenger?node-id=0%3A1)**.

**Структура проекта:** 
* `./src` - source-файлы проекта 
* `./dist` - репозиторий для собранных файлов
* `./webpack` - файлы конфигурации webpack
* `./test` - файлы тестов

**Команды:**
1. Сконфигурировать продакшн-файлы в dist: `npm run build`
2. Развернуть проект локально (webpack devServer): `npm start`
2. Развернуть проект локально (node js): `npm run server`
3. Запустить тесты: `npm run test`
4. Запустить линтинг: `npm-run-all lint:*`

**Список технологий:**
1. Тестирование: [mocha](https://mochajs.org/) и [chai](https://www.chaijs.com/). 
Фейковый сервер и функции-шпионы [sinon](https://sinonjs.org/).
Мокинг дом-дерева [jsdom](https://github.com/jsdom/jsdom).
2. Препроцессор: [less](http://lesscss.org/).
3. Сборщик: [webpack](https://webpack.js.org/).
4. Линтинг: [eslint](https://eslint.org/), [stylelint](https://stylelint.io/).
5. Прекоммит: [husky](https://github.com/typicode/husky).

**Текущая функциональность:**
1. Добавление юзера в чат
2. Удаление юзера из чата
3. Добавить чат
4. Удалить чат
5. Залогиниться\разлогиниться
6. Изменить настройки профиля
7. Изменить аватар
8. Изменить пароль
9. Зарегистрироваться
10. Подключение к чату и отображение списка сообщений с динамической догрузкой
11. Отправить/Получить сообщение

**В планах:**
1. Научить мессенджер понимать прочитано сообщение или нет
2. Отправка картинок и видео
3. Активировать строку поиска и быстрое создание чата с одним пользователем
4. Вместо блокирующих алертов показывать красивые всплывающие сообщения
5. Добавить звук при получении сообщения
