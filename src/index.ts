
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { set } from 'monolite'
import { join, resolve } from 'path'
import { exec, readFile, writeFile, createTempDirectory } from './utils'
import { readErrorLog } from './readErrorLog'

export type Options = {
  texInputs?: string[]
  shellEscape?: boolean
}

/**
 * Create ENV for pdflatex with TEXINPUTS correctly set
 */
const createChildEnv = (texInputs: string[] = []) =>
  // Prepend given texInputs
  set(process.env, _ => _.TEXINPUTS)((TEXINPUTS = '') =>
    [
      // Transform relative paths in absolute paths (but don't transform absolute paths)
      ...texInputs.map(path => path[0] === '/' ? path : resolve(process.cwd(), path)),
      ...TEXINPUTS.split(':')
    ]
      // Append colon to use default paths too
      .join(':')
  )

const createCommand = (options: Options) =>
  [
    'pdflatex',
    ...(options.shellEscape ? ['-shell-escape'] : []),
    '-halt-on-error',
    'texput.tex'
  ].join(' ')

/**
 * Compile LaTeX source
 */
const compile = async (tempPath: string, options: Options) => {
  try {
    await exec(createCommand(options), {
      cwd: tempPath,
      env: createChildEnv(options.texInputs)
    })
    return readFile(join(tempPath, 'texput.pdf'))
  } catch {
    throw await readErrorLog(tempPath)
  }
}

/**
 * Create PDF from a LaTeX file
 */
const pdflatex = async (source: string, options: Options = {}) => {
  const tempPath = await createTempDirectory()
  await writeFile(join(tempPath, 'texput.tex'), source)
  return compile(tempPath, options)
}

export default pdflatex
