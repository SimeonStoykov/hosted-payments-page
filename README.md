# Hosted Payments Page (HPP)

A Hosted Payments Page application built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

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
