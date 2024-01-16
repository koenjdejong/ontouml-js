import { Schema } from './schema';
import {Operation, Path} from './response';

export type License = {
  name: string,
  url?: string,
}
export type Contact = {
  name: string,
  url?: string,
  email?: string,
}
export type Server = {
  url: string,
  description?: string,
  variables?: object,
}
export class OpenAPISchema {
  info: {
    title: string,
    version: string,
    summary?: string,
    description?: string,
    termsOfService?: string,
    contact?: Contact,
    license?: License,
  }
  servers?: Server[]
  paths:  Path[]
  components: {
    schemas: Schema[],
  }

  parse() {
    const result: any = {
      info: {
        title: this.info.title,
        version: this.info.version,
      },
      paths: {},
      components: {
        schemas: {},
      },
    }

    this.components.schemas.forEach((schema: Schema) => {
      result.components.schemas[schema.name.single] = schema.parse()
    })

    this.paths.forEach((path: Path) => {
      result.paths[path.name] = {}
      path.operators.forEach((operation: Operation) => {
        result.paths[path.name][operation.name] = {
          tags: operation.tags,
          parameters: operation.parameters,
          responses: operation.responses,
        }
      })
    })
  }
}
