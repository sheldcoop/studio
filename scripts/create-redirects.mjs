// scripts/create-redirects.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since we are running this script directly with Node.js, we need to simulate the environment
// to import our TypeScript curriculum files. We'll use ts-node for this.
// Note: This approach is for the script environment only.
const tsNode = await import('ts-node');
tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'NodeNext',
  }
});

const { allTopics } = await import('../src/lib/curriculum/index.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const redirectsPath = path.join(publicDir, 'redirects.json');

function generateRedirects() {
  const redirects = [];

  for (const topic of allTopics) {
    if (topic.previousSlugs && topic.previousSlugs.length > 0) {
      for (const oldSlug of topic.previousSlugs) {
        // Assuming all old slugs were also under the /topics/ path for simplicity
        const sourcePath = `/topics/${oldSlug}`;
        
        redirects.push({
          source: sourcePath,
          destination: topic.href,
          permanent: true,
        });

        // Also add a redirect for the version with a trailing slash
        redirects.push({
            source: `${sourcePath}/`,
            destination: topic.href,
            permanent: true,
        });
      }
    }
  }

  // Ensure the public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write the JSON file
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));
  console.log(`✅ Successfully generated ${redirects.length} redirects to ${redirectsPath}`);
}

try {
  generateRedirects();
} catch (error) {
  console.error("❌ Error generating redirects:", error);
  process.exit(1);
}
