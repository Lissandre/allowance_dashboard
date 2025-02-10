# Kiln Technical Test - Allowance Dashboard

A web application that allows users to manage ERC20 token allowances through wallet authentication.

## Quick words

I have been working for a few years in companies where I am asked not to leave comments in the code, so I continued that in this test, hoping to best represent what I am capable of.

The libraries used are almost all new to me, I tried to adapt to them as best I could, but I suspect that everything is not perfect.

I wrote some tests for the front and back, it seemed important to me to have some to show.

In any case, I remain at your disposal for any questions relating to this test.

Thank you

## Setup

```
# Build the Docker images
docker-compose build

# Start the services
docker-compose up -d

# Install Laravel dependencies
docker-compose exec app composer install

# Generate application key
docker-compose exec app php artisan key:generate

# Run database migrations
docker-compose exec app php artisan migrate

# Install Node.js dependencies and build assets
docker-compose exec node npm install
docker-compose exec node npm run dev

# Run tests
docker-compose exec app php artisan test
docker-compose exec node npm run test
```
