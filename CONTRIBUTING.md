# Campaign Finance Contributing Guide

## Perquisites

- NodeJS version v12 or newer and NPM
- Docker and Docker-Compose OR PostgreSQL
- Make

## How to Run

### MacOS/Linux

- Ensure all pre-requisites are installed
- Download this data and unzip this [file](https://drive.google.com/file/d/1KMMrK0WIPdJyqb76j4VOw3q9pZomDbqX/view?usp=sharing)
- Copy all the CSV files to the `./server/tmp` directory
- Run `cp server/sample.env server/.env` (If you do not wish to use docker, change the database url in the newly created `.env` file)
- Run `make first-run` this will run `npm install` for the ui and server and setup the db using Docker. After running this once you shouldn't need to run it again. (If you are not using Docker run `make first-run-no-docker`)
- Run `make start` this will start the UI and server running on ports 3000 and 3001 respectively. Both the UI and server will be running in watch mode, so any changes should automatically take effect. Type `CTRL-c` to exit
- View the project in your browser at [localhost:3000](http://localhost:3000)

### Windows

- Ensure all pre-requisites are installed
- Download this data and unzip this [file](https://drive.google.com/file/d/1KMMrK0WIPdJyqb76j4VOw3q9pZomDbqX/view?usp=sharing)
- Copy all the CSV files to the `./server/tmp` directory
- copy `server/sample.env` to `server/.env` (If you do not wish to use docker, change the database url in the newly created `.env` file)
- Add your `DATABASE_URL` to your environment
  - Powershell: `$env:DATABASE_URL = 'YOUR_DATABASE_URL'`
- Run `make start` this will start the UI and server running on ports 3000 and 3001 respectively. Both the UI and server will be running in watch mode, so any changes should automatically take effect. Type `CTRL-c` to exit
- View the project in your browser at [localhost:3000](http://localhost:3000)

After the initial setup, to start and stop the project just run `make start` and `CTRL-c` to exit

## Tech

### UI

- [React](https://reactjs.org/) - A component based reactive UI library
- [USWDS](https://designsystem.digital.gov/) - For designs and components (this is similar to other libraries like Bootstrap)
  - [USWDS Component Library](https://github.com/trussworks/react-uswds) - Pre-made React components for the USWDS

### Backend

- [NodeJS](https://nodejs.org) - A server side JavaScript runtime
- [ExpressJS](https://expressjs.com) - An HTTP server for Node
- [PostgreSQL](https://www.postgresql.org/) - An open source relational database
- [Docker](https://docker.io) - A container runtime
- [Docker-Compose](https://docs.docker.com/compose/) - A way to manager Docker applications

## Project Structure

- `./src` directory contains the UI React code
- `./server` contains the backend API code

## Wireframes

Wireframes are on [Figma](https://www.figma.com/proto/OcC48DWJjwCsPigGa9vb82/Campaign-Finance-Dashboard-Wireframes?node-id=2%3A59&viewport=-1320%2C-986%2C0.3811715841293335&scaling=scale-down-width)

## How to contribute

- Fork the repo
- Create a feature branch
- Make your changes
- Commit and push your changes
- Create a PR from your forked repo to the main repo
