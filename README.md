# Hosted Payments Page (HPP)

A Hosted Payments Page application built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory with the following variable:

```env
NEXT_PUBLIC_API_URL=https://api.sandbox.bvnk.com/api/v1
```

### Installation

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

### Usage

1. **Generate a Quote UUID**:
   Create a payment summary via the BVNK Sandbox API:
   `POST https://api.sandbox.bvnk.com/api/v1/pay/summary`

   Copy the `uuid` from the response.

2. **Navigate to the Payment Page**:
   The application root (`/`) is empty. You must navigate directly to the payment page:
   `http://localhost:3000/payin/<UUID>`

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run a specific test file:

```bash
npm test -- AcceptQuotePage.test.tsx
```

### Application Routes

- **Accept Quote**: `http://localhost:3000/payin/<UUID>`
- **Pay Quote**: `http://localhost:3000/payin/<UUID>/pay`
- **Expiry**: `http://localhost:3000/payin/<UUID>/expired`

Replace `<UUID>` with a valid quote UUID from the BVNK Sandbox API.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Formatting**: Prettier
