const path = require('path');
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const API_URL = 'https://api.github.com/repos/AnnikaCodes/ziglint/releases/latest';

async function writeFilePromise(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

(async () => {
    try {
        const binaryName = core.getInput('binary-name');

        let os = process.platform;
        if (os === 'win32') os = 'windows';
        if (os === 'darwin') os = 'macos';

        let arch = process.arch;
        if (arch === 'x64') arch = 'x86_64';
        if (arch === 'arm64') arch = 'aarch64';

        let name = `ziglint-${os}-${arch}`;
        if (os === 'windows') name += '.exe';
        core.info(`Looking for ${name}...`);

        const apiRequest = await fetch(API_URL);
        const latestRelease = await apiRequest.json();
        core.info(`Latest release is ${latestRelease.name}`);
        const asset = latestRelease.assets.find(asset => asset.name === name);
        if (!asset) {
            core.setFailed(`ziglint release ${latestRelease.name} is not available for your platform (${name} not found)`);
            return;
        }

        const downloadUrl = asset.browser_download_url;
        core.info(`Downloading ${downloadUrl}...`);
        const binaryRequest = await fetch(downloadUrl);

        await writeFilePromise(binaryName, Buffer.from(await binaryRequest.arrayBuffer()));
        core.info(`Successfully downloaded ${binaryName}`);

        // make it executable
        if (os !== 'windows') fs.chmodSync(binaryName, 0o755);
        core.addPath(path.resolve(process.cwd(), binaryName));

    } catch (error) {
        core.setFailed(error.message);
    }
})();
