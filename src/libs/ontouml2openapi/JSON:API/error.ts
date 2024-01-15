import { Meta } from "./";
import { Links } from "./data";

export class JSONAPIError {
  id?: string
  links?: Links
  status?: string
  code?: string
  title?: string
  detail?: string
  source?: ErrorSource
  meta?: Meta

  validate(base: Partial<JSONAPIError>) {
    if (Object.keys(base).length === 0) {
      throw new Error('JSON:API error object must contain at least one of the following members: id, links, status, code, title, detail or source.')
    }
  }

  constructor(base: Partial<JSONAPIError>) {
    this.validate(base)
    Object.assign(this, base)
  }
}

export class ErrorSource {
  pointer?: string
  parameter?: string
  header?: string

  validate(base: Partial<ErrorSource>) {
    if (Object.keys(base).length === 0) {
      throw new Error('Error source object must contain at least one of the following members: pointer, parameter or header.')
    }
  }

  constructor(base: Partial<ErrorSource>) {
    this.validate(base)
    Object.assign(this, base)
  }
}
