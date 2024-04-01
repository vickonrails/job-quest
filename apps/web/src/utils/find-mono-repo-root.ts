import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 
 * @returns the root of the current monorepo
 */
export function getMonorepoRoot() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    let currentDir = __dirname;
    let packageJsonPath;

    while (!packageJsonPath) {
        const testPath = path.join(currentDir, 'package.json');

        if (fs.existsSync(testPath)) {
            const packageJson = JSON.parse(fs.readFileSync(testPath, 'utf-8'));
            if (packageJson.name === 'job.quest') {
                packageJsonPath = testPath;
                break;
            }
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            throw new Error('Could not find monorepo root');
        }

        currentDir = parentDir;
    }

    return path.dirname(packageJsonPath);
}
