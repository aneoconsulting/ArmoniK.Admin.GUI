/**
 * This script is used in a CI context.
 * This script is used to prevent a mismatch between the version in package.json and the latest tag.
 * In fact, Docker will used the latest tag to build the image (not the package version) but the application show the package version. So a mismatch between the two can be confusing.
 */

import { execSync } from 'node:child_process';
import pkg from '../package.json' assert { type: 'json' };

// Get latest tag
const tag = execSync('git describe --tags --abbrev=0').toString().trim();
const version = tag.replace(/^v/, '');

if (pkg.version !== version) {
  throw new Error(
    `Version mismatch: package.json version is ${pkg.version} but latest tag is ${version}`
  );
}
