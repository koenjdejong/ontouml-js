import { ResourceObject, Links } from "./data";
import { JSONAPIError } from './error'

export class Meta {
  [key: string]: any
}

export class JSONAPI {
  data?: ResourceObject | ResourceObject[]
  errors?: JSONAPIError[]
  meta?: Meta
  links?: Links
  included?: ResourceObject[]

  validate(base: Partial<JSONAPI>) {
    if (!(base.data || base.errors || base.meta)) {
      throw new Error('JSON:API document must contain either data, errors, or meta.')
    }
    if (base.data && base.errors) {
      throw new Error('JSON:API document can not contain both data and errors.')
    }
  }

  constructor(base: Partial<JSONAPI> = {}) {
    this.validate(base)
    Object.assign(this, base)
  }
}
