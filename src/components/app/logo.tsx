import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 50"
      width="150"
      height="30"
      {...props}
    >
      <text
        x="10"
        y="35"
        fontFamily="'Poppins', sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        QuantFinance
        <tspan fill="hsl(var(--primary))"> Lab</tspan>
      </text>
    </svg>
  );
}
