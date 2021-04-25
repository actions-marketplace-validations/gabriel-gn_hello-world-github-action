const core = require('@actions/core');
const {promises: fs} = require('fs')

const readPackageJson = async () => {
    const filepath = core.getInput('filepath')
    core.info(`Reading file ${filepath}`);
    const content = await fs.readFile(filepath, 'utf8')
    core.info(content);
    core.setOutput('content', content)
}

// most @actions toolkit packages have async methods
async function run() {
    try {
        const filepath = core.getInput('filepath')
        core.info(`Reading file ${filepath}`);
        const content = await fs.readFile(filepath, 'utf8')
        core.info(content);
        core.setOutput('content', content)
        // core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
