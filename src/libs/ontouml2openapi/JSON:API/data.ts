import { Meta } from './'

export class ResourceObject {
  type: string
  id: string
  attributes?: {
    [key: string]: any
  }
  relationships?: {
    [key: string]: Relationship
  }
  links?: Links
  meta?: Meta

  constructor(base: Partial<ResourceObject>) {
    Object.assign(this, base)
  }
}

export class Links {
  self?: string
  related?: string

  constructor(base: Partial<Links>) {
    Object.assign(this, base)
  }
}

export class Relationship {
  links?: Links
  data?: ResourceObject | ResourceObject[]
  meta?: Meta

  constructor(base: Partial<Relationship>) {
    this.links = base.links
    this.data = base.data
  }
}
