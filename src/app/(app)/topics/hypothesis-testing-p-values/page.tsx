
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X, ArrowRight, RefreshCw, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const parametricTests = [
    { name: 'T-Test', description: 'Compares the averages of two groups.', slug: 't-test' },
    { name: 'Z-Test', description: 'Compares a sample\'s average to a known population average when variance is known.', slug: 'z-test' },
    { name: 'ANOVA', description: 'Compares the averages of three or more groups.', slug: 'anova' },
    { name: 'Pearson Correlation', description: 'Measures the linear relationship between two continuous variables.', slug: 'pearson-correlation' },
    { name: 'F-Test', description: 'Compares the variances (spread) of two or more groups.', slug: 'f-test' },
];

const nonParametricTests = [
    { name: 'Mann-Whitney U Test', description: 'Alternative to the T-Test when data is not normally distributed.', slug: 'mann-whitney-u-test' },
    { name: 'Kruskal-Wallis Test', description: 'Alternative to ANOVA for comparing three or more groups.', slug: 'kruskal-wallis-test' },
    { name: 'Wilcoxon Signed-Rank Test', description: 'Alternative to the paired T-Test for repeated measurements.', slug: 'wilcoxon-signed-rank-test' },
    { name: 'Spearman\'s Rank Correlation', description: 'Measures the monotonic relationship between two ranked variables.', slug: 'spearmans-rank-correlation' },
    { name: 'Sign Test', description: 'A simple test for the direction of change between paired observations.', slug: 'sign-test' },
];

const quizQuestions = [
  {
    question: "You want to compare the average returns of two different trading algorithms on the same set of stocks. The returns data is normally distributed. Which test is most appropriate?",
    options: ["T-Test", "ANOVA", "Mann-Whitney U Test", "Chi-Squared Test"],
    answer: "T-Test",
    explanation: "A T-Test is used to compare the means of two groups. Since the data is normally distributed, the parametric T-Test is the best choice."
  },
  {
    question: "A researcher wants to see if there's a difference in the median risk scores (on a scale of 1-10) assigned by three different ratings agencies. The scores are not normally distributed. Which test should they use?",
    options: ["ANOVA", "Kruskal-Wallis Test", "F-Test", "T-Test"],
    answer: "Kruskal-Wallis Test",
    explanation: "The Kruskal-Wallis Test is the non-parametric alternative to ANOVA, used for comparing the medians of three or more independent groups when the data is not normally distributed."
  },
  {
    question: "You are analyzing the performance of a new portfolio management software. You have the portfolio values 'before' and 'after' implementation for 50 clients. You want to see if the software made a significant difference, but the change in values isn't normally distributed. Which test is suitable?",
    options: ["Paired T-Test", "Mann-Whitney U Test", "Wilcoxon Signed-Rank Test", "Sign Test"],
    answer: "Wilcoxon Signed-Rank Test",
    explanation: "The Wilcoxon Signed-Rank Test is used for paired data (like 'before' and 'after') when the assumption of normality for the difference is not met. It's the non-parametric alternative to the paired T-Test."
  },
  {
    question: "A company wants to determine if there is a linear relationship between the amount of money spent on advertising and its monthly sales revenue. Both variables are continuous and appear to be normally distributed. What should they use?",
    options: ["Spearman's Rank Correlation", "Pearson Correlation", "T-Test", "ANOVA"],
    answer: "Pearson Correlation",
    explanation: "Pearson Correlation is the correct choice to measure the strength and direction of a linear relationship between two continuous, normally distributed variables."
  }
];

export default function HypothesisTestingPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestionState();
    } else {
      setQuizFinished(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
    const correct = option === quizQuestions[currentQuestionIndex].answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) {
      setScore(score + 1);
    }
  };
  
  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    resetQuestionState();
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <>
      <PageHeader
        title="Hypothesis Testing & P-Values"
        description="Learn all about hypothesis testing and p-values"
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>The Core Idea: What is Hypothesis Testing?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Think of hypothesis testing as being a data detective. You start
              with a default assumption, the "Null Hypothesis" (H₀), which states
              there is no effect or no difference. Then, you gather evidence
              (your sample data) to see if you have enough proof to reject that
              default assumption in favor of an alternative one, the "Alternative
              Hypothesis" (H₁). The p-value is the strength of your evidence
              against the null hypothesis.
            </p>
          </CardContent>
        </Card>

        <section>
            <div className="text-center mb-8">
                <h2 className="font-headline text-3xl font-bold">The Two Paths: Parametric vs. Non-Parametric</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl">👨‍🍳 Parametric Tests</CardTitle>
                        <CardDescription>The Professional Chef: Assumes ingredients (data) meet certain standards (e.g., normal distribution). Precise and powerful when assumptions are met.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-3">
                            {parametricTests.map(test => (
                                <Link key={test.slug} href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-colors hover:bg-secondary">
                                    <h4 className="font-semibold">{test.name}</h4>
                                    <p className="text-sm text-muted-foreground">{test.description}</p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl">🏕️ Non-Parametric Tests</CardTitle>
                        <CardDescription>The Campfire Cook: Makes no strict assumptions about ingredients. More flexible and robust, especially with unusual or ranked data.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-3">
                            {nonParametricTests.map(test => (
                                 <Link key={test.slug} href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-colors hover:bg-secondary">
                                    <h4 className="font-semibold">{test.name}</h4>
                                    <p className="text-sm text-muted-foreground">{test.description}</p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Knowledge Check: Which Test Should You Use?</CardTitle>
          </CardHeader>
          <CardContent>
            {!quizFinished ? (
              <div className="space-y-6">
                <p className="text-lg font-semibold">{currentQuestion.question}</p>
                <RadioGroup value={selectedOption ?? undefined} onValueChange={handleOptionSelect} disabled={showExplanation}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className={cn(
                        "flex items-center space-x-3 rounded-md border p-4 transition-colors",
                        showExplanation && option === currentQuestion.answer && "border-green-500 bg-green-500/10",
                        showExplanation && selectedOption === option && option !== currentQuestion.answer && "border-red-500 bg-red-500/10"
                    )}>
                      <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                      <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
                      {showExplanation && option === currentQuestion.answer && <Check className="h-5 w-5 text-green-500" />}
                      {showExplanation && selectedOption === option && option !== currentQuestion.answer && <X className="h-5 w-5 text-red-500" />}
                    </div>
                  ))}
                </RadioGroup>
                {showExplanation && (
                    <div className="rounded-md border-l-4 bg-secondary p-4"
                        style={{ borderLeftColor: isCorrect ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}}>
                        <p className="font-semibold">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
                        <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                )}
              </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                    <p className="text-muted-foreground mt-2">You scored {score} out of {quizQuestions.length}.</p>
                    <div className="mt-6">
                        <Button onClick={resetQuiz}>
                            <RefreshCw className="mr-2"/>
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
          </CardContent>
          {!quizFinished && (
              <CardFooter className="flex justify-end border-t pt-4">
                <Button onClick={handleNextQuestion} disabled={!showExplanation}>
                  {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                  <ArrowRight className="ml-2"/>
                </Button>
              </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
}

    