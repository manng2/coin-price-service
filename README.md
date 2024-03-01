# Accommodation Data Fusion

A simple web server for procuring and merging hotel data from multiple suppliers

## Tech stacks

- Node.js (Express.js)
- TypeScript
- Jest
- Redis
- GitHub Actions
- AWS EC2

## Installation

Prerequisites:
- Node.js
- Pnpm is installed globally
- Redis server is running locally with port **6379**

Steps:
1. Cloning the source code
2. Run `pnpm i`
3. Run `pnpm run dev` to serve the web server locally. The server will listen on port **3000**

## API Request

There is 1 API to retrieve hotel data: `GET /hotel`. This API accept following parameters
- **hotels**: List hotel ids - *ex: hotels=1,2,3*
- **destination**: Destination id - *ex: destination=1*

Both parameters are **optional**.


