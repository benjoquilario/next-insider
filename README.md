### Introducing Insider

A Fullstack **social media application** built with **_Next JS_**, **_React_**, **_Tanstack-query_**_, and \*\*\_tailwindCSS_** as a frontend and **_Prisma_**, and **_Posgres DB_\*\* as a backend.

<p align="center">
  <a href="https://github.com/benjoquilario/t3-insider">
      <img src="https://img.shields.io/github/stars/benjoquilario/t3-insider" alt="Github Stars">
    </a>
    <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">
      <img src="https://img.shields.io/github/issues/benjoquilario/t3-insider" alt="Github Issues">
    </a>
     <a href="https://github.com/benjoquilario/t3-insider">
      <img src="https://img.shields.io/github/forks/benjoquilario/t3-insider" alt="Github Forks" />
    </a>
</p>

</br>
  <hr />
<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/next?filename=package.json&color=fff&labelColor=000&logo=nextdotjs&style=flat-square">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/dev/tailwindcss?filename=package.json&color=37b8f1&logo=tailwindcss&labelColor=0b1120&style=flat-square&logoColor=38bdf8">
  </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/react?filename=package.json&color=5fd9fb&logo=react&labelColor=222435&style=flat-square">
  </a>
  <a href="https://www.prisma.io/">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/@prisma/client?filename=package.json&label=prisma&color=2D3748&logo=prisma&labelColor=000&style=flat-square&logoColor=fff">
  </a>
  <a href="https://react-hook-form.com/">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/react-hook-form?filename=package.json&label=react-hook-form&color=EC5990&logo=reacthookform&labelColor=242526&style=flat-square&logoColor=EC5990">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/typescript?filename=package.json&color=3178C6&logo=typescript&labelColor=111&style=flat-square&logoColor=white">
  </a>
  <a href="https://www.framer.com/motion">
    <img src="https://img.shields.io/github/package-json/dependency-version/benjoquilario/t3-insider/framer-motion?logo=framer&style=flat-square&logoColor=white">
  </a>
</p>

## Screenshots

<a href="https://t3-insider.vercel.app/" target="blank">
  <img src="public/desktop.png" />
</a>

### Comments

Share your thoughts in users posts

<img src="public/comments.jpeg" alt="comments" />

Try the App: [t3-insider](https://t3-insider.vercel.app/)

### Features

- Login and Register
- Post CRUD functionalities
- Comment CRUD Functionalities
- Like post
- like comment
- Reply to comments
- Profile Customization
- Suggestion to Follow
- Drag and Drop Image
- Multiple images post
- Followers/Following features
- Fully Responsive
- ...enough talk [see it yourself](https://next-insider.vercel.app/)

### Coming Features

- Realtime Messaging features
- Realtime Notification features
- User can only see following users posts.
- <s>Dark more</s> ✅
- <s>Update profile functionalities</s> ✅
  … and many more

## Installation Steps

1. Clone the repository

```bash
git clone https://github.com/benjoquilario/next-insider.git
```

2. Change the working directory

```bash
cd next-insider
```

3. Install dependencies

```bash
pnpm install
```

4. Create `.env` file in root and add your variables

```bash

AUTH_SECRET=
DATABASE_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
AUTH_TRUST_HOST=http://localhost:3000 // ur url production link

// create redis instance in upstash redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

5. Sync your database

```bash
pnpm dlx prisma migrade dev
```

6. Run the app

```bash
pnpm run dev
```

6. Preview the app

```bash
pnpm run preview
```

You are all set! Open [localhost:3000](http://localhost:3000/) to see the app.

> [!NOTE]
> This project is a work in progress, it still contains bugs and will constantly be updated to stay up-to-date with the latest framework changes.

## Contribution

Your ideas, translations, design changes, code cleaning, real heavy code changes, or any help are always welcome. The more is the contribution, the better it gets.

[Pull requests](https://github.com/benjoquilario/next-insider/pulls) will be reviewed

## Author

### Benjo Quilario

- Twitter: [@iambenjo](https://twitter.com/iam_benjo)
- Github: [@benjoquilario](https://github.com/benjoquilario)
- Portfolio: [@benjoquilario](https://benjoquilario.site)

Please give this repository a ⭐️ if you liked this app. It seems like a little thing, but it helps a lot with the motivation.
