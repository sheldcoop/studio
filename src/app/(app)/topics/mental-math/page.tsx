
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { MentalMathQuiz } from '@/components/app/mental-math-quiz';

export const metadata: Metadata = {
    title: 'Mental Math Trainer',
    description: 'Sharpen your calculation speed and accuracy for quantitative finance interviews with our mental math trainer.',
};

export default function MentalMathPage() {
    return (
        <>
            <PageHeader
                title="Mental Math Trainer"
                description="Speed and accuracy are critical. Sharpen your skills for interview day."
                variant="aligned-left"
            />
            <div className="flex justify-center">
                <MentalMathQuiz />
            </div>
        </>
    );
}
