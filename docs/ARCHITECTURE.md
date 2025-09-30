# QuantPrep Application Architecture

This document provides a comprehensive overview of the technologies and architectural patterns used to build the QuantPrep application. Understanding these choices is key to contributing effectively to the project.

---

## 1. Core Technology Stack

Our stack is centered around **Next.js** and **TypeScript**, a combination chosen for its performance, developer experience, and robust features for building modern web applications.

### a. Framework: Next.js (with App Router)

- **What it is:** Next.js is a production-grade **React framework** that provides a structured way to build applications. We specifically use its modern **App Router**.
- **Why we use it:**
    - **Performance & SEO:** Next.js excels at server-side rendering (SSR), which means pages are prepared on the server and sent to the user as fully-formed HTML. This leads to significantly faster initial load times and makes our content easily discoverable by search engines like Google—a crucial feature for an educational platform.
    - **Server Components (The "Secret Sauce"):** The App Router allows us to use **React Server Components** by default. This is a revolutionary feature. It means most of our components run exclusively on the server, fetching data and rendering static content without sending any JavaScript to the user's browser. The result is a much lighter, faster experience. Only components that require user interactivity (like a button with an `onClick` handler) are marked with `'use client';` and sent to the browser.
    - **Simplified Routing:** The file system itself defines the website's URL structure. The folder `src/app/(app)/topics/statistics/normal-distribution/` directly maps to the URL `/topics/statistics/normal-distribution`, making navigation intuitive to manage.

### b. Language: TypeScript

- **What it is:** TypeScript is a superset of JavaScript that adds a **static type system**.
- **Why we use it:**
    - **Reliability and Bug Prevention:** In a project of this scale, ensuring data flows correctly is critical. TypeScript acts as a safety net, catching common errors (like passing a `string` where a `number` is expected) during development, long before they can crash the application for a user.
    - **Maintainability & Developer Experience:** Types serve as living documentation for our code. When a developer looks at a function, they immediately know what kind of data it expects and what it returns. This makes the codebase easier to understand, refactor, and build upon.

### c. UI Library: React

- **What it is:** React is a JavaScript library for building user interfaces based on a **component model**.
- **Why we use it:**
    - **Component-Based Architecture:** React allows us to break down our complex UI into small, reusable, and isolated pieces called components (e.g., `Card`, `Button`, `PageHeader`). This makes our code organized, consistent, and easy to manage. We can build a component once and reuse it everywhere.
    - **Vibrant Ecosystem:** As the most popular UI library, React has a massive ecosystem of tools and third-party libraries (like `recharts` for our charts or `react-katex` for our formulas) that accelerate development.

---

## 2. Styling and UI Components

Our visual identity is managed by a consistent and modern styling pipeline.

### a. Styling Engine: Tailwind CSS

- **What it is:** A **utility-first CSS framework**. Instead of writing custom CSS files, we build layouts by applying pre-existing utility classes directly in our HTML (e.g., `p-4` for padding, `flex` for a flexbox container, `font-bold` for bold text).
- **Why we use it:**
    - **Rapid Prototyping:** It allows for incredibly fast UI development without ever leaving the component file.
    - **Consistency:** It enforces a consistent design system (spacing, colors, font sizes), preventing the "style chaos" that can occur in large projects.
    - **Performance:** It automatically removes all unused CSS classes during the build process, resulting in the smallest possible stylesheet for our users.

### b. UI Component Library: ShadCN UI

- **What it is:** A unique collection of reusable UI components (like our `Card`, `Button`, `Dialog`, `Tabs`) built on top of Tailwind CSS.
- **Why we use it:**
    - **Ownership and Customization:** Unlike traditional component libraries, we don't install ShadCN as a dependency. Instead, we copy its source code directly into our project under `src/components/ui`. This gives us full control to customize the components to perfectly match our application's needs.
    - **Theming with CSS Variables:** The entire look and feel (colors, border radius, etc.) is controlled by CSS variables defined in `src/app/globals.css`. This makes it trivial to manage our dark/light mode themes and ensure a consistent visual identity across the entire platform.

---

## 3. Core Architectural Decisions

- **Server-First Approach:** We default to using Server Components for everything unless interactivity is explicitly needed. This is a core principle for maximizing performance.
- **Data-Driven Content:** The curriculum, learning paths, and topic definitions are stored in structured data files (`src/lib/curriculum/`, `src/lib/learning-paths.ts`). The pages read from this data, meaning we can add or change a topic by simply updating a data file, not by creating a new page.
- **Static Overrides for Custom Pages:** For our most complex, interactive pages (like the `ANOVA` or `T-Test` pages), we create specific page files that override the generic template. This gives us the flexibility for bespoke UI where needed, while still benefiting from a scalable template for simpler content pages.