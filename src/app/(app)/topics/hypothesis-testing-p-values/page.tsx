import { PageHeader } from '@/components/app/page-header';

const pageData = {
  title: 'Hypothesis Testing & P-Values',
  subtitle: 'An introduction to the core concepts.',
  intro: {
    title: 'The Core Idea: What is Hypothesis Testing?',
    content:
      "Think of hypothesis testing as being a data detective. You start with a default assumption, the 'Null Hypothesis' ('innocent until proven guilty'). Your job is to gather enough evidence to see if you can overturn that default in favor of your new theory, the 'Alternative Hypothesis'.",
  },
};

export default function HypothesisTestingIntroPage() {
  return (
    <div>
      <PageHeader
        title={pageData.title}
        description={pageData.subtitle}
      />
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-4 font-headline text-2xl">{pageData.intro.title}</h2>
        <p className="text-lg text-muted-foreground">
          {pageData.intro.content}
        </p>
      </section>
    </div>
  );
}
