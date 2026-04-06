# sunjay's book: DFS Line Comparator

## Overview
A web application designed to compare lines across popular Daily Fantasy Sports (DFS) platforms to identify undervalued picks and arbitrage opportunities.

### Supported Platforms
- **Underdog**
- **Prizepicks**
- **Onyx**
- **Sleeper**
- **Chalkboard**
- **Draftkings Pick Six**

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router preferred)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** (To be determined: e.g., React Query for API data)

## Core Mandates
1.  **Type Safety:** Rigorously define interfaces for all DFS platform API responses to ensure reliable line comparisons.
2.  **Data Consistency:** Implement robust caching and revalidation strategies to handle fast-changing DFS lines.
3.  **Visual Impact:** Use Tailwind CSS to create a modern, responsive, and data-dense UI that remains easy to navigate on both desktop and mobile.
4.  **Performance:** Optimize API calls and data processing to provide real-time or near-real-time updates.

## Project Standards
- Follow standard Next.js App Router conventions (`app/` directory).
- Use functional components and hooks.
- Adhere to the established Tailwind CSS utility-first approach for all styling.
- Ensure all business logic for line comparison is well-isolated and tested.

## Common Commands
### Development
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Build & Production
```bash
npm run build
npm start
```

### Linting & Quality
```bash
npm run lint
```
