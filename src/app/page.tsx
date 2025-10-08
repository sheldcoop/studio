// This file is intentionally left blank. 
// The root layout and homepage are defined in the (app) route group.
import { redirect } from 'next/navigation';

export default function RootPage() {
    redirect('/');
}
