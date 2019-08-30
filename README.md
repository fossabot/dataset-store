# PlatIAgro Dataset Store

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
  - [Run Docker](#run-docker)
  - [Run Local](#run-local)
- [Testing](#testing)

## Introduction

[![Build Status](https://travis-ci.org/platiagro/dataset-store.svg?branch=master)](https://travis-ci.org/platiagro/dataset-store)
[![codecov](https://codecov.io/gh/platiagro/dataset-store/branch/master/graph/badge.svg)](https://codecov.io/gh/platiagro/dataset-store/branch/master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Gitter](https://badges.gitter.im/platiagro/community.svg)](https://gitter.im/platiagro/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Known Vulnerabilities](https://snyk.io/test/github/platiagro/dataset-store/master/badge.svg?targetFile=package.json)](https://snyk.io/test/github/platiagro/dataset-store/master/?targetFile=package.json)

PlatIAgro Dataset Store microservice.

## Requirements

The application can be run locally or in a docker container, the requirements for each setup are listed below.

### Local

- [Node.js](https://nodejs.org/)

### Docker

- [Docker CE](https://www.docker.com/get-docker)
- [Docker-Compose](https://docs.docker.com/compose/install/)

## Quick Start

Make sure you have all requirements installed on your computer, then you can run the server in a [docker container](#run-docker) or in your [local machine](#run-local).
Firstly you need to create a .env file, see the .env.example.

### Run Docker

Run it :

```bash
$ docker-compose up
```

_The default container port is 4000, you can change on docker-compose.yml_

### Run Local:

Run it :

```bash
$ npm install
$ npm run start
```

Or:

```bash
$ yarn
$ yarn start
```

## Testing

You can run the following command to test the project:

```bash
$ npm install
$ npm test
```

Or:

```bash
$ yarn
$ yarn test
```
