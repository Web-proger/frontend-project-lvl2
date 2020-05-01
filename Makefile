# Makefile

install:
	npm install

start:
	npx babel-node src/index.js

build:
	npm run build

publish:
	npm publish --dry-run

lint:
	npx eslint .
