# SoundCloud

Урезанная копия сервиса SoundCloud на нативном JavaScript.

## Цели
- получение новых и закрепление существующих навыков разработки на JavaScript;
- углубиться и понять основной принцип работы всех существующих реактивных библиотек/фреймворков для разработки интерфейсов изнутри (React, Vue, Svetle, Preact, Angular и т.д.);
- практическое применение ООП и различных паттернов проектирования;
- поработать с конфигурацией и настройкой бандлера Webpack.
## Описание
Данный проект представляет собой serverless приложение для прослушивания музыки онлайн, работающее по принципу реактивности. Для работы с аудио используется встроенный класс Audio. В качестве backend использовался бесплатный сервис [Firebase](https://firebase.google.com/) и его API.
## Установка и запуск

```sh
$ npm install && npm dev
```

или

```sh
$ yarn install && yarn dev
```
## Пример

Демо проекта размещено на [github pages](https://grokhotun.github.io/sound-cloud/).

Пример инциализации приложения:
```js
const soundCloud = new SoundCloud('#root', {
  components: [Header, Player, Uploader, Searchbar, TrackList, Footer],
  store,
  audio,
  firebase
})

soundCloud.init()
```