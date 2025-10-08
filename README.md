che# QuantPrep - A Next.js Learning Platform

QuantPrep is an AI-powered learning platform designed to help quantitative finance aspirants master core concepts, from statistical analysis to algorithmic trading.

## Getting Star
This project uses `npm` as the package manager.

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation & Local Development

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
    
3.  Install the dependencies:
    ```bash
    npm install
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Available Scripts

- `npm run dev`: Starts the Next.js development server with hot-reloading.
- `npm run build`: Creates an optimized production build of the application.
- `npm run start`: Starts the application in production mode (requires `npm run build` to be run first).
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run test`: Runs the test suite using Jest.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Project Structure

-   `src/app`: Contains the pages and layouts for the Next.js App Router.
-   `src/components`: Shared React components used throughout the application.
    - `src/components/app`: Application-specific components (e.g., `PageHeader`).
    - `src/components/ui`: Generic, reusable UI components (from ShadCN).
-   `src/lib`: Utility functions, data sources, and other shared logic.
-   `src/ai`: Contains Genkit AI flow definitions (currently disabled).
-   `public`: Static assets like images and fonts.
-   `docs`: Contains high-level project documentation.