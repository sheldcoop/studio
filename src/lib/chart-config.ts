
// IMPORTANT: This function is not a hook, so it does not need 'use client'.
// It's a server-side utility to generate configuration.
import { theme } from '@/lib/theme';

/**
 * Provides a centralized, theme-aware configuration for Chart.js instances.
 * This ensures all charts in the application have a consistent and professional look and feel.
 *
 * NOTE: This implementation assumes a 'light' theme context for chart rendering.
 * A more advanced implementation might accept a theme ('light' | 'dark') parameter
 * to dynamically switch between color palettes.
 *
 * @returns A Chart.js options object with theme-aware styling.
 */
export const getChartJsConfig = () => {
  const colors = theme.colors.light;

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: `hsl(${colors.mutedForeground})` },
        grid: { color: `hsl(${colors.border})` },
        title: {
          display: true,
          color: `hsl(${colors.mutedForeground})`,
        },
      },
      x: {
        ticks: { color: `hsl(${colors.mutedForeground})` },
        grid: { color: `hsl(${colors.border})` },
        title: {
          display: true,
          color: `hsl(${colors.mutedForeground})`,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: `hsl(${colors.foreground})`,
        },
      },
      title: {
        display: true,
        color: `hsl(${colors.foreground})`,
        font: { size: 16 },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };
};

export const chartColors = {
  primary: `hsl(${theme.colors.light.primary})`,
  primaryForeground: `hsl(${theme.colors.light.primaryForeground})`,
  chart1: `hsl(${theme.colors.light.chart1})`,
  chart2: `hsl(${theme.colors.light.chart2})`,
  chart3: `hsl(${theme.colors.light.chart3})`,
  chart4: `hsl(${theme.colors.light.chart4})`,
  chart5: `hsl(${theme.colors.light.chart5})`,
  muted: `hsl(${theme.colors.light.muted})`,
  mutedForeground: `hsl(${theme.colors.light.mutedForeground})`,
  destructive: `hsl(${theme.colors.light.destructive})`,
  destructiveForeground: `hsl(${theme.colors.light.destructiveForeground})`,
};
