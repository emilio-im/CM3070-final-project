## CM3070 - Final Project

Project developed as prototype for the UoL's Final Project (CM3070).
To check the code running in development open [cm3070-final-project.vercel.app](https://cm3070-final-project.vercel.app).

### How to run

First, rename the `.env.example` file to `.env` and fill the values with the ones from the the final report (appendix).

*Notes: to run the app locally these values need to be defined:*

```
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
GITHUB_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
MONGODB_URI=""
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=""
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

And open [http://localhost:3000](http://localhost:3000) to check the result.

### Login

I have added a "mock" and fake account to check all the features locally. To sign in with that account you need press the "Log In (mock account)" button inside the navbar.

### Pages

- [Home](http://localhost:3000/)
- [Profile](http://localhost:3000/profile)
- [New Document](http://localhost:3000/documents/new)
- [New Workspace](http://localhost:3000/workspaces/new)
- Document details
