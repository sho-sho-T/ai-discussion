# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **ai-discussion** project - a full-stack web application currently in initial setup phase. The project uses a containerized development environment with Docker and VS Code Dev Containers.

## Development Environment

### Container Setup
- Use the provided dev container configuration in `.devcontainer/`
- The environment includes Node.js 24, PostgreSQL 16, and necessary development tools
- Run `docker-compose up` from `.devcontainer/` directory to start services

### Database
- PostgreSQL database runs on port 5432
- Connection string: `postgresql://devuser:devpass@db:5432/devdb`
- Database service defined in `.devcontainer/docker-compose.yml`

## Planned Architecture

Based on the dev container configuration, this project is designed as:
- **Frontend**: Next.js application (port 3000)
- **Additional Frontend/API**: React Router application (port 3001) 
- **Backend**: Node.js with Prisma ORM
- **Database**: PostgreSQL with persistent volume

## Port Configuration
- 3000: Next.js development server
- 3001: React Router/API server  
- 5432: PostgreSQL database

## Code Quality Tools
- **Biome**: Configured for linting and formatting
- **Prisma**: Database ORM and migrations

## Current Status
The project currently contains only infrastructure setup. Application code (frontend/backend directories and package.json files) needs to be created when implementing features.

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint (http://localhost:3001)