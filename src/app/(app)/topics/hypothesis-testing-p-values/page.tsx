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
import { Check, X, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const parametricTests = [
    { name: 'ANOVA', description: 'Compares the averages of three or more groups.', slug: 'anova' },
    { name: 'Pearson Correlation', description: 'Measures the linear relationship between two continuous variables.', slug: 'pearson-correlation' },
    { name: 'F-Test', description: 'Compares the variances (spread) of two or more groups.', slug: 'f-test' },
    { name: 'T-Test', description: 'Compares the means of two groups, assuming normal distribution.', slug: 't-test'},
    { name: 'Z-Test', description: 'Compares means of large samples (n>30) with known population variance.', slug: 'z-test'}
];

const nonParametricTests = [
    { name: 'Mann-Whitney U Test', description: 'Alternative to the T-Test when data is not normally distributed.', slug: 'mann-whitney-u-test' },
    { name: 'Kruskal-Wallis Test', description: 'Alternative to ANOVA for comparing three or more groups.', slug: 'kruskal-wallis-test' },
    { name: 'Wilcoxon Signed-Rank Test', description: 'Alternative to the paired T-Test for repeated measurements.', slug: 'wilcoxon-signed-rank-test' },
    { name: 'Spearman\'s Rank Correlation', description: 'Measures the monotonic relationship between two ranked variables.', slug: 'spearmans-rank-correlation' },
    { name: 'Friedman Test', description: 'The non-parametric alternative to a repeated-measures ANOVA. Used to compare three or more related/paired groups.', slug: 'friedman-test' },
    { name: 'Kolmogorov-Smirnov (K-S) Test', description: 'Tests if a sample is drawn from a specific distribution (e.g., "Is my data normally distributed?").', slug: 'kolmogorov-smirnov-k-s-test' },
    { name: 'Chi-Squared Test', description: 'Tests if there is a significant association between two categorical variables.', slug: 'chi-squared-test' },
];

const quizQuestions = [
  {
    question: "You want to compare the average returns of two different trading algorithms on the same set of stocks. The returns data is normally distributed. Which test is most appropriate?",
    options: ["T-Test", "ANOVA", "Mann-Whitney U Test", "Chi-Squared Test"],
    answer: "T-Test",
    explanation: "A T-Test is used to compare the means of two groups. Since the data is normally distributed and you're comparing averages, the parametric T-Test is the best choice."
  },
  {
    question: "A researcher wants to see if there's a difference in the median risk scores (on a scale of 1-10) assigned by three different ratings agencies. The scores are not normally distributed. Which test should they use?",
    options: ["ANOVA", "Kruskal-Wallis Test", "F-Test", "T-Test"],
    answer: "Kruskal-Wallis Test",
    explanation: "The Kruskal-Wallis Test is the non-parametric alternative to ANOVA. It's used for comparing the medians of three or more independent groups when the data doesn't meet the assumption of normality."
  },
  {
    question: "An analyst wants to check if there is an association between two categorical variables: 'investment risk tolerance' (low, medium, high) and 'preferred asset class' (stocks, bonds, real estate). Which test is suitable?",
    options: ["Paired T-Test", "Mann-Whitney U Test", "ANOVA", "Chi-Squared Test"],
    answer: "Chi-Squared Test",
    explanation: "The Chi-Squared Test is used to determine if there is a significant association between two categorical variables. It's the perfect tool for this scenario."
  },
  {
    question: "A company wants to determine if there is a linear relationship between the amount of money spent on advertising and its monthly sales revenue. Both variables are continuous and appear to be normally distributed. What should they use?",
    options: ["Spearman's Rank Correlation", "Pearson Correlation", "T-Test", "ANOVA"],
    answer: "Pearson Correlation",
    explanation: "Pearson Correlation is the correct choice to measure the strength and direction of a linear relationship between two continuous, normally distributed variables.",
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
        description="The detective work of data science: making decisions under uncertainty."
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea: What is Hypothesis Testing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Think of hypothesis testing as being a data detective. You start with a default assumption, the <strong>Null Hypothesis (H₀)</strong>, which states there is no effect or no difference (e.g., "a new drug has no effect"). Then, you gather evidence (your sample data) to see if you have enough proof to reject that default assumption in favor of an alternative, the <strong>Alternative Hypothesis (H₁)</strong> (e.g., "the new drug has an effect").
            </p>
            <p>
                The <strong>p-value</strong> is the crucial piece of evidence. It's the probability of observing your data (or something even more extreme) if the null hypothesis were actually true. A small p-value (typically < 0.05) suggests that your observed data is very unlikely under the null hypothesis, giving you a reason to reject it.
            </p>
          </CardContent>
        </Card>

        <section>
            <div className="text-center mb-8">
                <h2 className="font-headline text-3xl font-bold">The Two Paths: Parametric vs. Non-Parametric</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">The type of data you have determines the statistical test you can use. The main fork in the road is between parametric and non-parametric tests.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">👨‍🍳 Parametric Tests</CardTitle>
                        <CardDescription>The Professional Chef: Assumes ingredients (data) meet certain standards (e.g., normal distribution). Precise and powerful when assumptions are met.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {parametricTests.map(test => (
                                <li key={test.slug}>
                                    <Link href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.name}</h4>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">🏕️ Non-Parametric Tests</CardTitle>
                        <CardDescription>The Campfire Cook: Makes no strict assumptions about ingredients. More flexible and robust, especially with unusual, ranked, or non-normal data.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {nonParametricTests.map(test => (
                                 <li key={test.slug}>
                                    <Link href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.name}</h4>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                    </Link>
                                 </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Knowledge Check: Which Test Should You Use?</CardTitle>
            <CardDescription>Test your understanding of when to use each type of test.</CardDescription>
          </CardHeader>
          <CardContent>
            {!quizFinished ? (
              <div className="space-y-6">
                <p className="text-lg font-semibold">{`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}</p>
                <RadioGroup value={selectedOption ?? undefined} onValueChange={handleOptionSelect} disabled={showExplanation}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className={cn(
                        "flex items-center space-x-3 rounded-md border p-4 transition-all duration-300",
                        showExplanation && option === currentQuestion.answer && "border-green-500 bg-green-500/10 ring-2 ring-green-500",
                        showExplanation && selectedOption === option && option !== currentQuestion.answer && "border-red-500 bg-red-500/10 ring-2 ring-red-500"
                    )}>
                      <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                      <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer text-base">{option}</Label>
                      {showExplanation && option === currentQuestion.answer && <Check className="h-6 w-6 text-green-500" />}
                      {showExplanation && selectedOption === option && option !== currentQuestion.answer && <X className="h-6 w-6 text-red-500" />}
                    </div>
                  ))}
                </RadioGroup>
                {showExplanation && (
                    <div className={cn("rounded-md border-l-4 p-4",
                        isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
                        <p className="font-semibold text-lg">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
                        <p className="text-sm text-foreground/80 mt-1">{currentQuestion.explanation}</p>
                    </div>
                )}
              </div>
            ) : (
                <div className="text-center p-8">
                    <h3 className="font-headline text-3xl font-bold">Quiz Complete!</h3>
                    <p className="text-muted-foreground mt-2 text-lg">You scored {score} out of {quizQuestions.length}.</p>
                    <div className="mt-6">
                        <Button onClick={resetQuiz} size="lg">
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
