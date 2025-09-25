// IMPORTANT: This function is not a hook, so it does not need 'use client'.
// It's a server-side utility to generate configuration.

/**
 * Provides a centralized, theme-aware configuration for Chart.js instances.
 * This ensures all charts in the application have a consistent and professional look and feel
 * that adapts to the current theme (light/dark).
 *
 * @returns A Chart.js options object with theme-aware styling.
 */
export const getChartJsConfig = () => {
  // We don't have access to resolved CSS variables in JS,
  // so we use the hsl-string format that Chart.js understands.
  const mutedForeground = 'hsl(var(--muted-foreground))';
  const foreground = 'hsl(var(--foreground))';
  const border = 'hsl(var(--border))';

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: mutedForeground },
        grid: { color: border },
        title: {
          display: true,
          color: mutedForeground,
        },
      },
      x: {
        ticks: { color: mutedForeground },
        grid: { color: border },
        title: {
          display: true,
          color: mutedForeground,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: foreground,
        },
      },
      title: {
        display: true,
        color: foreground,
        font: { size: 16 },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };
};
