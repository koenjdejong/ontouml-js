import * as console from "console";

export type PrimitiveType = 'string' | 'number' | 'integer' | 'boolean' | 'null'
export type Type = PrimitiveType | 'array' | 'object'
export type OpenAPISchema = {
  openapi: string,
  info: {
    title: string,
    version: string,
    summary?: string,
    description?: string,
    termsOfService?: string,
    contact?: {
      name: string,
      url?: string,
      email?: string,
    },
    license?: {
      name: string,
      url?: string,
    },
  },
  servers?: {
    url: string,
    description?: string,
    variables?: object,
  }[],
  paths: object,
  components: {
    schemas: {
      [name: string]: Schema,
    },
  },
}

export class Schema {
  description?: string
  required: string[] = []
  'x-ontouml'?: {
    id: string,
    stereotype: string,
    isAbstract: boolean,
    isDerived: boolean,
  }
  path: boolean = false

  addOntoUMLAnnotation(id: string, stereotype: string, isAbstract: boolean, isDerived: boolean) {
    this['x-ontouml'] = {
      id,
      stereotype,
      isAbstract,
      isDerived,
    }
  }

  parse() {
    const result: any = {}
    if (this.description) result.description = this.description
    if (this.required.length > 0) result.required = this.required
    if (this['x-ontouml']) result['x-ontouml'] = this['x-ontouml']
    return result
  }

  addProperty(name: string, schema: Schema, required: boolean = false) {
    throw new Error('Not implemented')
  }

  createPath() {
    this.path = true
  }
}

export class PrimitiveSchema extends Schema {
  type: PrimitiveType = 'string'

  constructor(type: PrimitiveType | undefined) {
    super()
    if (type) this.type = type
  }

  parse() {
    return {
      ...super.parse(),
      type: this.type,
    }
  }
}

export class EnumSchema extends Schema {
  type: Type = 'string'
  enum: string[]

  constructor(values: string[]) {
    super()
    this.enum = values
  }

  parse() {
    return {
      ...super.parse(),
      type: this.type,
      enum: this.enum,
    }
  }
}

export class ArraySchema extends Schema {
  type: Type = 'array'
  items?: Schema

  constructor(items: Schema) {
    super()
    this.items = items
  }

  parse() {
    const result = {
      ...super.parse(),
      type: this.type,
    }
    if (this.items) {
      result.items = this.items.parse()
    }
    return result
  }
}

export class ObjectSchema extends Schema {
  type: Type = 'object'
  properties: { [name: string]: Schema } = {}

  parse() {
    const result = {
      ...super.parse(),
      type: this.type,
    }
    if (Object.keys(this.properties).length > 0) {
      result.properties = {}
      Object.entries(this.properties).forEach(([name, schema]: [string, Schema]) => {
        result.properties[name] = schema.parse()
      })
    }
    return result
  }

  addProperty(name: string, schema: Schema, required: boolean = false) {
    this.properties[name] = schema
    if (required) this.required.push(name)
  }
}

export class ReferenceSchema extends Schema {
  $ref: string

  constructor(ref: string) {
    super()
    this.$ref = `#/components/schemas/${ref}`
  }

  parse() {
    return {
      ...super.parse(),
      $ref: this.$ref,
    }
  }
}

export class AllOfSchema extends Schema {
  allOf: Schema[] = []

  constructor(initial: ObjectSchema) {
    super();
    this.allOf.push(initial)
  }

  parse() {
    return {
      ...super.parse(),
      allOf: this.allOf.map((schema: Schema) => schema.parse()),
    }
  }

  addProperty(name: string, schema: Schema, required: boolean = false) {
    const initial = this.allOf[0] as ObjectSchema
    initial.addProperty(name, schema, required)
    if (required) initial.required.push(name)
  }

  addSchema(schema: Schema) {
    this.allOf.push(schema)
  }
}

type ParameterIn = 'path' | 'query' | 'header' | 'cookie'
export class Parameter {
  name: string
  in: ParameterIn
  description?: string
  required?: boolean
  schema?: Schema
  example?: any

  constructor(name: string, in_: ParameterIn, schema: Schema, required: boolean = false) {
    this.name = name
    this.in = in_
    this.schema = schema
    this.required = required
  }

  parse() {
    const result: any = {
      name: this.name,
      in: this.in,
    }
    if (this.description) result.description = this.description
    if (this.required) result.required = this.required
    if (this.schema) result.schema = this.schema.parse()
    if (this.example) result.example = this.example
    return result
  }
}

export class Response {
  description: string
  schema?: Schema
  example?: any

  constructor(description: string, schema?: Schema) {
    this.description = description
    this.schema = schema
  }

  parse() {
    const result: any = {
      description: this.description,
    }
    if (this.schema) result.schema = this.schema.parse()
    if (this.example) result.example = this.example
    return result
  }
}

