export class BasicHeadComponent {
  async element(): Promise<Element> {
    return <head></head>
  }
}

export default new BasicHeadComponent()
