# Сервис личных заметок на Node.js

# [Ссылка на проект](https://notes.alexstrigo.ru/)

## Функционал
Функционально приложение состоит из двух генерируемых сервером страниц:
* Индексная страница (/) с формой регистрации/аутентификации и основная рабочая
* Страница списка заметок/работы с отдельной заметкой (/dashboard)

Страница /dashboard представляет из себя single page — клиентское приложение и
может функционировать в нескольких режимах: список, список + просмотр одной
заметки, список + редактирование/создание одной заметки.

## Процесс поведения в приложении:

1. Не прошедший аутентификацию пользователь видит индексную страницу (/) с формами
регистрации/аутентификации. Никакие другие страницы ему недоступны: посещение
несуществующей страницы приводит к ошибке 404, посещение страницы /dashboard — к
редиректу на индексную страницу.


2. Аутентифицированный пользователь, наоборот, при посещении индексной страницы
перенаправляется на страницу /dashboard; при посещении несуществующей — видит страницу
ошибки 404.

3. Аутентифицированный пользователь видит страницу со списком заметок (/dashboard).
Фильтр по умолчанию — за последнюю неделю. Доступные варианты фильтрации по времени —
за месяц, за 3 месяца, за всё время, архив.


4. Список отфильтрованных по дате заметок поддерживает постраничную загрузку:
изначально в нём видно не более 20 записей, при нажатии на кнопку с сервера загружается
следующий блок («страница») записей.

5. При нажатии на кнопку создания новой записи открывается форма добавления заметки,
где пользователь может задать заголовок заметки (строка) и её текст (в формате markdown).
После сохранения заметки форма её добавления закрывается, заметка появляется в списке, а
также открывается в режиме просмотра. В случае ошибки сохранения пользователю
показывается соответствующее сообщение.

6. При нажатии на заголовок заметки в списке она открывается в режиме просмотра. Из
этого режима по нажатию кнопки можно перейти в режим редактирования, аналогичный
режиму создания новой заметки.

7. Из списка и из режима просмотра заметку также можно заархивировать.

8. Отдельный фильтр переключает список заметок в режим архива, аналогичный фильтру
«за всё время», но отображающий только заархивированные заметки. В этом режиме заметки
можно просматривать и редактировать, а также восстанавливать (разархивировать) и удалять.
Отдельная кнопка позволяет удалить все архивные заметки

9. Аутенцификация возможна также через социальные сети, в таком случае мы сохраняем логин и названия социальной сети
для дальнейшей аутенцификации

10. Каждую заметку можно скачать в формате pdf

## Навигация по коду:

* В папке /methods находятся в функции используемые в процессе аутенцификации и обращения к базам данных, а также метод преобразования заметки в pdf формат
* В папке /socialAuth описывается процесс аутенцификации через социальные сети. 1 файл - 1 социальная сети, в частности гугл и гитхаб
* В папку /pdf  попадают все преобразованные заметки. Сначала заметка преобразовывается в пдф далее попадает в данную папку, пользователь скачивает ее и далее она удаляется
* В папке /frontend-src лежат файлы фронтеда в часности обращения к api сервера
* В папке /routers лежат файлы с роутерами для приложения, являющиеся слушателями событий по обращению к серверу
* В папку /public попадают бандлы фронтеда, css, а также ресурсы для приложения, такие как картинки, шрифты и тд
* В файле /.env-sample лежат переменные для запуска сервера. При запуске локально или на сервере нужно создать файл .env и добавить туда параметры описанные в файле .env-sample
* Также в файле env.js в переменную URI нужно вставить URI на котором хостинг по умолчанию это http://localhost:9000

## Скрипты
* Для создания билда с фронтенда команды : `$ npm run build`
* Для запуска сервера в режиме девелопера ("хот-релоадс") : `$ npm run dev`
* Для запуска сервера в боевом режиме : `$ npm run start`

# КАК ЖЕ ЗАПУСТИТЬ ВСЕ ЭТО ?

1. Проверьте env переменные в файле .env (взять их и описания для них в файле .env-sample
2. Проверьте файл env.js в папке /frontend-src, URI и порт должны совпадать с файлом .env в корне
3. Проверьте чтобы база данных работала и была запущена
4. Создайте билд фронтенда введи в корневой директории `$ npm run build`
5. Запустите сервер `$ npm run dev` (режим девелопера) или  `$ npm run start` для запуска (в режиме продакшен)

### PS если деплоинте на удаленном сервере возможно для корректного преобразования pdf нужно установить браузер:
`$ sudo apt-get install chromium-browser` **

** для ОС ubuntu


