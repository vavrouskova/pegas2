# Default target
.DEFAULT_GOAL := help

# Check if docker compose is available, otherwise use docker-compose
DOCKER_COMPOSE ?= $(shell command -v docker-compose > /dev/null 2>&1 && echo "docker-compose" || echo "docker compose")

# Determine which Docker Compose file to use based on the APP_ENV variable
DOCKER_FILE ?= docker-compose.yml

# Path to the environment file
ENV_FILE ?= .env

# Container and command defaults
CONTAINER ?= next-js
COMMAND ?= /bin/bash

# Get the root folder name and one level below
STACK_NAME ?= $(shell echo $(notdir $(shell dirname $(shell pwd)))_$(notdir $(shell pwd)) | tr '[:upper:]' '[:lower:]')

# Helper for running docker-compose commands with stack name
define DOCKER_COMPOSE_CMD
 STACK_NAME=$(STACK_NAME) $(DOCKER_COMPOSE) -f $(DOCKER_FILE) --env-file $(ENV_FILE) -p $(STACK_NAME) $(1)
endef

.PHONY: help
help: ## Display this help message.
	@echo "Usage: make [target] [OPTION=VALUE]..."
	@echo
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*##"; printf "%-30s %s\n", "Target", "Description"; printf "%-30s %s\n", "------", "-----------";} /^[a-zA-Z_-]+:.*?##/ { printf "%-30s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo
	@echo "Available options:"
	@echo
	@echo "  DOCKER_COMPOSE          The Docker Compose command to use (docker-compose or docker compose)."
	@echo "                          \033[1mBy default, it will use the first one found: $(DOCKER_COMPOSE)\033[0m"
	@echo
	@echo "  DOCKER_FILE             The Docker Compose file to use."
	@echo "                          \033[1mDefault: \"$(DOCKER_FILE)\"\033[0m"
	@echo
	@echo "  ENV_FILE                The path to the environment file."
	@echo "                          \033[1mDefault: \"$(ENV_FILE)\"\033[0m"
	@echo
	@echo "  STACK_NAME        	  The name of the stack."
	@echo "                          \033[1mDefault: \"$(STACK_NAME)\"\033[0m"

.PHONY: docker-build
docker-build: ## Build the docker image.
	$(call DOCKER_COMPOSE_CMD,build)

.PHONY: docker-start
docker-start: ## Start the docker container.
	$(call DOCKER_COMPOSE_CMD,up -d)

.PHONY: docker-stop
docker-stop: ## Stop the docker container.
	$(call DOCKER_COMPOSE_CMD,down)

.PHONY: docker-restart
docker-restart: ## Restart the docker container.
	$(call DOCKER_COMPOSE_CMD,restart)

.PHONY: docker-logs
docker-logs: ## Show the logs of the docker container.
	$(call DOCKER_COMPOSE_CMD,logs -f)

.PHONY: docker-exec
docker-exec: ## Execute a command in the docker container.
	@read -p "Enter container name (default: $(CONTAINER)): " container; \
	container=$${container:-$(CONTAINER)}; \
	read -p "Enter command to run (default: $(COMMAND)): " command; \
	command=$${command:-$(COMMAND)}; \
	$(call DOCKER_COMPOSE_CMD,exec -it $$container sh -c "$$command")

.PHONY: docker-deploy
docker-deploy: ## Deploy the application in the docker container.
	git pull && $(MAKE) docker-build && $(MAKE) docker-start
