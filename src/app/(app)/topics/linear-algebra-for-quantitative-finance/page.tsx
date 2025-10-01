
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import 'katex/dist/katex.min.css';
import { CheckCircle, Network, TrendingUp, Cpu } from 'lucide-react';
import { allTopics } from '@/lib/data';
import Link from 'next/link';

const applications = [
    {
        icon: TrendingUp,
        title: "Mean-Variance Portfolio Optimization",
        description: "Use covariance matrices and solve systems of linear equations to find the optimal asset allocation that maximizes return for a given level of risk (the Efficient Frontier).",
        concept: "Covariance & Systems of Equations"
    },
    {
        icon: Cpu,
        title: "Principal Component Analysis (PCA)",
        description: "Use eigendecomposition on a covariance matrix to reduce the dimensionality of your data, uncovering the hidden factors that drive asset returns.",
        concept: "Eigenvalues & Eigenvectors"
    },
    {
        icon: Network,
        title: "Factor Modeling (e.g., CAPM)",
        description: "Model asset returns as a linear combination of underlying market factors (e.g., market risk, size, value), a direct application of linear regression.",
        concept: "Linear Regression"
    },
    {
        icon: CheckCircle,
        title: "Risk Management & Monte Carlo",
        description: "Use Cholesky Decomposition of a covariance matrix to generate correlated random variables, allowing you to accurately simulate portfolio performance.",
        concept: "Matrix Decompositions"
    }
]

const modules = [
  { id: 'la-module-1', title: "Module 1: The Building Blocks - Vectors & Matrices", description: "Mastering the fundamentals. Learn how to represent financial data as vectors and matrices and perform the essential operations that underpin all advanced models." },
  { id: 'la-module-2', title: "Module 2: The Engine Room - Solving Equations & Finding Structure", description: "Go beyond arithmetic. This module is about solving complex financial puzzles, from pricing derivatives to finding the hidden factors that drive market movements." },
  { id: 'la-module-3', title: "Module 3: The DNA of a Matrix - Eigen-Decomposition & SVD", description: "This is where the magic happens. Decomposing matrices reveals their intrinsic properties, allowing for powerful applications in dimensionality reduction and risk analysis." },
  { id: 'la-module-4', title: "Module 4: The Quant's Toolkit - Financial Applications", description: "Connect theory to practice. This module focuses on the direct implementation of linear algebra in solving real-world quantitative finance problems." },
];

export default function LinearAlgebraPage() {
  
  const getLessonsForModule = (moduleId: string) => {
    return allTopics.filter(t => t.parent === moduleId);
  }

  return (
    <>
      <PageHeader
        title="Linear Algebra for Quants"
        description="The language of data and the backbone of modern quantitative finance."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Why is Linear Algebra a Quant Superpower?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In quantitative finance, data is the new currency. We work with vast, high-dimensional datasets representing everything from minute-by-minute stock prices to complex derivative portfolios. Linear algebra is the mathematical framework that allows us to organize, manipulate, and, most importantly, extract predictive signals from this ocean of data.
            </p>
            <p>
              It's not just abstract theory; it's the engine that powers the most sophisticated models in finance. Mastering it is the difference between being a data janitor and a true quantitative strategist.
            </p>
          </CardContent>
        </Card>

        <section>
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">From Concept to Capital</h2>
                <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">See how core linear algebra concepts translate directly into powerful quantitative finance applications.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {applications.map(app => (
                    <Card key={app.title} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                                <app.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-lg">{app.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{app.concept}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>


        <Accordion type="single" collapsible className="w-full" defaultValue="la-module-1">
          {modules.map(module => {
            const lessons = getLessonsForModule(module.id);
            return (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="text-xl font-headline hover:no-underline">
                  {module.title}
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <p className="px-6 py-4 text-muted-foreground">{module.description}</p>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead className="w-1/4">Concept</TableHead>
                              <TableHead className="w-1/2">Why it Matters (The Quant Application)</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {lessons.map((lesson) => (
                              <TableRow key={lesson.id}>
                                  <TableCell className="font-medium">
                                    <Link href={lesson.href} className="text-primary hover:underline">{lesson.title}</Link>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{lesson.description}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
}
