# Car Dealership Inventory System

A full-stack web application for managing a car dealership's vehicle inventory. The application supports user registration and authentication, vehicle browsing and searching, vehicle purchases, and administrator-controlled inventory management.

## Features

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Browse and search vehicle inventory
- Purchase vehicles and update available stock
- Administrator-only vehicle creation, restocking, and deletion
- Automated backend tests

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite
- **ORM:** Prisma
- **Authentication:** JWT and bcryptjs
- **Testing:** Jest and Supertest

## Project Structure

```text
car-dealership-inventory/
├── backend/       # Express API, authentication, database and tests
├── frontend/      # React user interface
├── README.md      # Project documentation
└── PROMPTS.md     # AI development prompts and conversation references
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sandhyabaliga/car-dealership-inventory.git
cd car-dealership-inventory
```

### 2. Set up the backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a local `.env` file using `.env.example`, if the project includes one. Configure the required environment variables, including the database connection and JWT secret. Use your own development credentials for any administrator account.

Do not commit `.env` files or real secrets to GitHub.

Generate the Prisma client and initialize the database using the commands supported by the project's Prisma configuration. If the database has not yet been initialized, verify the configured database provider and schema before running the appropriate Prisma setup command.

Start the backend development server:

```bash

npm.cmd run build
node dist/server.js

```

The backend API is expected to run at `http://localhost:3000` when using the default local configuration.

### 3. Set up the frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal, usually `http://localhost:5173`.

Keep both development servers running while using the application.

## Testing and Build Verification

### Backend tests

From the `backend/` directory, run:

```bash
npm test
```

### Backend production build

From the `backend/` directory, run:

```bash
npm run build
```

### Frontend production build

From the `frontend/` directory, run:

```bash
npm run build
```

The backend test suite has passed **14 tests across 2 test suites** in the development environment. Both the backend and frontend production builds have also completed successfully during development.

Run the commands again after your final changes to verify the submitted version.

## API Functionality

The backend provides endpoints for user registration and login, vehicle listing and searching, vehicle purchases, and administrative inventory operations.

Authentication and authorization are used to restrict administrator-only inventory operations.

## My AI Usage

### AI Tool Used
I used ChatGPT as an AI assistant during the development of this project.

### How I Used AI
I used ChatGPT to understand test-driven development (TDD), plan implementation steps, troubleshoot TypeScript compilation errors, resolve backend test failures, and verify the frontend and backend builds. I also used it to help improve project documentation and understand the assignment requirements.

### Reflection on AI Assistance
AI assistance helped me work through errors more efficiently and understand possible solutions when I encountered difficulties. I learned that AI-generated suggestions must be checked against the actual code and validated by running tests and builds. I used the debugging process to improve my understanding of TypeScript, backend development, and testing rather than relying on suggestions without verification.

### AI Conversation Records
Refer to the root `PROMPTS.md` file for the available original ChatGPT conversation links or transcripts.

## Security Notes

- Keep environment files and credentials out of version control.
- Do not publish production secrets or real passwords.
- Use separate, secure credentials when deploying the application.
- Keep local database files and generated build artifacts out of version control when they are intended to remain local.

## Repository

GitHub: https://github.com/sandhyabaliga/car-dealership-inventory
