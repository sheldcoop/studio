import { PageHeader } from '@/components/app/page-header';

const pageData = {
  title: 'Hypothesis Testing & P-Values',
  subtitle: 'An introduction to the core concepts.',
};

export default function HypothesisTestingIntroPage() {
  return (
    <div>
      <PageHeader
        title={pageData.title}
        description={pageData.subtitle}
      />
      <section className="mx-auto max-w-4xl">
        <p>hello world</p>
      </section>
    </div>
  );
}
