import { redirect } from 'next/navigation';

// This page has been moved to the /quantlab directory to be an interactive visualizer.
// This redirect ensures old links continue to work.
export default function DeprecatedEigenvaluesPage() {
    redirect('/quantlab/eigen-visualizer');
}
