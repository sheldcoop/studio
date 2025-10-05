
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { allTopics, Topic } from '@/lib/curriculum';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';

export const metadata: Metadata = {
  title: 'QuantLab',
  description: 'Explore interactive tools and visualizations for core quantitative finance concepts, from probability distributions to statistical analysis.',
};

// We group the topics by their parent module for better organization.
const getQuantLabModules = () => {
    const modules: { id: string, title: string, lessons: Topic[] }[] = [];
    const quantLabTopics = allTopics.filter(t => t.href.startsWith('/paths/quantlab/'));

    quantLabTopics.forEach(topic => {
        if (!topic.parent) return;

        let module = modules.find(m => m.id === topic.parent);
        if (!module) {
            // Find parent topic to get the title, or create a default one
            const parentTopic = allTopics.find(p => p.id === topic.parent);
            module = { 
                id: topic.parent, 
                title: parentTopic?.title || 'Tools', 
                lessons: [] 
            };
            modules.push(module);
        }
        module.lessons.push(topic);
    });
    
    // Sort modules by a predefined order if needed, otherwise they appear as found.
    const moduleOrder = ['prob-core-tools', 'prob-dist-discrete', 'prob-dist-continuous', 'stats-advanced'];
    modules.sort((a, b) => {
        const indexA = moduleOrder.indexOf(a.id);
        const indexB = moduleOrder.indexOf(b.id);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });


    return modules;
}


export default function QuantLabPage() {
  const quantLabModules = getQuantLabModules();

  return (
    <>
      <PageHeader
        title="QuantLab"
        description="Interactive tools for hands-on probability, statistics, and financial modeling."
        variant="aligned-left"
      />
      
      <div className="space-y-12">
        {quantLabModules.map(module => (
          <section key={module.id}>
            <h2 className="font-headline text-2xl font-bold mb-6 border-b pb-2">{module.title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {module.lessons.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full transform-gpu flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                    <CardHeader className="flex-row items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <TopicIcon iconName={tool.icon} className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-headline text-lg">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{tool.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
