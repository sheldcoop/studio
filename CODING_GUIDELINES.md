# QuantPrep Coding Guidelines & Key Learnings

This document summarizes the key best practices and learnings established during the initial development and refinement of the QuantPrep application. It serves as a checklist and a reminder to ensure all future code adheres to these standards.

## 1. Embrace the DRY (Don't Repeat Yourself) Principle
- **Action:** Eliminate code redundancy. Before writing new code, check for existing utilities or components that can be reused.
- **Example:** Use shared components like `ChartContainer` for consistent styling and functionality. Centralize configurations (e.g., theme colors, chart configs) instead of defining them locally in each component.

## 2. Prioritize Robust Error Handling
- **Action:** Anticipate and handle invalid user input and edge cases gracefully. Provide clear, actionable feedback to the user.
- **Example:** In the Confidence Interval calculator, we explicitly check for invalid inputs (e.g., sample size <= 0) and display a specific error message rather than failing silently.

## 3. Implement a Robust Testing Strategy
- **Action:** Follow the testing pyramid. Add unit tests for individual components/functions and integration tests for user workflows.
- **Example:** We created unit tests for `Logo` and `PageHeader` to verify rendering and prop handling. We also added an integration test for the `ConfidenceIntervalsPage` to simulate user input and verify the entire component works as a whole.

## 4. Performance is a Core Feature
- **Action:** Proactively optimize for performance. Pay close attention to bundle size and rendering strategies.
- **Example:** We optimized image delivery by requesting appropriately sized images from the CDN. We also used `next/dynamic` to code-split the large `recharts` library, ensuring it's only loaded on pages that actually use it.

## 5. Security is a Proactive Effort
- **Action:** Adhere to security best practices to prevent common vulnerabilities.
- **Example:** We ensure all dynamic content rendered in React is automatically escaped to prevent XSS. We also proactively added `rel="noopener noreferrer"` to external links to mitigate "tabnabbing" vulnerabilities.

## 6. Maintainability Requires Deliberate Documentation
- **Action:** Document code for others (and your future self). This includes a comprehensive `README.md`, high-level architectural documents, and inline comments for complex or non-obvious logic.
- **Example:** We created a useful `README.md`, an `ARCHITECTURE.md` file, and added JSDoc comments to complex data generation functions to explain the "why" behind the code.

## 7. Architectural Patterns Drive Clean Code
- **Action:** Use established design patterns to create a clean, decoupled, and scalable architecture.
- **Example:** We used the **Provider Pattern** (via React Context) for theming (`ChartContainer`) and global state (`useToast`) to avoid "prop drilling" and create a single source of truth.

## 8. Maintain Backward Compatibility
- **Action:** When adding features, do so in a non-disruptive, backward-compatible way. Use optional props with default values.
- **Example:** When adding alignment options to `PageHeader`, we used an optional `variant` prop with a default value, ensuring no existing implementations would break.

## 9. Justify and Understand Trade-offs
- **Action:** Make conscious, strategic decisions and be able to articulate the reasoning behind them.
- **Example:** We chose to use static, mocked data in `src/lib/data.ts` to prioritize rapid UI development and prototyping, with the understanding that this was a trade-off against full dynamic functionality, which can be implemented later.

## 10. Follow a Systematic Debugging Workflow
- **Action:** Use a methodical process to trace issues, starting with browser DevTools for client-side inspection and moving to the VS Code debugger with breakpoints for server-side or complex logic.