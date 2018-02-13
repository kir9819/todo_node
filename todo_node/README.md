# auth_mongo
## Создание серверного приложения с авторизацией и связкой с бд
### Установление зависимостей
Для работы приложения необходимо подключить сторонние модули:
```bash
$ npm install
```
Не забудь подключиться к монго. База данных называется 'asbenta', порт 27017. Коллекции 'users' и 'todos'

Тестить можно с помощью Postman



### Работа приложения с пользователями
#### Регистрация
Приложение создаст нового пользователя, если получит POST-запрос по адресу `http://localhost:3000/createuser` со следующим содержимым:
```json
{
	"displayName": "Elisey",
	"email": "elisey@yandex.ru",
	"password": "123456"
}
```
В базу будет внесен новый пользовтель - ответ 200
#### Авторизация
Приложение авторизует пользователя, если получит POST-запрос на `http://localhost:3000/login` со следующим содержимым:
```json
{
	"email": "elisey@yandex.ru",
	"password": "123456"
}
```
Ответ будет записан в куки + 200

Cookie:
```
    "tokenJWT": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhN2RlOTBjY2RlYzI5MjE1NGM3ODM5ZiIsImRpc3BsYXlOYW1lIjoiRWxpc2V5IiwiZW1haWwiOiJzZWxpc2VqQHlhbmRleC5ydSIsImlhdCI6MTUxODIwODM0MH0.4aGqIVc07IexV1nUAjEQwMa_Vw86CrrtXUf5bTQDSM8"
```
Здесь `token` - это JWT (JSON Web Token).
#### Авторизация через JWT
Если передать запрос и в заголовке `Authorization` указать значение JWT, ответом сервера будет успех запроса (или не успех :) )



### Работа приложения с при авторизированном пользователе

#### Просмотр

в заголовке `Authorization` указать значение JWT (взять из куки) + GET /

Ответ будет - массив объектов json

#### Вставка

в заголовке `Authorization` указать значение JWT (взять из куки) + POST /addtask +

```json
{
        "name": "qwerty",
        "check": "false",
        "info": "123456787ertyui",
        "beginningDateTime": "12:00:01",
        "endDateTime": "22:00:01"
	
}
```

#### Изменить запись

в заголовке `Authorization` указать значение JWT (взять из куки) + POST /changetask +

```json
{
        "id": "5a82dc750f66f4206cd261f4",
		"name": "некуцй",
        "check": "false",
        "info": "xcvxcv xcvcv",
        "beginningDateTime": "12:00:02",
        "endDateTime": "22:00:02"
}
```


#### Отметить как выполненное

в заголовке `Authorization` указать значение JWT (взять из куки) + POST /changechec +

```json
{
        "id": "5a82dc750f66f4206cd261f4",
        "check": "true"
}
```

#### Удалить выполненное

в заголовке `Authorization` указать значение JWT (взять из куки) + POST /removechecked +

#### Удалить запись

в заголовке `Authorization` указать значение JWT (взять из куки) + POST /remove +

```json
{
        "id": "5a82dc750f66f4206cd261f4"
}
```

#### Сортировка

в заголовке `Authorization` указать значение JWT (взять из куки) + GET /sort/:sortName/order/:order 

Здесь :sortName - имя параметра по которому сортируем ("name", "check", "info", "beginningDateTime", "endDateTime")
	  :order - порядок сортировки (1 - прямой, 0 - обратный)
 