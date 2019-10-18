# PlatIAgro Dataset Store

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
  - [Run Docker](#run-docker)
  - [Run Local](#run-local)
- [Testing](#testing)
- [API](#api)

## Introduction

[![Build Status](https://travis-ci.org/platiagro/dataset-store.svg?branch=master)](https://travis-ci.org/platiagro/dataset-store)
[![codecov](https://codecov.io/gh/platiagro/dataset-store/branch/master/graph/badge.svg)](https://codecov.io/gh/platiagro/dataset-store/branch/master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Gitter](https://badges.gitter.im/platiagro/community.svg)](https://gitter.im/platiagro/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Known Vulnerabilities](https://snyk.io/test/github/platiagro/dataset-store/master/badge.svg?targetFile=package.json)](https://snyk.io/test/github/platiagro/dataset-store/master/?targetFile=package.json)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmiguelfferraz%2Fdataset-store.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmiguelfferraz%2Fdataset-store?ref=badge_shield)

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
**Firstly you need to create a .env file, see the .env.example.**

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

To run tests with code coverage:

```bash
$ npm run test-coverage
```

Or:

```bash

$ yarn test-coverage
```

## API

API Reference with examples.

### Upload

**Upload Dataset and Header:** <br>
method: POST <br>
url: /datasets

With header:

```
curl -X POST \
  http://localhost:3000/datasets/ \
  -H 'Content-Type: multipart/form-data' \
  -F dataset=@/l/disk0/mferraz/Documentos/platia/BigML_Dataset_Machine_Failure_ok.csv \
  -F header=@/l/disk0/mferraz/Documentos/platia/feature_type_ok.txt \
  -F experimentId=a2958bc1-a2c5-424f-bcb3-cf4701f4a423
```

Or:

```
curl -X POST \
  http://localhost:3000/datasets/ \
  -H 'Content-Type: multipart/form-data' \
  -F dataset=@/l/disk0/mferraz/Documentos/platia/BigML_Dataset_Machine_Failure_ok.csv \
  -F experimentId=a2958bc1-a2c5-424f-bcb3-cf4701f4a423
```

In this last case, the API will infer columns types.

### Datasets

**Get Dataset by ID:** <br>
method: GET <br>
url: /datasets/:datasetId

```
curl -X GET \
  http://localhost:3000/datasets/2270d302-a4d8-449c-a9d0-8c47d1172641
```

### Headers

**Get Header by ID:** <br>
method: GET <br>
url: /headers/:headerId

```
curl -X GET \
  http://localhost:3000/headers/9fd5ac4a-bddf-4a02-9f04-bb4810d963b3
```

### Columns

**Get columns from Header:** <br>
method: GET <br>
url: /headers/:headerId/columns

```
curl -X GET \
 http://localhost:3000/headers/1a1b337f-f04e-4d17-8658-3420bc46dde2/columns/
```

**Update Column:** <br>
method: PATCH <br>
url: /headers/:headerId/columns/:columnId

```
curl -X PATCH \
 http://localhost:3000/datasets/9d84c9d7-23d7-4977-b474-2d9dd5026c79/columns/a2958bc1-a2c5-424f-bcb3-cf4701f4a423 \
    -d '{
        "datatype": "DateTime"
    }'
```

### Results

**Get Dataset table preview:** <br>
method: GET <br>
url: /results/:experimentId/dataset/:datasetId

```
curl -X GET \
  http://localhost:3000/results/a2958bc1-a2c5-424f-bcb3-cf4701f4a423/dataset/c11e5412-3217-4912-aa2d-3f34a21d215d
```

**Get result table preview:** <br>
method: GET <br>
url: /results/:experimentId/:task/:headerId

```
curl -X GET \
  http://localhost:3000/results/37abdc18-df28-4ab9-9f8d-9a6d2db1eb76/feature-temporal/6415aac6-a34f-4c5d-bf98-0853888a6c37
```

**Get plot:** <br>
method: GET <br>
url: /results/:experimentId/plot

```
curl -X GET \
  http://localhost:3000/results/37abdc18-df28-4ab9-9f8d-9a6d2db1eb76/plot
```

**Get plot type:** <br>
method: GET <br>
url: /results/:experimentId/type

```
curl -X GET \
  http://localhost:3000/results/37abdc18-df28-4ab9-9f8d-9a6d2db1eb76/type
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmiguelfferraz%2Fdataset-store.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmiguelfferraz%2Fdataset-store?ref=badge_large)