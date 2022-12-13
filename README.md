## Set up server

- Copy .env.example to .env

```
cp .env.example .env
```

- Open .env and change DATABASE_URL value

```bash
cd server
# Install packages
yarn
# Push DB Schema
npx prisma db push
# Generate PrismaClient
npx prisma generate
# Run Watch Server
yarn watch
# Install nodemon if you don't have it globally
yarn add -D nodemon
# Open new terminal and run dev server
yarn dev
```

## Set up Client

```bash
cd client

# Install packages
yarn

# Run dev server

yarn dev
```

- **Note**: you can change listen port in vite.config.ts
