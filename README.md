# Allowances Dashboard

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
```
