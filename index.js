const core = require('@actions/core');
const {promises: fs} = require('fs')

// most @actions toolkit packages have async methods
async function run() {
    try {
        const filepath = core.getInput('filepath')
        core.info(`Reading file ${filepath}`);
        let content = await fs.readFile(filepath, 'utf8')
        content = JSON.parse(content);
        let npmVersion = content.version;
        core.setOutput('content', content)
        core.setOutput('packageName', content.name)
        core.setOutput('version', content.version)
        core.setOutput('npmVersion', content.version)
        core.setOutput('changed', content.version != npmVersion)
        core.info(`npm version: ${content.version}`);
        core.info(`file version: ${content.version}`);
        core.info(`is package version in npm versions?: ${content.version != npmVersion}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
