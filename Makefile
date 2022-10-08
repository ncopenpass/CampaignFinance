first-run: install download-data clean-db

first-run-no-docker: install download-data migrate-up etl

first-run-windows: install download-data clean-db-windows

first-run-windows-no-docker: install download-data migrate-up-windows etl

.PHONY: wait-for-postgres
wait-for-postgres:
	$(shell ./scripts/wait-for-postgres-local.sh)

install:
	npm install
	cd server && npm install

start-ui:
	npm run start-ui

start-api:
	cd server && npm run start-dev

start:
	npm run start-dev

.PHONY: build
build:
	npm run build-ui
	rm -rf server/build
	mv build server/build
	cd server && npm run build

start-prod:
	cd server/ && NODE_ENV=production npm run start

start-prod-local:
	cd server/ && NODE_ENV=production DB_IGNORE_SSL=true npm run start

refresh-docker:
	docker-compose -f docker-compose.yml down -v
	docker-compose -f docker-compose.yml up -d

clean-db: refresh-docker wait-for-postgres migrate-up etl

clean-db-windows: refresh-docker wait-for-postgres migrate-up-windows etl

etl:
	cd server && npm exec ts-node bin/etl.ts

migrate-up:
	cd server && npm run migrate up

migrate-up-windows:
	cd server && npm run migrate-no-dot-env up

migrate-down:
	cd server && npm run migrate down

build-dictionary:
	cd scripts && node createDataDictionary

test-server:
	cd server && npm run test

download-data:
	$(info WARNING: automatic downloads do not work. Download a copy of the data from here: https://drive.google.com/uc?export=download&id=1AJOrBuTeGPYyXsXNs4XzX7a5QloZVTGV)
	$(info WARNING (cont.): Copy the extracted CSV files to ./server/tmp)
	# cd server/tmp && ../../scripts/gdownloader.sh && node ../../scripts/extractor.js