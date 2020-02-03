import { join } from "path"
import globby from "globby"
import { readFile } from "fs-extra"

import { RenderResponse } from "./"

export const EXT_REGEX = /(.+)(\.[^\.]+)$/

export default async function(
  root: string,
  path: string
): Promise<RenderResponse | void> {
  const match = path.match(EXT_REGEX)

  if (!match || !match[2]) {
    return
  }

  let [, name, ext] = match
  let map = ""

  if (ext === ".map") {
    map = ext
    ;[, name, ext] = name.match(EXT_REGEX)
  }

  const nameExt = process.env.STAGE ? "" : "-*"

  const glob = [
    join(root, path),
    join(root, `${name}${nameExt}${ext}${map}`),
    join(root, `${name}.js${map}`),
  ]

  const paths = await globby(glob)

  if (paths[0]) {
    const mjs = await readFile(paths[0])

    let contentType = "text/javascript"

    if (ext === ".css") {
      contentType = "text/css"
    }

    if (ext === ".ts") {
      contentType = "application/typescript"
    }

    if (map) {
      contentType = "application/json"
    }

    return {
      code: 200,
      body: mjs.toString(),
      type: contentType,
    }
  }
}
