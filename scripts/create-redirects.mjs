import fs from 'fs';
import path from 'path';

// This is a dynamic import. Because the curriculum files are TypeScript,
// we can't import them directly at the top level of an .mjs file without a loader.
// By placing the import inside an async function, we ensure it's evaluated
// at runtime, where Next.js's environment can handle it.
async function getTopics() {
  const { allTopics } = await import('../src/lib/curriculum/index.ts');
  return allTopics;
}

export async function createRedirects() {
    const allTopics = await getTopics();
    const redirects = [];

    for (const topic of allTopics) {
        if (topic.previousSlugs) {
            for (const oldSlug of topic.previousSlugs) {
                // All old slugs are assumed to be under the /topics/ route for simplicity
                redirects.push({
                    source: `/topics/${oldSlug}`,
                    destination: topic.href,
                    permanent: true, // 301 Redirect for SEO
                });
            }
        }
    }

    // Ensure the 'public' directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }
    
    // Write the redirects to a JSON file in the public directory
    const redirectsPath = path.join(publicDir, 'redirects.json');
    fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));

    console.log(`Generated ${redirects.length} redirects in public/redirects.json`);
}

// This allows the script to be run directly from the command line,
// e.g., via `node scripts/create-redirects.mjs` in package.json
if (process.argv[1] === new URL(import.meta.url).pathname) {
    createRedirects();
}
