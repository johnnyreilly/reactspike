# ReactSpike 

[![Build Status](https://travis-ci.org/johnnyreilly/reactspike.svg?branch=master)](https://www.travis-ci.org/johnnyreilly/reactspike)

You may have heard of [Readspike](https://readspike.com). This is a rewrite of that in React.  Hence "Reactspike".  Funny right? 

This is a progressive web application built with React and with server-side rendering. All changes to the repo are built on Travis and deployed to Azure.

To access the app go here: https://reactspike.azurewebsites.net/

The app consists of 2 things:

1. A scheduled job that reads multiple RSS feeds so you don't have to.
2. An Express app that serves up a React version of Readspike, complete with server-side rendering.

It's running on Azure, for free.  So the scheduled job only runs when the app is awake. The scheduled job is configured to automagically work when deployed to azure.  However, there's nothing special about the job; it will run anywhere that node runs.  The only requirement is that it runs in the same location as the web UI.

## Getting started

To get up and running do the following:

```shell
    # install dependencies
    yarn install
```

### RSS Feed Reader

The app works by using JSON generated from reading multiple RSS feeds.  To generate these locally then:

```shell
    # build the readfeeds TypeScript code
    yarn build:readfeeds

    # run the compiled code
    yarn readfeeds
```

The code for this lives under `src-feed-reader`

### React UI

If you want to develop locally, you will first need to have run the `yarn readfeeds` job so you have some data to display. Then you will want to run the app in watch mode and spin up the server. That's super easy.  Presently you need to run 2 shells to do this (maybe I'll parallelise this at some point):

```shell
    # in one shell, run the compilation in watch mode
    yarn watch

    # in onother shell, serve the app
    yarn start
```

If you'd like to run the production build locally (always interesting) then:

```shell
    # build the app in production mode
    yarn build

    # serve the app
    yarn start
```

Please note, the production build ships with a service worker for offline use; running `yarn watch` does not.

The code for this lives under `src`
