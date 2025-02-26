import { Schema } from './schema';
import { Path } from './response';

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

  constructor(title: string, description: string) {
    this.info = {
      title,
      version: '1.0.0',
    }
    this.paths = []
    this.components = {
      schemas: [],
    }

    if (description) this.info.description = description
  }

  parse() {
    const result: any = {
      openapi: '3.0.0',
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
      result.paths[path.name] = path.parse()
    })

    return result
  }
}
