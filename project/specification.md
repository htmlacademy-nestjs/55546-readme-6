## Удалить старые контейнеры связанные с проектом если они есть

```sh
docker rm -f $(docker ps -a | grep readmy | awk '{print $1}' | xargs)
docker volume rm $(docker volume ls | grep readmy | awk '{print $2}' | xargs)
```
## Добавить необходимые .env файлы в той же директории на основе .env-example

#### ./apps/api/api.env
```sh
RABBITMQ_DEFAULT_USER=admin - Пользователь для работы RabbitMQ
RABBITMQ_DEFAULT_PASS=test - Пароль для работы с RabbitMQ

RABBIT_HOST=localhost - Хост для работы RabbitMQ
RABBIT_PASSWORD=test - Пароль для работы с RabbitMQ
RABBIT_PORT=5673 - Порт на котором будет работать RabbitMQ
RABBIT_USER=admin - Пользователь для работы RabbitMQ
API_RABBIT_QUEUE=readmy.notify.api - Название очереди RabbitMQ
API_RABBIT_EXCHANGE=readmy.notify.api - Назание распределителя сообщений RabbitMQ
```
#### ./apps/account/account.env
```sh
MONGO_DB=readmy-users - Название базы данных
MONGO_HOST=localhost - Хост для работы базы данных
MONGO_PORT=27017 - Порт базы данных внутри контейнера
MONGO_USER=admin - Имя пользователя базы данных
MONGO_PASSWORD=123456 - Пароль пользователя базы данных
MONGO_AUTH_BASE=admin - Название базы данных для подключения

MONGO_EXTERNAL_PORT=27018 - Порт базы данных снаружи контейнера

PORT=4000 - Порт на котором будет работать сервис

JWT_ACCESS_TOKEN_SECRET=token-secret-string - JWT секрет токена доступа
JWT_ACCESS_TOKEN_EXPIRES_IN=1d - JWT время жизни токена
JWT_REFRESH_TOKEN_SECRET=refresh-token-secret-string - JWT секрет рефреш токена
JWT_REFRESH_TOKEN_EXPIRES_IN=30d - JWT время жизни рефреш токена

RABBIT_HOST=localhost - Хост для работы RabbitMQ
RABBIT_PASSWORD=test - Пароль для работы с RabbitMQ
RABBIT_PORT=5673 - Порт на котором будет работать RabbitMQ
RABBIT_USER=admin - Пользователь для работы RabbitMQ
RABBIT_QUEUE=readmy.notify.income - Название очереди RabbitMQ
RABBIT_EXCHANGE=readmy.notify - Назание распределителя сообщений RabbitMQ
```
#### ./apps/blog/blog.env
```sh
POSTGRES_USER=admin - Имя пользователя базы данных
POSTGRES_PASSWORD=test - Пароль пользователя базы данных
POSTGRES_DB=readmy_blog - Название базы данных
PGADMIN_DEFAULT_EMAIL=test@mail.ru - Почтовый ящик администратора базы данных
PGADMIN_DEFAULT_PASSWORD=test - Пароль администратора базы данных

PORT=5432 - Порт внутри котейнера на котором будет работать PostgreSQL

POSTGRES_EXTERNAL_PORT=5433 - Порт снаружи котейнера на котором будет работать PostgreSQL
```
#### ./apps/file-storage/file-storage.env
```sh
UPLOAD_DIRECTORY_PATH=/home/user/www/55546-readme-6/project/apps/file-storage/uploads - Путь к директории для сохранения файлов
MONGO_HOST=localhost - Хост для работы базы данных
MONGO_PORT=27019 - Порт базы данных внутри контейнера
MONGO_DB=readmy-file-storage - Название базы данных
MONGO_USER=admin - Имя пользователя базы данных
MONGO_PASSWORD=test - Пароль пользователя базы данных
MONGO_AUTH_BASE=admin - Название базы данных для подключения
```
#### ./apps/notify/notify.env
```sh
RABBITMQ_DEFAULT_USER=admin - Пользователь для работы RabbitMQ
RABBITMQ_DEFAULT_PASS=test - Пароль для работы с RabbitMQ

MONGO_HOST=localhost - Хост для работы базы данных
MONGO_PORT=27020 - Порт базы данных внутри контейнера
MONGO_DB=readmy-notify - Название базы данных
MONGO_USER=admin - Имя пользователя базы данных
MONGO_PASSWORD=test - Пароль пользователя базы данных
MONGO_AUTH_BASE=admin - Название базы данных для подключения

RABBIT_HOST=localhost - Хост для работы RabbitMQ
RABBIT_PASSWORD=test - Пароль для работы с RabbitMQ
RABBIT_PORT=5673 - Порт на котором будет работать RabbitMQ
RABBIT_USER=admin - Пользователь для работы RabbitMQ
RABBIT_QUEUE=readmy.notify.income - Название очереди RabbitMQ
RABBIT_EXCHANGE=readmy.notify - Назание распределителя сообщений RabbitMQ

MAIL_SMTP_HOST=localhost - Хост почтового сервера
MAIL_SMTP_PORT=8025 - Порт почтового сервера
MAIL_USER_NAME='' - Имя пользователя почтового сервера
MAIL_USER_PASSWORD='' - Пароль пользователя почтового сервера
MAIL_FROM=n@test.ru - Почтовый ящик отправителя по умолчанию
```

## Запустить контейнеры

```sh
docker compose --file ./apps/account/docker-compose.dev.yml --env-file ./apps/account/account.env --project-name "readmy-account" up -d
docker compose --file ./apps/blog/docker-compose.dev.yml --env-file ./apps/blog/blog.env --project-name "readmy-blog" up -d
docker compose --file ./apps/file-storage/file-storage.compose.dev.yml --env-file ./apps/file-storage/file-storage.env --project-name "readmy-file-storage" up -d
docker compose --file ./apps/notify/notify.compose.dev.yml --env-file ./apps/notify/notify.env --project-name "readmy-notify" up -d 
```

## На всякий случай, сбросить nx

```sh
npx nx reset
```

## Заполнить БД тестовыми данными

```sh
npx nx run account:db:reset
npx nx run account:db:seed

npx nx run blog:db:reset
npx nx run blog:db:seed
```

## Запустить все сервисы необходимые для работы приложения

```sh
npx nx run api:serve
npx nx run account:serve
npx nx run blog:serve
npx nx run file-storage:serve
npx nx run notify:serve
```

# Запросы для тестирования функционала приложения через API Gateway

- apps/api/src/app/http/api.users.http
- apps/api/src/app/http/api.posts.http
- apps/api/src/app/http/api.comments.http
- apps/api/src/app/http/api.notify.http

# Запросы для тестирования отдельных сервисов

- apps/file-storage/src/app/file-uploader.http
- libs/account/authentication/src/authentication-module/authentication.http
- libs/blog/blog-comment/src/blog-comment-module/blog-comment.http
- libs/blog/blog-post/src/blog-post-module/blog-post.http
