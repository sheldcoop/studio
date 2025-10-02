# QuantPrep Application Architecture

This document provides a comprehensive overview of the technologies and architectural patterns used to build the QuantPrep application. Understanding these choices is key to contributing effectively to the project.

---

## 1. Core Technology Stack

Our stack is centered around **Next.js** and **TypeScript**, a combination chosen for its performance, developer experience, and robust features for building modern web applications.

### a. Framework: Next.js 15 (with App Router)

- **What it is:** Next.js is a production-grade **React framework**. We specifically use **version 15** and its modern **App Router**.
- **Why we use it:**
    - **Server Components (The "Secret Sauce"):** The App Router allows us to use **React Server Components** by default. This is a revolutionary feature. It means most of our components run exclusively on the server, fetching data and rendering static content without sending any JavaScript to the user's browser. The result is a much lighter, faster experience. Only components that require user interactivity (like a button with an `onClick` handler) are marked with `'use client';` and sent to the browser.
    - **Simplified Routing:** The file system itself defines the website's URL structure. For example, the folder `src/app/(app)/learning-paths/` directly maps to the URL `/learning-paths`.
    - **Dynamic Routing with Async Params (Next.js 15):** A key change in Next.js 15 is that props for dynamic pages (like `params`) are now **asynchronous**. This means page components must be `async` functions that `await` the props.
      ```typescript
      // Example for src/app/(app)/topics/[slug]/page.tsx
      type TopicPageProps = { params: Promise<{ slug: string }> };

      export default async function TopicPage({ params }: TopicPageProps) {
        const { slug } = await params;
        // ...
      }
      ```
    - **Colocation:** All files related to a specific route—the page itself (`page.tsx`), its loading UI (`loading.tsx`), and its error UI (`error.tsx`)—can live together inside the same folder. This makes finding and managing route-specific code much easier.

### b. Language: TypeScript

- **What it is:** TypeScript is a superset of JavaScript that adds a **static type system**.
- **Why we use it:**
    - **Reliability and Bug Prevention:** In a project of this scale, ensuring data flows correctly is critical. TypeScript acts as a safety net, catching common errors (like passing a `string` where a `number` is expected) during development, long before they can crash the application for a user.
    - **Maintainability & Developer Experience:** Types serve as living documentation for our code. When a developer looks at a function, they immediately know what kind of data it expects and what it returns. This makes the codebase easier to understand, refactor, and build upon.

### c. UI Library: React

- **What it is:** React is a JavaScript library for building user interfaces based on a **component model**.
- **Why we use it:**
    - **Component-Based Architecture:** React allows us to break down our complex UI into small, reusable, and isolated pieces called components (e.g., `Card`, `Button`, `PageHeader`). This makes our code organized, consistent, and easy to manage. We can build a component once and reuse it everywhere, following the **DRY (Don't Repeat Yourself)** principle.
    - **Vibrant Ecosystem:** As the most popular UI library, React has a massive ecosystem of tools and third-party libraries that accelerate development. Our key external libraries are:
        - **`recharts`**: For all data visualizations and charts.
        - **`react-katex`**: For rendering all mathematical formulas and equations consistently.

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

## 3. Core Architectural Decisions: Routing and Content

The application's routing and content architecture is designed to be scalable, maintainable, and prevent common "404 Not Found" errors. This is achieved through a **Unified Dynamic Routing Pattern**.

### a. The "Slug" Pattern: One Page to Rule Them All

Instead of creating a separate static file for every single topic (e.g., `/topics/t-test.tsx`), we use a single dynamic file that acts as a template for all similar pages. This is the **only** correct way to structure content pages in this project.

-   **All Topic Pages:** Handled exclusively by `src/app/(app)/topics/[slug]/page.tsx`.
    -   When a user visits `/topics/t-test`, Next.js uses this dynamic file. The `slug` ("t-test") is passed as a parameter to the page component, which then uses it to fetch and display the correct topic data.
-   **All Learning Path Pages:** Handled exclusively by `src/app/(app)/learning-paths/[slug]/page.tsx`.
    -   This follows the same pattern for URLs like `/learning-paths/linear-algebra-for-quantitative-finance`.

**Why this is critical:** In the past, having redundant static page files (e.g., `topics/t-test/page.tsx`) alongside the dynamic `[slug]` page created routing conflicts. Next.js would get confused about which file to serve, leading to unpredictable 404 errors. The unified dynamic route pattern eliminates this ambiguity entirely.

### b. Data-Driven Content: The Single Source of Truth

The content for every topic and learning path is not stored in the page components themselves. Instead, it is defined in structured TypeScript files located in `src/lib/curriculum/` and `src/lib/learning-paths.ts`.

-   **The `href` Property is Key:** For this system to work, the `href` property within each topic object in our data files **must** match the dynamic file structure defined above.
    -   **Correct:** A topic with `id: 't-test'` **must** have `href: '/topics/t-test'`.
    -   **Incorrect:** `href: '/t-test'` or `href: '/statistics/t-test'`.
-   **Adding New Content:** To add a new topic, a developer only needs to add a new object to the appropriate array in the `src/lib/curriculum/` directory. No new page files need to be created.

### c. Index Pages for Discoverability

To complement the dynamic routes, we have dedicated index pages that list all available content:

-   `src/app/(app)/topics/page.tsx`: This file is responsible for rendering the main `/topics` page, which displays a grid of **all** available topics defined in the curriculum.
-   `src/app/(app)/learning-paths/page.tsx`: This file renders the main `/learning-paths` page, which displays a grid of all available learning paths.

This architecture ensures a robust, scalable, and easy-to-maintain content system.

---

## 4. Testing Strategy

Our application uses a multi-layered testing strategy to ensure code quality and prevent regressions. The configuration for this is located in `jest.config.ts` and `jest.setup.js`.

- **Unit Testing (Jest):**
  - **Purpose:** To test small, isolated pieces of pure logic, primarily our utility and calculation functions in `src/lib/math.ts`.
  - **Impact:** Guarantees that our foundational calculations are correct. These tests are fast, easy to write, and form the base of our testing pyramid.

- **Integration Testing (React Testing Library):**
  - **Purpose:** To test individual components to ensure they render correctly and behave as a user would expect. This is our primary testing method for interactive client components (e.g., calculators, interactive charts).
  - **Impact:** This is the most valuable type of testing for our app, giving us high confidence that our UI works as intended. Tests simulate user actions like clicking buttons and typing into fields.

- **(Future) End-to-End Testing (Playwright/Cypress):**
  - **Purpose:** To simulate a full user journey in a real browser (e.g., "log in, navigate to a page, complete a quiz").
  - **Impact:** This provides the ultimate assurance that critical user flows are not broken. This is a future goal that would require installing and configuring a dedicated E2E framework.
