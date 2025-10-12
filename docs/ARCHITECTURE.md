# QuantPrep Application Architecture

This document provides a comprehensive overview of the technologies and architectural patterns used to build the QuantPrep application. Understanding these choices is key to contributing effectively to the project.

---

## 1. Core Technology Stack

Our stack is centered around **Next.js** and **TypeScript**, a combination chosen for its performance, developer experience, and robust features for building modern web applications.

### a. Framework: Next.js 15 (with App Router)

- **What it is:** Next.js is a production-grade **React framework**. We specifically use **version 15** and its modern **App Router**.
- **Why we use it:**
    - **Server Components (The "Secret Sauce"):** The App Router allows us to use **React Server Components** by default. This is a revolutionary feature. It means most of our components run exclusively on the server, fetching data and rendering static content without sending any JavaScript to the user's browser. The result is a much lighter, faster experience. Only components that require user interactivity (like a button with an `onClick` handler) are marked with `'use client';` and sent to the browser. This approach gives us:
        - **Drastically Faster Load Times:** The user's browser has much less to download, parse, and execute.
        - **Better SEO:** Search engine bots can easily read the fully-formed HTML content, leading to better indexing and ranking.
    - **Simplified Routing:** The file system itself defines the website's URL structure. For example, the folder `src/app/(app)/paths/` directly maps to the URL `/paths`. Topic pages are organized under multiple routes like `/topics/[slug]`, `/statistics/[slug]`, and `/linear-algebra-for-quantitative-finance/[slug]` to create a logical content hierarchy.
    - **Dynamic Routing with Async Params (Next.js 15):** A key change in Next.js 15 is that props for dynamic pages (like `params`) are now **asynchronous**. This means page components must be `async` functions that `await` the props.
      ```typescript
      // Example for src/app/(app)/paths/[slug]/page.tsx
      type PathPageProps = { params: Promise<{ slug: string }> };

      export default async function PathPage({ params }: PathPageProps) {
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

## 3. Core Architectural Decisions & Future Considerations

- **Configuration File Location:** The `next.config.ts` file **must** be located in the project root directory. Placing a duplicate configuration file inside `src/` will cause build failures that are difficult to debug.
- **Server-First Approach:** We default to using Server Components for everything unless interactivity is explicitly needed. This is a core principle for maximizing performance. Any component with hooks (`useState`, `useEffect`) must be in a file marked with `'use client';`. The ideal architecture is to push these client "islands" as deep into the component tree as possible.
- **Performance Optimization:** For client components that rely on large third-party libraries (e.g., `recharts` for charting), we use **`next/dynamic`** to lazy-load them. This prevents the large library code from being included in the initial page bundle, significantly speeding up the initial load time. A skeleton loader is shown while the heavy component is loaded in the background.
- **Data-Driven Content:** The curriculum, learning paths, and topic definitions are stored in structured data files (`src/lib/curriculum/`, `src/lib/learning-paths.ts`). The pages read from this data and generate routes dynamically, meaning we can add or change a topic by simply updating a data file, not by creating a new page.
- **Reusable "Cookie-Cutter" Components:** Instead of repeatedly building the same UI with primitive `<div>` and `<Card>` elements, we create dedicated, reusable components (e.g., `<LessonItem />`, `<LearningPathCard />`). This follows the **DRY (Don't Repeat Yourself)** principle, making the codebase cleaner, more consistent, and much easier to maintain.
- **(Future) Decouple Content with a Headless CMS:** Currently, our content lives in TypeScript files. For long-term scalability, we should consider moving this content into a headless CMS. This would allow non-developers to manage and publish content without requiring a code deployment, dramatically speeding up our content production pipeline.

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
