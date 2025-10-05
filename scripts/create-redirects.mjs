
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * This script generates a `redirects.json` file by comparing the current
 * curriculum slugs against the version from the last stable Git commit (main/master).
 * It detects renamed slugs and creates permanent (301) redirects.
 */

console.log("Starting redirect generation...");

// --- Helper Functions ---

/**
 * Safely reads and parses a JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @returns {object|null} The parsed JSON object or null if an error occurs.
 */
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error reading or parsing ${filePath}:`, error);
  }
  return null;
}

/**
 * Gets the content of a file from the last commit on the main/master branch.
 * @param {string} filePath - The path to the file relative to the repo root.
 * @returns {string|null} The file content or null if an error occurs.
 */
function getFileContentFromGit(filePath) {
  try {
    // Try 'main' first, then fall back to 'master' for common default branch names.
    return execSync(`git show main:${filePath}`, { encoding: 'utf-8' });
  } catch (e) {
    try {
      return execSync(`git show master:${filePath}`, { encoding: 'utf-8' });
    } catch (e2) {
      console.warn(`Could not find file '${filePath}' on 'main' or 'master' branch. This is normal for new files.`);
      return null;
    }
  }
}

// --- Main Logic ---

const REPO_ROOT = process.cwd();
const KNOWN_SLUGS_PATH = '.known-slugs.json';
const OUTPUT_PATH = path.join(REPO_ROOT, 'public', 'redirects.json');

// 1. Get the previous version of the slugs from Git.
const oldSlugsContent = getFileContentFromGit(KNOWN_SLUGS_PATH);
const oldSlugs = oldSlugsContent ? JSON.parse(oldSlugsContent) : { topics: [], paths: [] };

// 2. Get the current version of the slugs from the filesystem.
const newSlugs = readJsonFile(path.join(REPO_ROOT, KNOWN_SLUGS_PATH));

if (!newSlugs) {
  console.error("Could not read current '.known-slugs.json'. Aborting redirect generation.");
  process.exit(0); // Exit gracefully, don't fail the build
}

// 3. Create a map for quick lookups of old slugs by ID.
const oldTopicMap = new Map(oldSlugs.topics.map(t => [t.id, t.href]));
const oldPathMap = new Map(oldSlugs.paths.map(p => [p.id, p.href]));

const redirects = [];

// 4. Compare topics
for (const newTopic of newSlugs.topics) {
  const oldHref = oldTopicMap.get(newTopic.id);
  // If an old href exists and it's different from the new one, create a redirect.
  if (oldHref && oldHref !== newTopic.href) {
    console.log(`Found slug change for topic '${newTopic.id}': ${oldHref} -> ${newTopic.href}`);
    redirects.push({
      source: oldHref,
      destination: newTopic.href,
      permanent: true,
    });
  }
}

// 5. Compare paths
for (const newPath of newSlugs.paths) {
  const oldHref = oldPathMap.get(newPath.id);
  if (oldHref && oldHref !== newPath.href) {
    console.log(`Found slug change for path '${newPath.id}': ${oldHref} -> ${newPath.href}`);
    redirects.push({
      source: oldHref,
      destination: newPath.href,
      permanent: true,
    });
  }
}

// 6. Write the redirects file.
if (redirects.length > 0) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(redirects, null, 2));
  console.log(`Successfully generated ${redirects.length} redirects to '${OUTPUT_PATH}'.`);
} else {
  console.log("No slug changes detected. No redirects generated.");
  // Ensure the file exists but is empty if no redirects are needed,
  // to prevent "file not found" errors in the next.config.js
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, '[]');
  }
}
