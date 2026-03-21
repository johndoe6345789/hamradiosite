.PHONY: up down build dev dev-down logs

up: build
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

dev:
	docker compose -f docker-compose.dev.yml up --build

dev-down:
	docker compose -f docker-compose.dev.yml down

logs:
	docker compose logs -f
