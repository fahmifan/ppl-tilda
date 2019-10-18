SHELL:=/bin/bash

include .env
export $(shell sed 's/=.*//' .env)

.PHONY: build build-force push login clean

NAME   	:= ${REGISTRY}
VERSION := $$(git describe --tags `git rev-list --tags --max-count=1`)
TAG    	:= ${VERSION}-$$(git rev-parse --short HEAD)
IMG    	:= ${NAME}\:${TAG}
LATEST 	:= ${NAME}\:latest

build:
	@npm run build

build-image: build
	@docker build -f ./Dockerfile -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

build-force:
	@build
	@docker build --no-cache -f ./Dockerfile -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

push:
	@docker push ${IMG}

login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}

changelog:
	@git-chglog -o CHANGELOG.md
