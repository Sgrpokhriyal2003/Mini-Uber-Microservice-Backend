## Mini Uber Microservice
A simple microservices-based backend for a ride-hailing (Uber-like) application. This project is organized into separate services for user, captain, ride, and gateway, each with its own responsibilities.

### Features
- User and captain authentication (with token blacklisting)
- Ride creation and management
- Microservices communicate via RabbitMQ (see service/rabbit.js in each service)
- Modular code structure for easy maintenance and scaling
- Getting Started

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 8
- **Auth**: JSON Web Token (JWT) + `bcryptjs`
- **Config**: `dotenv`
- **Communication** : `RabbitMQ`

## Getting Started

### Prerequisites
- Node.js v18+ and npm
- MongoDB (local or Atlas connection string)

### Clone the repository 
```bash
git clone https://github.com/Sgrpokhriyal2003/Mini-Uber-Microservice-Backend
cd mini-uber-microservice
```
### Installation
```bash
cd user
npm install
cd captain
npm install
cd ride
npm install
cd gateway
npm install
```

### Environment
Create a `.env` file at the project root:
```bash
MONGO_URL=
JWT_SECRET=
RABBIT_MQ_URL=
```

### Run
```bash
cd user, npx nodemon
cd captain, npx nodemon
cd ride, npx nodemon
cd gateway, npx nodemon
```

## Project Structure
```
mini-uber-microservice/
  captain/
  gateway/
  ride/
  user/
```
