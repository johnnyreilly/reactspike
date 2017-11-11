# ReactSpike 

[![Build Status](https://travis-ci.org/johnnyreilly/reactspike.svg?branch=master)](https://www.travis-ci.org/johnnyreilly/reactspike)

Reacting the ReadSpike...  To access the app go here: https://reactspike.azurewebsites.net/

All changes to the repo are built on Travis and deployed to GitHub Pages.

## Getting started

This is a progressive web application with server-side rendering.  To get up and running do the following:

```shell
    # install dependencies
    yarn install
```

If you want to develop locally, then you will want to run the app in watch mode and spin up the server.  Presently you need to run 2 shells to do this (maybe I'll parallelise this at some point):

```shell
    # in one shell, run the compilation in watch mode
    yarn watch

    # in onother shell, serve the app
    yarn start
```

If you'd like to run the production build locally then:

```shell
    # build the app in production mode
    yarn build

    # serve the app
    yarn start
```

Please note, the production build ships with a service worker for offline use.  

Finally, the app works by using JSON generated from reading multiple RSS feeds.  To generate these locally then:

```shell
    # build the readfeeds TypeScript code
    yarn build:readfeeds

    # run the compiled code
    yarn readfeeds
```