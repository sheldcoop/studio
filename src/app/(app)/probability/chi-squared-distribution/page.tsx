import { redirect } from 'next/navigation';

// This page has been moved to the /quantlab directory.
// This redirect ensures old links continue to work.
export default function DeprecatedChiSquaredPage() {
    redirect('/quantlab/chi-squared-distribution');
}
