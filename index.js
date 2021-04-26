const core = require('@actions/core');
const {promises: fs} = require('fs');
const request = require('sync-request');

// most @actions toolkit packages have async methods
async function run() {
    try {
        const filepath = core.getInput('filepath')
        core.info(`Reading file ${filepath}`);
        let content = await fs.readFile(filepath, 'utf8')
        content = JSON.parse(content);
        let packageFileVersion = content.version;
        const packageName = core.getInput('packageName') || content.name;
        const npmPackageMetadata = JSON.parse(request('GET', `https://registry.npmjs.org/${packageName}`).body);
        const npmVersions = Object.keys(npmPackageMetadata['versions']);
        const changed = npmVersions.includes(content.version) === false;
        core.setOutput('content', content);
        core.setOutput('packageName', packageName);
        core.setOutput('version', packageFileVersion);
        core.setOutput('npmVersions', npmVersions);
        core.setOutput('changed', changed);
        core.info(`file version: ${content.version}`);
        core.info(`npm ${content.name} package versions: ${npmVersions}`);
        core.info(`has package version changed from npm versions?: ${changed}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
