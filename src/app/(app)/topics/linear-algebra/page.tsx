
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pi, Sigma, BrainCircuit, LineChart } from 'lucide-react';
import Link from 'next/link';

const subTopics = [
  {
    title: 'Vectors and Spaces',
    description:
      'The fundamental building blocks. Understand how vectors represent data points and how vector spaces define the canvas for our models.',
    icon: Pi,
    href: '/topics/vectors-and-spaces',
  },
  {
    title: 'Matrix Transformations',
    description:
      'Learn how matrices act as functions that can rotate, scale, and transform data, a core concept in portfolio adjustments and factor models.',
    icon: Sigma,
    href: '/topics/matrix-transformations',
  },
  {
    title: 'Eigenvalues and Eigenvectors',
    description:
      'Discover the "special" vectors that only change by a scalar factor. Crucial for understanding PCA and the underlying structure of data.',
    icon: LineChart,
    href: '/topics/eigenvalues-and-eigenvectors',
  },
  {
    title: 'Principal Component Analysis (PCA)',
    description:
      'A powerful dimensionality reduction technique that uses eigenvalues to find the most important patterns in high-dimensional data.',
    icon: BrainCircuit,
    href: '/topics/principal-component-analysis-pca',
  },
];

export default function LinearAlgebraPage() {
  return (
    <>
      <PageHeader
        title="Linear Algebra for Quants"
        description="The language of data and the backbone of modern quantitative finance."
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Why is Linear Algebra Essential?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In quantitative finance, we deal with massive amounts of data—stock prices, interest rates, portfolio returns, and more. Linear algebra provides the tools to organize, manipulate, and analyze this data efficiently. It allows us to represent complex systems of financial relationships in a compact and elegant way, from modeling portfolio risk to building machine learning algorithms for trading signals.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
            <h2 className="font-headline text-2xl font-bold">Core Concepts</h2>
            <p className="text-muted-foreground">Explore the pillars of linear algebra for finance.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {subTopics.map((topic) => (
            <Link key={topic.title} href={topic.href}>
              <Card className="flex h-full flex-col transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="flex-row items-center gap-4">
                  <topic.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-lg">
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{topic.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
