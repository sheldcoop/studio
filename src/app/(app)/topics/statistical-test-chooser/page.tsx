
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronsRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type DecisionNode = {
  question?: string;
  options?: { [key: string]: DecisionNode };
  result?: string;
  isLink?: boolean;
  note?: string;
};

const decisionTree: DecisionNode = {
  question: 'What is your primary goal?',
  options: {
    'COMPARE the average or median of one or more groups.': {
      question: 'How many groups are you comparing?',
      options: {
        'One Group (comparing it to a known standard or theoretical value)': {
          question: 'Is your data normally distributed?',
          options: {
            'Yes': { result: 'One-Sample t-test' },
            'No / Unsure': { result: 'Wilcoxon Signed-Rank Test' },
          },
        },
        'Two Groups': {
          question: 'Are the two groups related or independent?',
          options: {
            'Independent (e.g., a control group vs. an experimental group)': {
              question: 'Is your data normally distributed?',
              options: {
                'Yes': { result: 'Independent Two-Sample t-test' },
                'No / Unsure': { result: 'Mann-Whitney U Test' },
              },
            },
            'Paired / Related (e.g., the same subjects tested before and after a treatment)':
              {
                question: 'Are the differences between pairs normally distributed?',
                options: {
                  'Yes': { result: 'Paired t-test' },
                  'No / Unsure': { result: 'Wilcoxon Signed-Rank Test' },
                },
              },
          },
        },
        'Three or More Groups': {
          question: 'Are the groups related or independent?',
          options: {
            'Independent (e.g., comparing test scores of 3 different schools)': {
              question: 'Is your data normally distributed?',
              options: {
                'Yes': { result: 'One-Way ANOVA (Analysis of Variance)' },
                'No / Unsure': { result: 'Kruskal-Wallis Test' },
              },
            },
            'Paired / Related (e.g., testing the same subjects at 3 different times)':
              {
                question: 'Is your data normally distributed?',
                options: {
                  'Yes': { result: 'Repeated Measures ANOVA' },
                  'No / Unsure': { result: 'Friedman Test' },
                },
              },
          },
        },
      },
    },
    'Explore the RELATIONSHIP or ASSOCIATION between variables.': {
      question: 'What type of variables are you analyzing?',
      options: {
        'Two Numerical Variables (e.g., height and weight)': {
          question:
            'Is the relationship linear and are the variables normally distributed?',
          options: {
            'Yes': { result: 'Pearson Correlation' },
            'No / Unsure': { result: "Spearman's Rank Correlation" },
          },
        },
        'Two Categorical Variables (e.g., city and preferred brand)': {
          result: 'Chi-Squared Test of Independence',
          isLink: true,
        },
        'One Numerical and One Categorical Variable (e.g., weight and gender)':
          {
            result:
              'This path converges with the "COMPARE" branch. For two categories, use a t-test. For three or more, use ANOVA.',
            note: 'This is mathematically the same as comparing the averages of groups.',
          },
      },
    },
    'PREDICT an outcome based on one or more input variables.': {
      question: 'What type of variable are you trying to predict?',
      options: {
        'A Numerical Variable (e.g., predicting a house price)': {
          result: 'Linear Regression',
          note: 'Use Simple Linear Regression for one input variable, and Multiple Linear Regression for more than one.',
        },
        'A Categorical Variable with two outcomes (e.g., predicting Yes/No, Churn/No Churn)':
          {
            result: 'Logistic Regression',
          },
      },
    },
  },
};

// Helper to convert title to a URL-friendly slug
const toSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
};

export default function StatisticalTestChooserPage() {
  const [path, setPath] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<DecisionNode>(decisionTree);

  const handleSelect = (option: string) => {
    const nextNode = currentNode.options?.[option];
    if (nextNode) {
      setPath([...path, option]);
      setCurrentNode(nextNode);
    }
  };

  const handleReset = () => {
    setPath([]);
    setCurrentNode(decisionTree);
  };
  
  const handleBreadcrumbClick = (index: number) => {
    let node = decisionTree;
    for(let i = 0; i <= index; i++) {
        node = node.options![path[i]]
    }
    setCurrentNode(node);
    setPath(path.slice(0, index + 1));
  }

  return (
    <>
      <PageHeader
        title="Statistical Test Mind Map"
        description="Answer the questions to find the right statistical test for your needs."
      />
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-6 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <button onClick={handleReset} className="hover:text-primary font-medium">Start</button>
          {path.map((p, i) => (
            <React.Fragment key={i}>
                <ChevronsRight className="h-4 w-4" />
                <button onClick={() => handleBreadcrumbClick(i)} className="text-left hover:text-primary font-medium transition-colors">
                    {p.split('(')[0].trim()}
                </button>
            </React.Fragment>
          ))}
        </div>
        <Card className="min-h-[300px]">
          <CardHeader>
            {currentNode.question && (
              <CardTitle className="font-headline text-2xl">
                {currentNode.question}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {currentNode.options && (
              <div className="space-y-3">
                {Object.keys(currentNode.options).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full p-4 rounded-lg border text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-lg"
                  >
                    <p className="font-semibold text-base">{option}</p>
                  </button>
                ))}
              </div>
            )}
            {currentNode.result && (
              <div className="text-center flex flex-col items-center justify-center p-8">
                <p className="text-muted-foreground">The recommended test is:</p>
                <h3 className="font-headline text-4xl font-bold text-primary my-2">
                  {currentNode.isLink ? (
                     <Link href={`/topics/${toSlug(currentNode.result)}`} className="hover:underline">
                        {currentNode.result}
                     </Link>
                  ) : currentNode.result }
                </h3>
                {currentNode.note && (
                    <p className="text-sm text-muted-foreground max-w-md mt-2">{currentNode.note}</p>
                )}
                <Button onClick={handleReset} className="mt-8">
                    <RefreshCw className="mr-2"/>
                    Start Over
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
