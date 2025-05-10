#!/bin/bash

# If .env file does not exist, create it
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

pnpm i
pnpm run dev