1. Удалить старые контейнеры связанные с проектом если они есть

docker rm -f $(docker ps -a | grep readmy | awk '{print $1}' | xargs)
docker volume rm $(docker volume ls | grep readmy | awk '{print $2}' | xargs)

---

2. Добавить необходимые .env файлы в той же директории на основе .env-example

./apps/account/account.env
./apps/blog/blog.env
./apps/file-storage/file-storage.env
./apps/notify/notify.env

---

3. Запустить контейнеры

docker compose --file ./apps/account/docker-compose.dev.yml --env-file ./apps/account/account.env --project-name "readmy-account" up -d
docker compose --file ./apps/blog/docker-compose.dev.yml --env-file ./apps/blog/blog.env --project-name "readmy-blog" up -d
docker compose --file ./apps/file-storage/file-storage.compose.dev.yml --env-file ./apps/file-storage/file-storage.env --project-name "readmy-file-storage" up -d
docker compose --file ./apps/notify/notify.compose.dev.yml --env-file ./apps/notify/notify.env --project-name "readmy-notify" up -d 

---

4. На всякий случай, сбросить nx

npx nx reset

---

5. Заполнить БД тестовыми данными

npx nx run account:db:reset
npx nx run account:db:seed

nx run blog:db:reset
nx run blog:db:seed

---

6. Запустить все сервисы необходимые для работы приложения

npx nx run api:serve
npx nx run account:serve
npx nx run blog:serve
npx nx run file-storage:serve
npx nx run notify:serve

---------------

### Запросы для тестирования через API Gatewat

- apps/api/src/app/http

### Запросы для тестирования отдельных сервисов

- apps/file-storage/src/app/file-uploader.http
- libs/account/authentication/src/authentication-module/authentication.http
- libs/blog/blog-comment/src/blog-comment-module/blog-comment.http
- libs/blog/blog-post/src/blog-post-module/blog-post.http

