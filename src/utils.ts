
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { spawn, ExecOptions } from 'child_process'
import { readFile as readFileAsync, writeFile as writeFileAsync } from 'fs'
import { dir as tmpDir } from 'tmp'

export const exec = (command: string, options: ExecOptions) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {

    const args = command.split(' ');
    const instance = spawn(args[0], args.slice(1), options);

    let stdout = '';
    let stderr = '';

    instance.stdout.on('data', (data) => {
      const dataStr = data.toString();
      console.log('stdout:', dataStr);
      stdout += dataStr;
    });

    instance.stderr.on('data', (data) => {
      const dataStr = data.toString();
      console.log('stderr:', dataStr);
      stderr += dataStr;
    });

    instance.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code} and stderr output: ${stderr}`));
        return;
      }

      console.log('child process exited with code:', code);
      resolve({ stdout, stderr });
    });
  })

export const readFile = (path: string) =>
  new Promise<Buffer>((resolve, reject) =>
    readFileAsync(path, (err, data) => (err ? reject(err) : resolve(data)))
  )

export const writeFile = (path: string, data: string) =>
  new Promise<void>((resolve, reject) =>
    writeFileAsync(path, data, err => (err ? reject(err) : resolve()))
  )

export const createTempDirectory = () =>
  new Promise<string>((resolve, reject) =>
    tmpDir((err, path) => (err ? reject(err) : resolve(path)))
  )
