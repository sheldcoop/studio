
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Script from 'next/script';

export default function MLEPage() {
  return (
    <>
      <PageHeader
        title="Maximum Likelihood Estimation (MLE)"
        description="A foundational method for finding the best model parameters to fit your data."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Script
          id="mathjax-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
              },
              svg: {
                fontCache: 'global'
              }
            };
          `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
          strategy="afterInteractive"
          id="mathjax-script"
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              The Core Idea: What's the Most Likely Story?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Imagine you have a coin, but you don't know if it's fair. You flip it 10 times and get 7 heads. Maximum Likelihood Estimation (MLE) answers the question: "What is the probability of getting heads ($p$) that makes the outcome I observed (7 heads in 10 flips) the most likely?"
            </p>
            <p>
              MLE is a powerful and intuitive method for fitting a statistical model to data. It works by finding the model parameters that **maximize the likelihood function**. The likelihood function is simply the probability of observing your actual data, given a specific set of model parameters. We tweak the parameters until we find the set that makes our observed data look as "likely" as possible.
            </p>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="font-headline">How It Works: An Example with a Normal Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
                <p>Let's say we have a set of data points (e.g., daily stock returns) and we believe they come from a normal distribution. A normal distribution is defined by two parameters: the mean ($\mu$) and the standard deviation ($\sigma$). Our goal is to find the values of $\mu$ and $\sigma$ that best fit our data.</p>
                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Step 1: Write Down the Likelihood Function</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            For a normal distribution, the probability of observing a single data point $x_i$ is given by its Probability Density Function (PDF):
                            $$P(x_i | \mu, \sigma) = \frac{1}{\sigma\sqrt{2\pi}} e^{ - \frac{(x_i - \mu)^2}{2\sigma^2} }$$
                            Assuming our data points are independent, the likelihood of observing our entire dataset $X = \{x_1, x_2, ..., x_n\}$ is the product of the individual probabilities:
                            $$L(\mu, \sigma | X) = \prod_{i=1}^{n} P(x_i | \mu, \sigma)$$
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Step 2: Use the Log-Likelihood</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            Multiplying many small probabilities is numerically unstable and mathematically difficult. Taking the logarithm turns the product into a sum, which is much easier to work with. Maximizing the log-likelihood is the same as maximizing the likelihood.
                            $$\ln L(\mu, \sigma | X) = \sum_{i=1}^{n} \ln\left( P(x_i | \mu, \sigma) \right)$$
                            Which for a normal distribution becomes:
                            $$\ln L = -\frac{n}{2}\ln(2\pi) - \frac{n}{2}\ln(\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^{n}(x_i - \mu)^2$$
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger>Step 3: Maximize the Log-Likelihood</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            To find the maximum, we use calculus. We take the partial derivatives of the log-likelihood function with respect to our parameters ($\mu$ and $\sigma$), set them to zero, and solve.
                            $$\frac{\partial \ln L}{\partial \mu} = 0 \quad \text{and} \quad \frac{\partial \ln L}{\partial \sigma} = 0$$
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Step 4: The Result</AccordionTrigger>
                        <AccordionContent className="pt-4">
                            After solving the equations, we get a beautifully intuitive result. The maximum likelihood estimates for a normal distribution are:
                            <ul>
                                <li className="py-2"><strong>MLE for $\mu$:</strong> $\hat{\mu}_{MLE} = \frac{1}{n}\sum_{i=1}^{n}x_i = \bar{x}$ (The sample mean)</li>
                                <li className="py-2"><strong>MLE for $\sigma^2$:</strong> $\hat{\sigma}^2_{MLE} = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$ (The sample variance, using n)</li>
                            </ul>
                           <p className="mt-2 text-sm text-muted-foreground">This proves that the sample mean and variance are the "most likely" parameters for a normal distribution that could have generated your data. MLE provides a powerful theoretical justification for using these common estimators.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
