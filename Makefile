first-run: install clean-db

first-run-no-docker: install migrate-up etl

first-run-windows: install clean-db-windows

first-run-windows-no-docker: install migrate-up-windows etl

install:
	npm install
	cd server && npm install

start-ui:
	npm run start-ui

start-api:
	cd server && npm run start-dev

start:
	npm start

build:
	npm run build

refresh-docker:
	docker-compose -f docker-compose.yml down -v
	docker-compose -f docker-compose.yml up -d

clean-db: refresh-docker migrate-up etl

clean-db-windows: refresh-docker migrate-up-windows etl

etl:
	cd server && node bin/etl.js

migrate-up:
	cd server && npm run migrate up

migrate-up-windows:
	cd server && npm run migrate-no-dot-env

migrate-down:
	cd server && npm run migrate down