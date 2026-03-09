sorry, didn't have time to write an updated version for this!

# Plantetto

## plantetto workflow

1. create branch from jira ticket
2. git fetch
3. git checkout -b your-branch-name origin/your-branch-name
4. commit changes
5. git push -u origin/your-branch-name
6. create pull request

## setting up

clone the repo and cd to project folder

### backend

1. cd to backend

```bash
cd backend
```

2. activate pipenv shell

```bash
pipenv shell
```

3. install all dependencies

```bash
pipenv install
```

4. run with

```bash
flask run
```

don't forget to input env details

### frontend

1. cd to frontend

```bash
cd frontend
```

2. install all dependencies

```bash
npm install
```

3. run with

```bash
npm run dev
```

don't forget to input env details<br>

**please also install prettier extension if using vscode for auto-formatting**

## project folder structure

```
.
├── backend/
├── frontend/
├── .gitignore
├── README.md
```

## backend folder structure

This is the initial folder structure, and is not necessarily final. It should change overtime, but the gist of the structure is there.

```
.
├── app/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── controller.py
│   │   │   ├── forms.py
│   │   │   └── __init__.py
│   │   ├── plant/
│   │   │   ├── controller.py
│   │   │   ├── forms.py
│   │   │   └── __init__.py
│   │   ├── post/
│   │   │   ├── controller.py
│   │   │   ├── forms.py
│   │   │   └── __init__.py
│   │   └── user/
│   │       ├── controller.py
│   │       ├── forms.py
│   │       └── __init__.py
│   ├── models/
│   │   ├── plant.py
│   │   ├── post.py
│   │   └── user.py
│   ├── database.py
│   └── __init__.py
├── schema/
│   ├── plants_schema.sql
│   ├── posts_schema.sql
│   └── users_schema.sql
├── config.py
├── Pipfile
└── Pipfile.lock
```

## frontend folder structure

This is the initial folder structure, and is not necessarily final. It should change overtime, but the gist of the structure is there.

```
.
├── public/
├── src/
│   ├── api/            # fetching backend APIs
│   │   ├── authApi.ts
│   │   ├── plantsApi.ts
│   │   ├── postsApi.ts
│   │   └── usersApi.ts
│   ├── assets/
│   ├── components/     # reusable components
│   │   └── ui/
│   ├── features/       # feature specific components and logic
│   │   ├── auth/
│   │   ├── feed/
│   │   ├── plants/
│   │   └── profile/
│   ├── layouts/
│   │   └── MasterLayout.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── garden/
│   │   │   └── MyGarden.tsx
│   │   ├── home/
│   │   │   └── Home.tsx
│   │   ├── landingPages/
│   │   │   └── LandingPage.tsx
│   │   └── profile/
│   │       └── Profile.tsx
│   ├── routes/
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── router.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
