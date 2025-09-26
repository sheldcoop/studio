
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const decisionMatrix = [
  {
    decision: 'Decision: GO LIVE with it',
    h0_true: {
      title: 'Type I Error (False Positive)',
      subtitle: '"Fooled by Randomness" 💸',
      isError: true,
    },
    h0_false: {
      title: 'Correct Decision (True Positive)',
      subtitle: '"You found Alpha!" 🏆',
      isError: false,
    },
  },
  {
    decision: 'Decision: DISCARD it',
    h0_true: {
      title: 'Correct Decision (True Negative)',
      subtitle: '"Dodged a Bullet" ✅',
      isError: false,
    },
    h0_false: {
      title: 'Type II Error (False Negative)',
      subtitle: '"Missed a Golden Goose" 😭',
      isError: true,
    },
  },
];

const dilemmaData = [
  {
    level: 'Low',
    rule: 'Go live if it looks even slightly good',
    type1: 'High',
    type2: 'Low',
  },
  {
    level: 'Medium',
    rule: 'Go live if the evidence is strong',
    type1: 'Medium',
    type2: 'Medium',
  },
  {
    level: 'High',
    rule: 'Go live only if the proof is undeniable',
    type1: 'Low',
    type2: 'High',
  },
];

export default function TypeErrorsPage() {
  return (
    <>
      <PageHeader
        title="The Trader's Dilemma: Type I vs. Type II Errors"
        description="Understanding the fundamental trade-off in quantitative research."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The "Alpha" Hunter Analogy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Imagine you're a quantitative trader who has just developed a new
              automated trading strategy. Your goal is to find "alpha"—a
              strategy that can consistently beat the market.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Null Hypothesis (H₀):</strong> Your strategy has no
                "alpha." It's a dud, and its past performance was just random
                luck.
              </li>
              <li>
                <strong>Alternative Hypothesis (H₁):</strong> Your strategy has
                real "alpha." It has a genuine predictive edge.
              </li>
            </ul>
            <p>
              Based on your back-test results, you have to decide whether to
              risk real money on it. This leads to four possible outcomes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Trading Decision Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Your Decision</TableHead>
                    <TableHead>Reality: Strategy is a Dud (H₀ is True)</TableHead>
                    <TableHead>Reality: Strategy has Alpha (H₀ is False)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisionMatrix.map((row) => (
                    <TableRow key={row.decision}>
                      <TableCell className="font-medium">
                        {row.decision}
                      </TableCell>
                      <TableCell
                        className={
                          row.h0_true.isError ? 'text-destructive' : ''
                        }
                      >
                        <p className="font-semibold">{row.h0_true.title}</p>
                        <p className="text-sm">{row.h0_true.subtitle}</p>
                      </TableCell>
                      <TableCell
                        className={
                          row.h0_false.isError ? 'text-yellow-500' : ''
                        }
                      >
                        <p className="font-semibold">{row.h0_false.title}</p>
                        <p className="text-sm">{row.h0_false.subtitle}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Trader's Dilemma
            </CardTitle>
            <CardDescription>
              This illustrates the fundamental trade-off. Lowering the risk of one error increases the risk of the other.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Skepticism Level</TableHead>
                        <TableHead>Decision Rule</TableHead>
                        <TableHead>Likelihood of Type I Error (💸)</TableHead>
                        <TableHead>Likelihood of Type II Error (😭)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dilemmaData.map((row) => (
                        <TableRow key={row.level}>
                            <TableCell className="font-semibold">{row.level}</TableCell>
                            <TableCell className="italic text-muted-foreground">"{row.rule}"</TableCell>
                            <TableCell className="font-medium text-destructive">{row.type1}</TableCell>
                            <TableCell className="font-medium text-yellow-500">{row.type2}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
