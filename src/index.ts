import loaded from "@fn2/loaded"
import ssr from "@fn2/ssr"
import Formidable from "formidable"
import { assetFromRequest } from "./asset"

import app from "./app"
import headComponent from "./components/headComponent"

export * from "./asset"

export interface RenderRequest {
  path: string
  method: string
  files: Formidable.Files
  params: Formidable.Fields
  user?: string
}

export interface RenderResponse {
  code?: number
  body?: string
  type?: string
}

export class RenderServer {
  app: typeof app = null
  libs: typeof loaded.libs = null
  ssr: typeof ssr = null

  headComponent: typeof headComponent = null

  async route(
    root: string,
    request: RenderRequest,
    response: RenderResponse = {}
  ): Promise<RenderResponse> {
    const { path } = request
    const asset = await assetFromRequest(root, path)

    if (asset) {
      return asset
    }

    const componentName = this.app.router.route(path)
    const bodyComponent = this.libs[componentName]

    const headComponent = bodyComponent.head
      ? this.libs[bodyComponent.head]
      : this.headComponent

    const layout = await this.ssr.layout(
      headComponent,
      bodyComponent,
      request,
      response
    )

    return {
      code: response.code || 200,
      body: response.body || layout,
      type: response.type || "text/html",
    }
  }
}

export default new RenderServer()
