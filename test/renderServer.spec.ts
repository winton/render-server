import expect from "./expect"
import { RenderServer } from "../src"

describe("renderServer", () => {
  it("should instantiate", () => {
    new RenderServer()
  })

  it("should assert", () => {
    expect(true).toBe(true)
  })
})
