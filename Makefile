first-run: install clean-db

first-run-no-docker: install migrate-up etl

install:
	npm install
	cd server; npm install

start-ui:
	npm run start-ui

start-api:
	cd server; npm run start-dev

start:
	npm start

build:
	npm run build

clean-db:
	docker-compose -f docker-compose.yml down -v
	docker-compose -f docker-compose.yml up -d
	cd server; npm run migrate up; node bin/etl.js

etl:
	cd server; node bin/etl.js

migrate-up:
	cd server; npm run migrate up

migrate-down:
	cd server; npm run migrate down