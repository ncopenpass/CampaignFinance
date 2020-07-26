# Campaign Finance Contributing Guide

## Perquisites

- NodeJS version v12 or newer and NPM
- Docker and Docker-Compose OR PostgreSQL
- Make

## How to Run

1. Ensure all pre-requisites are installed
1. Run `cp server/sample.env server/.env` (If you do not wish to use docker, change the database url in the newly created `.env` file)
1. Run `make first-run` this will run `npm install` for the ui and server and setup the db using Docker. After running this once you shouldn't need to run it again. (If you are not using Docker run `make first-run-no-docker`)
1. Run `make start` this will start the UI and server running on ports 3000 and 3001 respectively. Type `CTRL-c` to exit
1. View the project in your browser at [localhost:3000](http://localhost:3000)
1. To verify that the API is running run `curl http://localhost:3001/status`. You should receive `{"status": "online"}`

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

## How to contribute

- Fork the repo
- Create a feature branch
- Make your changes
- Commit and push your changes
- Create a PR from your forked repo to the main repo
