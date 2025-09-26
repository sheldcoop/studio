# QuantFinance Lab High-Level Architecture

This document provides a high-level overview of the QuantFinance Lab application's architecture to help new developers get up to speed quickly.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative:** [Genkit](https://firebase.google.com/docs/genkit) (currently disabled)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Core Architectural Concepts

### 1. Next.js App Router

The application is built using the Next.js App Router paradigm. This means:
- **File-based Routing:** The folder structure inside `src/app` directly maps to the application's URL routes. For example, `src/app/(app)/dashboard/page.tsx` corresponds to the `/dashboard` route.
- **Layouts:** Shared UI, like the header and main navigation, is defined in `layout.tsx` files. The root layout is `src/app/layout.tsx`, and the layout for the authenticated app is `src/app/(app)/layout.tsx`.
- **Route Groups:** The `(app)` folder is a Next.js Route Group. This allows us to apply a specific layout to a group of routes (`/dashboard`, `/paths`, etc.) without affecting the URL structure.

### 2. Server Components vs. Client Components

This is the most important architectural pattern in the app.

- **Server Components (Default):** By default, all components in the App Router are **React Server Components (RSCs)**. They run exclusively on the server. They are ideal for fetching data and rendering static content because they send zero JavaScript to the client, leading to faster page loads. Most pages (like `dashboard`, `paths`) are primarily Server Components.

- **Client Components (Opt-in):** Components that require browser-only APIs or interactivity (e.g., `useState`, `useEffect`, event handlers like `onClick`) must be explicitly marked with the `'use client';` directive at the top of the file. These components are pre-rendered on the server and then "hydrated" on the client to become interactive. Good examples include the interactive charts on the statistics pages or the `Header` component which manages mobile menu state.

Our strategy is to **keep Client Components as small as possible** and push them to the "leaves" of the component tree.

### 3. State Management

The application uses simple, component-level state for most features.
- **`useState` and `useEffect`:** For local component state and side effects in Client Components. This is sufficient for most of our interactive UI, like the calculators and charts.
- **React Context (Provider Pattern):** For cross-cutting concerns, we use React Context. The best example is the `ChartContainer` (`src/components/ui/chart.tsx`), which provides theme and configuration information to all of its children, avoiding the need to pass props down manually ("prop drilling").

### 4. Styling

- **Tailwind CSS:** All styling is done using Tailwind CSS utility classes.
- **ShadCN UI and CSS Variables:** We use ShadCN for our base UI components. The application's theme (colors, fonts, etc.) is defined using CSS variables in `src/app/globals.css`. This allows for a consistent look and feel and easy theme updates. We avoid hard-coding colors directly in components, preferring to use the theme variables (e.g., `bg-primary`, `text-muted-foreground`).

### 5. Data and Content

- **Static Data:** Most of the application's content (like learning paths and community posts) is currently mocked and stored in `src/lib/data.ts`. In a real-world scenario, this data would be fetched from a database or a headless CMS.
- **Client-Side Data Generation:** The interactive charts generate their sample data on the client side within `useEffect` hooks. This is for demonstration purposes; real financial data would be fetched from a dedicated API.
