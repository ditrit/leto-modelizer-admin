# leto-modelizer-admin (leto-modelizer-admin)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-admin&metric=alert_status)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-admin)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=security_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=code_smells)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=bugs)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=ncloc)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=coverage)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-api&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-api)

[![](https://dcbadge.vercel.app/api/server/zkKfj9gj2C?style=flat&theme=default-inverted)](https://discord.gg/zkKfj9gj2C)

Administration application for leto-modelizer.

## Features

## Getting Started

### Requirements

- node - v18.14
- npm - v8.19.3

This server is based on [Quasar](https://quasar.dev/).

### Installation

To get started with __leto-modelizer-admin__ using Docker, follow these steps:

#### 1. Install Docker

If you don't have Docker installed on your system, you can download and install it from the official website for your operating system:

* [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Docker Desktop for macOS](https://docs.docker.com/desktop/install/mac-install/)
* [Docker Engine for Linux](https://docs.docker.com/desktop/install/linux-install/)

#### 2. Clone the repository

Open your terminal or command prompt and clone the project repository to your machine:

```bash
git clone git@github.com:ditrit/leto-modelizer-admin.git
cd leto-modelizer-admin
```

## How to build this app

:warning: Leto-Modelizer-Admin can't work without [Leto-Modelizer-Api](https://github.com/ditrit/leto-modelizer-api) and [Leto-Modelizer](https://github.com/ditrit/leto-modelizer), you must setup both of them first!

### Configuration

We are using [Leto-Modelizer-Api](https://github.com/ditrit/leto-modelizer-api) authentication (as a backend). To configure it, you must fill the configuration inside `global.config.json` root file.

All the fields are mandatory.

```json
{
  "backendUrl": "http://localhost:1337/",
  "backendAppId": "leto-modelizer-api-dev",
  "letoModelizerUrl": "http://localhost:8080"
}
```

Here's a description of each key in the provided configuration:
- `backendUrl`: the url of the backend.
- `backendAppId`: the application ID of the backend.
- `letoModelizerUrl`: the url of the leto-modelizer application.

### Native build

Run this command to build the app:

```
npm run build
```

It will generate the built application in the `dist` folder.

### Docker build

To build this app with docker, please use this command:
```bash
docker build . -t leto-modelizer-admin
```
