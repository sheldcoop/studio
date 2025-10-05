
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { allTopics } from '../src/lib/curriculum/index.js';

/**
 * @returns {{ source: string; destination: string; permanent: true }[]}
 */
export async function createRedirects() {
    const redirectsFile = 'public/redirects.json';
    const currentRedirects = existsSync(redirectsFile) ? JSON.parse(readFileSync(redirectsFile, 'utf-8')) : [];

    const currentTopics = new Map(allTopics.map(t => [t.id, t.href]));
    
    let previousTopics;
    try {
        // Get the content of the curriculum from the last git commit
        const prevCurriculumRaw = execSync('git show HEAD:src/lib/curriculum/index.js').toString();
        
        // This is a bit of a hack to dynamically import the old module content
        const dataUri = `data:text/javascript;base64,${Buffer.from(prevCurriculumRaw).toString('base64')}`;
        const { allTopics: prevAllTopics } = await import(dataUri);

        previousTopics = new Map(prevAllTopics.map(t => [t.id, t.href]));
    } catch (error) {
        console.warn('Could not load previous curriculum version from git. Skipping redirect generation for changed slugs.');
        return currentRedirects;
    }

    const newRedirects = [];

    // Find topics whose slugs have changed
    for (const [id, prevHref] of previousTopics.entries()) {
        const currentHref = currentTopics.get(id);
        if (currentHref && currentHref !== prevHref) {
            console.log(`Creating redirect for changed slug: ${prevHref} -> ${currentHref}`);
            newRedirects.push({
                source: prevHref,
                destination: currentHref,
                permanent: true,
            });
        }
    }

    // Combine old and new redirects, ensuring no duplicate sources
    const combined = [...currentRedirects];
    const sources = new Set(combined.map(r => r.source));

    for (const newRedirect of newRedirects) {
        if (!sources.has(newRedirect.source)) {
            combined.push(newRedirect);
            sources.add(newRedirect.source);
        }
    }

    // Write the combined list back to the file
    writeFileSync(redirectsFile, JSON.stringify(combined, null, 2));

    console.log(`Generated ${newRedirects.length} new redirects.`);
    return combined;
}

// If called directly via `node scripts/create-redirects.mjs`
if (import.meta.url.endsWith(process.argv[1].substring(process.argv[1].lastIndexOf('/') + 1))) {
    createRedirects().catch(console.error);
}
