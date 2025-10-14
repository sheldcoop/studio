
import { PageHeader } from '@/components/app/page-header';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { SideBySideComparison, ComparisonItem } from '@/components/app/side-by-side-comparison';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { PageSection } from '@/components/app/page-section';

export default function TwoViewsOfAVectorPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Two Views of a Vector"
        description="The single most important object in all of machine learning and quantitative finance."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          What’s the single most important object in all of machine learning and quantitative finance? It’s not a neural network or a fancy algorithm. It’s something much simpler: the vector. But what is a vector?
        </p>
        <p>
          If you ask a physicist, a programmer, and a data scientist, you might get three different answers. The key to mastering linear algebra is understanding that they're all talking about the same powerful idea from different perspectives. Let's break down the two most important views.
        </p>
      </article>

      <SideBySideComparison>
        <ComparisonItem title="View #1: The Physicist's View (The Arrow)">
          <p>To a physicist, a vector is an arrow floating in space. It's an object defined by two things and two things only:</p>
          <ul className="list-disc pl-6">
            <li><strong>Magnitude</strong> (its length)</li>
            <li><strong>Direction</strong> (where it's pointing)</li>
          </ul>
          <p>Think of concepts like velocity, force, or acceleration. A wind blowing at 15 mph to the northeast is a vector. It doesn't matter if you're measuring that wind in London or Tokyo; as long as the speed (length) and direction are the same, it's the same vector.</p>
        </ComparisonItem>
        <ComparisonItem title="View #2: The Data Scientist's View (The List of Numbers)">
          <p>To a data scientist or a programmer, a vector isn't an arrow; it's an <strong>ordered list of numbers</strong>. That's it. Seriously.</p>
          <ul className="list-disc pl-6 font-mono">
            <li><InlineMath math="[3, 2]" /> is a 2-dimensional vector.</li>
            <li><InlineMath math="[1800, 3, 25]" /> is a 3-dimensional vector.</li>
          </ul>
          <p>This house is a vector: <InlineMath math="[450000, 2100, 4, 15]" /></p>
        </ComparisonItem>
      </SideBySideComparison>

      <DefinitionCard title="The 'Aha!' Moment: Connecting the Views">
          <p>The entire foundation of applied linear algebra rests on one, beautiful idea: these two views are just different languages for the same concept.</p>
          <p>We can translate from the "list of numbers" to the "arrow" by creating a coordinate system. To represent the vector <InlineMath math="[3, 2]" />, we simply:</p>
          <ol className="list-decimal pl-6">
              <li>Start at the center (the origin).</li>
              <li>Move 3 units along the x-axis.</li>
              <li>Move 2 units along the y-axis.</li>
              <li>Draw an arrow from the origin to that point.</li>
          </ol>
          <p className="font-semibold text-center">This act of visualizing a list of numbers as a single point (or arrow) in space is the most important skill you will learn.</p>
      </DefinitionCard>

      <PageSection title="The Core Idea for Quants & ML">
        <p>Every single data point can be thought of as a vector in a high-dimensional space.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>A house described by 10 features is a single point in a 10-dimensional "house-space."</li>
          <li>A stock described by 50 indicators is a single point in a 50-dimensional "market-space."</li>
          <li>A user on a streaming service, described by their ratings for 500 movies, is a single point in a 500-dimensional "taste-space."</li>
        </ul>
        <p className="mt-4"><strong>Why is this so powerful?</strong> Because once your data points become vectors, you can start asking geometric questions.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>"Which houses are similar to this one?" becomes "Which vectors are close to this one in house-space?"</li>
            <li>"Which stocks are exhibiting the same behavior?" becomes "Which vectors are pointing in the same direction?"</li>
        </ul>
        <p className="mt-4">This translation is the key. We take our messy, real-world data (lists of numbers) and place it into a clean, geometric world (vector spaces) where we can use the powerful tools of linear algebra to find patterns.</p>
      </PageSection>

      <LessonSummaryCard title="Summary: Your Two Lenses">
        <li>
            <strong>The Physicist's View (Arrow):</strong> This is your lens for <strong>intuition</strong>. It helps you understand <em>why</em> an operation works.
        </li>
        <li>
             <strong>The Data Scientist's View (List):</strong> This is your lens for <strong>computation</strong>. It's what our code will actually be doing.
        </li>
        <li>
            Mastering the art of switching between these lenses is the first and most crucial step to thinking like a true quant.
        </li>
      </LessonSummaryCard>
    </div>
  );
}
