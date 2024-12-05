# Blog Post Web Application
> **Deskripsi Singkat:** A responsive and user-friendly blog application where users can view, create, edit, and delete blog posts.



---
#### Live Demo: [Blog-Post-web](https://blog-post-web-rho.vercel.app/)

## Feature
- User login
- Post list
- Search and filter post
- Show post detail
- Create new post
- Update post
- Delete post
- Dark mode by Tailwind CSS

## Technologies Used
- NextJs v13 with Typescript & Eslint (Page Router)
- Axios
- TanStack Query v5
- Tailwind CSS v3
- AntDesign v5
- Go REST (fake api)

## Installation Guide
#### Prerequisites
1. Node.js: Ensure you have Node.js installed (v16 or later).
2. Package Manager: npm or yarn installed globally
### Step to Run Locally
1. Clone the repository:
```bash
git clone https://github.com/MarselCu/blog-post-web.git blogpost
cd blogpost
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser and navigate to:
```link
http://localhost:3000
```

### Folder Structure
```bash
blogpost/
.
├── public
├── src
│   ├── components
│   │   └── layout
│   │       └── layout.tsx
│   ├── context
│   │   └── themeContext.tsx
│   ├── pages
│   │   ├── api
│   │   │   ├── hello.ts
│   │   │   ├── postApi.ts
│   │   │   └── userApi.ts
│   │   ├── post
│   │   │   ├── [slug]
│   │   │   │   └── edit.tsx
│   │   │   ├── [slug].tsx
│   │   │   └── create.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   └── login.tsx
│   ├── services
│   │   ├── axios.ts
│   │   └── type.ts
│   └── style
│       └── globals.css
├── .eslintc.json
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## API Endpoints
Base URL: https://gorest.co.in/public/v2
| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| GET    | `/users`              | Login user                  |
| GET    | `/users/:id`          | Take user data              |
| GET    | `/posts`              | Take post with pagination   |
| GET    | `/users/:userId/posts`| Take post from specific user|
| POST   | `/users/:userId/posts`| Create new post             |
| DELETE | `/posts/:postId`      | Delete post by id           |
| PATCH  | `/posts/:postId`      | Update post                 |


## Future Improvements
- Enhance design with modern animations and transitions.
- Clean the code.
- Improve performance with server-side rendering (SSR) or static site generation (SSG).
- Use private backend.

## Lisensi
[MIT License](LICENSE)
