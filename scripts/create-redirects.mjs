
import fs from 'fs/promises';
import path from 'path';

// Dynamically import all curriculum modules.
// This is more robust than manually listing them.
async function getAllTopics() {
    const curriculumDir = path.resolve(process.cwd(), 'src/lib/curriculum');
    const files = await fs.readdir(curriculumDir);
    const topicModules = files.filter(file => file.endsWith('.ts') && !file.includes('types') && !file.includes('utils') && !file.includes('index'));

    let allTopics = [];
    for (const file of topicModules) {
        const modulePath = path.join(curriculumDir, file);
        // Use a cache-busting query param for reliable dynamic imports
        const module = await import(`file://${modulePath}?v=${Date.now()}`);
        const topics = Object.values(module).find(Array.isArray);
        if (topics) {
            allTopics.push(...topics);
        }
    }
    return allTopics;
}

async function main() {
    try {
        const allTopics = await getAllTopics();
        const redirects = [];

        for (const topic of allTopics) {
            if (topic.previousSlugs && topic.previousSlugs.length > 0) {
                for (const oldSlug of topic.previousSlugs) {
                    // This handles redirects for the main /topics route
                    redirects.push({
                        source: `/topics/${oldSlug}`,
                        destination: topic.href,
                        permanent: true,
                    });
                     // This handles redirects for the old, now-deleted specific routes
                    if (topic.pathPrefix) {
                         redirects.push({
                            source: `/${topic.pathPrefix}/${oldSlug}`,
                            destination: topic.href,
                            permanent: true,
                        });
                    }
                }
            }
        }

        const redirectsFilePath = path.resolve(process.cwd(), 'public/redirects.json');
        await fs.writeFile(redirectsFilePath, JSON.stringify(redirects, null, 2));
        console.log(`✓ Successfully generated ${redirects.length} redirects to public/redirects.json`);
    } catch (error) {
        console.error('Error generating redirects:', error);
        process.exit(1);
    }
}

main();
