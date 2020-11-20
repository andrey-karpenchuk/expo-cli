#!/usr/bin/env node

function red(text) {
  return '\u001b[31m' + text + '\u001b[39m';
}
function yellow(text) {
  return '\u001b[33m' + text + '\u001b[39m';
}

var match = /v(\d+)\.(\d+)/.exec(process.version);
var major = parseInt(match[1], 10);
var minor = parseInt(match[2], 10);

var supportedVersions =
  'expo-cli supports following Node.js versions:\n' +
  '* >=10.13.0 <11.0.0 (Maintenance LTS)\n' +
  '* >=12.13.0 <13.0.0 (Active LTS)\n' +
  '* >=14.0.0  <15.0.0 (Current Release)\n';

function warnOrExitUponWrongNodeVersion() {
  // If newer than the current release
  if (major > 14) {
    // eslint-disable-next-line no-console
    console.warn(
      yellow(
        'WARNING: expo-cli has not yet been tested against Node.js ' +
          process.version +
          '.\n' +
          'If you encounter any issues, please report them to https://github.com/expo/expo-cli/issues\n' +
          '\n' +
          supportedVersions
      )
    );
  } else if (!((major === 10 && minor >= 13) || (major === 12 && minor >= 13) || major === 14)) {
    // eslint-disable-next-line no-console
    console.error(
      red('ERROR: Node.js ' + process.version + ' is no longer supported.\n\n' + supportedVersions)
    );
    process.exit(1);
  }
}

async function warnUponCmdExe() {
  if (process.platform === 'win32') {
    // we're on Windows & we want to suggest using PowerShell instead of CMD
    const psList = require('ps-list');
    await (async () => {
      const usersProcesses = await psList({ all: false });
      // find parent process name
      const shellProcess = usersProcesses.find(({ pid }) => pid === process.ppid) || {};
      if ((shellProcess.name || '').toLowerCase().includes('cmd.exe')) {
        // eslint-disable-next-line no-console
        console.warn(
          yellow(
            'WARNING: We recommend using PowerShell or Bash via WSL for development with expo-cli on Windows. You may encounter issues using cmd.exe.\n'
          )
        );
      }
    })();
  }
}

(async () => {
  warnOrExitUponWrongNodeVersion();
  await warnUponCmdExe();
  require('../build/exp.js').run('expo');
})();
