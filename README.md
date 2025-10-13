**Edit a file, create a new file, and clone from Bitbucket in under 2 minutes**

When you're done, you can delete the content in this README and update the file with details for others getting started with your repository.

_We recommend that you open this README in another tab as you perform the tasks below. You can [watch our video](https://youtu.be/0ocf7u76WSo) for a full demo of all the steps in this tutorial. Open the video in a new tab to avoid leaving Bitbucket._

---

## Edit a file

You’ll start by editing this README file to learn how to edit a file in Bitbucket.

1. Click **Source** on the left side.
2. Click the README.md link from the list of files.
3. Click the **Edit** button.
4. Delete the following text: _Delete this line to make a change to the README from Bitbucket._
5. After making your change, click **Commit** and then **Commit** again in the dialog. The commit page will open and you’ll see the change you just made.
6. Go back to the **Source** page.

---

## Create a file

Next, you’ll add a new file to this repository.

1. Click the **New file** button at the top of the **Source** page.
2. Give the file a filename of **contributors.txt**.
3. Enter your name in the empty file space.
4. Click **Commit** and then **Commit** again in the dialog.
5. Go back to the **Source** page.

Before you move on, go ahead and explore the repository. You've already seen the **Source** page, but check out the **Commits**, **Branches**, and **Settings** pages.

---

## Clone a repository

Use these steps to clone from SourceTree, our client for using the repository command-line free. Cloning allows you to work on your files locally. If you don't yet have SourceTree, [download and install first](https://www.sourcetreeapp.com/). If you prefer to clone from the command line, see [Clone a repository](https://confluence.atlassian.com/x/4whODQ).

1. You’ll see the clone button under the **Source** heading. Click that button.
2. Now click **Check out in SourceTree**. You may need to create a SourceTree account or log in.
3. When you see the **Clone New** dialog in SourceTree, update the destination path and name if you’d like to and then click **Clone**.
4. Open the directory you just created to see your repository’s files.

Now that you're more familiar with your Bitbucket repository, go ahead and add a new file locally. You can [push your change back to Bitbucket with SourceTree](https://confluence.atlassian.com/x/iqyBMg), or you can [add, commit,](https://confluence.atlassian.com/x/8QhODQ) and [push from the command line](https://confluence.atlassian.com/x/NQ0zDQ).

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
