// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock lucide-react library
jest.mock('lucide-react', () => {
  // Return a proxy to mock any icon component from the library
  return new Proxy({}, {
    get: function (target, prop) {
      // Create a mock React component that renders a div with a test-id
      // This will stand in for any icon, preventing ESM import errors.
      return (props) => <div data-testid={`icon-${String(prop)}`} {...props} />;
    },
  });
});