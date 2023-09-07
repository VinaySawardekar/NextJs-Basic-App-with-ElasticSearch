# NextJs-Basic-App-with-ElasticSearch

## Claim Verification Portal

A Basic Nextjs App For URL Verification which is implemented with ElasticSearch. User can register themselves as `User` and `Editor` role. It is a Portal for User to add URL (Claim) and get verified by the Editor. User can search any URL claim using ElasticSearch which give them better search result.

## Features
- Next Js Basic Implementation
- ElasticSearch
- Google Login
- Magic link


## Register

User's can register themselves by accessing the below
URL : http://localhost:3000/dashboard/register

### Tech Stack
[NextJs](https://nextjs.org/docs/getting-started/installation)

CSS - [Tailwindcss](https://tailwindcss.com/docs/guides/nextjs)

### Database
MongoDb

## Requirement

For development, you will only need Node.js and a node global package, Yarn, installed in your environment.

#### Node
- ##### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- ##### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- ##### Node installation on Mac

  Prerequisites
  brew should be installed on your system. if not download it from [Homebrew's official website](https://brew.sh/) and follow the procedure.

      $ brew install node

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command to check version .

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

#### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn


# Installation
## Getting Started
Lets go ahead and setup our application
### Code setup & Installation

    $ git clone <link>
    $ cd claim-verification
    $ yarn install
---
### Running the project
#### Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`MONGODB_URI`

`MONGODB_DATABASE`

`NEXTAUTH_URL`

`NEXTAUTH_SECRET`

`GOOGLE_ID`

`GOOGLE_SECRET`

`JWT_SECRET`

`JWT_EXPIRES`
`GMAIL_USERNAME`

`GMAIL_PASSWORD`

`ORIGIN`

`SEARCH_KEY`

`ELASTIC_SEARCH_API_ENDPOINT`

- `MONGODB_URI` - A Free MongoDb Atlas Cluster. For Reference - https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/

- `GOOGLE_ID`,`GOOGLE_SECRET` You can generate your keys from https://console.cloud.google.com/. Refer [this document for more understanding](https://console.cloud.google.com/)

- `GMAIL_USERNAME`, `GMAIL_PASSWORD` is used to send the email using smtp server.

- `SEARCH_KEY`, `ELASTIC_SEARCH_API_ENDPOINT` These are provided by the elastic.co platform for having the ElasticSearch API wroking. To Read More about Setup & Implement the ElasticSearch API. Refer [Getting Started with Enterprise Elastic Search](https://www.elastic.co/guide/en/enterprise-search/current/start.html?lphiltid=64f6db84e62d7d03e32368510) and [Search API](https://www.elastic.co/guide/en/app-search/8.9/search.html#search)



Then, run the development server:

```bash
npm run dev
# or
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the portal.



## Learn More

To Learn More about [Magic Link](https://workos.com/blog/a-guide-to-magic-links?lphiltid=64f5b4fa2302e203d3f1116e)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Authors
- [@Vinay Sawardekar](https://github.com/VinaySawardekar)