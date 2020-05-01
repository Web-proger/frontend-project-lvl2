# Makefile

install:
	npm install

start:
	npx babel-node src/index.js

build:
	NODE_ENV=production babel src --out-dir dist

publish:
	npm publish --dry-run

lint:
	npx eslint .
