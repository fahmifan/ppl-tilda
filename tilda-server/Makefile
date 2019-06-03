NAME   := cloud.canister.io:5000/miun173/tilda-server
TAG    := $$(git rev-parse --short HEAD)
IMG    := ${NAME}\:${TAG}
LATEST := ${NAME}\:latest

build:
	@docker build -f ./Dockerfile -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

build-force:
	@docker build --no-cache -f ./Dockerfile -t ${IMG} .

push:
	@docker push ${NAME}

login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}