import {Ontouml2OpenapiOptions} from "@libs/ontouml2openapi/options";
import * as console from "console";

export const ERROR_NAME = 'Error'

function transformName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export type PrimitiveType = 'string' | 'number' | 'integer' | 'boolean' | 'null'
export type Type = PrimitiveType | 'array' | 'object'
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
  paths: { [path: string]: Path }
  components: {
    schemas: {
      [name: string]: Schema,
    },
  }

  constructor(name: string, description: string | undefined, options: Ontouml2OpenapiOptions) {
    this.info = {
      title: name,
      version: options.version,
    }
    if (description) this.info.description = description
    if (options.summary) this.info.summary = options.summary
    if (options.termsOfService) this.info.termsOfService = options.termsOfService
    if (options.contact) this.info.contact = options.contact
    if (options.license) this.info.license = options.license
    this.servers = options.servers
    this.paths = {}
    this.components = {
      schemas: {
        [ERROR_NAME]: errorSchema,
      }
    }
  }

  parse() {
    const result: any = {
      openapi: '3.0.0',
      info: this.info,
    }
    if (this.servers?.length) result.servers = this.servers
    if (this.components.schemas) {
      result.components = { schemas: {} }
      Object.entries(this.components.schemas).forEach(([name, schema]: [string, Schema]) => {
        result.components.schemas[name] = schema.parse(1)
        result.components.schemas[`${name}s`] = new ArraySchema(new ReferenceSchema(name)).parse(2)
      })
    }
    if (Object.keys(this.paths).length > 0) {
      result.paths = {}
      Object.entries(this.paths).forEach(([name, path]: [string, Path]) => {
        result.paths[name] = path.parse()
      })
    }
    return result
  }
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

  parse(_level: number): { [key: string]: any } | undefined {
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

  parse(level: number) {
    return {
      ...super.parse(level),
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

  parse(level: number) {
    if (level === 1) return undefined
    return {
      ...super.parse(level),
      type: this.type,
      enum: this.enum,
    }
  }
}

export class ArraySchema extends Schema {
  type: Type = 'array'
  items: Schema

  constructor(items: Schema) {
    super()
    this.items = items
  }

  parse(level: number) {
    if (level === 1) return undefined
    const result: any = {
      ...super.parse(level),
      type: this.type,
    }
    result.items = this.items.parse(level + 1)
    return result
  }
}

export class ObjectSchema extends Schema {
  type: Type = 'object'
  properties: { [name: string]: Schema } = {}

  parse(level: number) {
    const result: any = {
      ...super.parse(level),
      type: this.type,
    }
    if (Object.keys(this.properties).length > 0) {
      result.properties = {}
      Object.entries(this.properties).forEach(([name, schema]: [string, Schema]) => {
        result.properties[name] = schema.parse(level + 1)
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

  parse(level: number) {
    if (level === 1) return undefined
    return {
      ...super.parse(level),
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

  parse(level: number) {
    return {
      ...super.parse(level),
      allOf: this.allOf.map((schema: Schema) => schema.parse(level + 1)),
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

export class Path {
  operators: { [method: string]: Operator }

  constructor() {
    this.operators = {}
  }

  parse() {
    const result: any = {}
    Object.entries(this.operators).forEach(([method, operator]: [string, Operator]) => {
      result[method] = operator.parse()
    })
    return result
  }

  addOperator(operator: Operator) {
    this.operators[operator.type] = operator
  }
}

type OperatorType = 'get' | 'post' | 'put' | 'delete'
export class Operator {
  type: OperatorType
  tags: string[]
  description?: string
  parameters: Parameter[] = []
  responses: { [code: string]: Response }

  constructor(type: OperatorType, name: string, schema: Schema) {
    this.tags = [name]
    this.type = type
    this.responses = {
      '200': new Response('Successful', new ReferenceSchema(transformName(name))),
      default: defaultErrorResponse,
    }

    if (schema.description) this.description = schema.description
  }

  parse() {
    const result: any = {
      tags: this.tags,
      // operationId: `${this.type}${transformName(this.tags[0])}`,
      responses: {},
    }
    if (this.parameters.length > 0) result.parameters = this.parameters.map((parameter: Parameter) => parameter.parse())
    Object.entries(this.responses).forEach(([code, response]: [string, Response]) => {
      result.responses[code] = response.parse()
    })
    if (this.description) result.description = this.description
    return result
  }

  addParameter(parameter: Parameter) {
    this.parameters.push(parameter)
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

  constructor(name: string, in_: ParameterIn, schema: Schema, required: boolean = false, description?: string) {
    this.name = name
    this.in = in_
    this.schema = schema
    this.required = required
    if (description) this.description = description
  }

  parse() {
    const result: any = {
      name: this.name,
      in: this.in,
    }
    if (this.description) result.description = this.description
    if (this.required) result.required = this.required
    if (this.schema) result.schema = this.schema.parse(99)
    if (this.example) result.example = this.example
    return result
  }
}

export class Response {
  description: string
  schema: Schema

  constructor(description: string, schema: Schema) {
    this.description = description
    this.schema = schema
  }

  parse() {
    return {
      description: this.description,
      content: {
        'application/json': {
          schema: this.schema.parse(99),
        },
      }
    }
  }
}

const errorSchema = new ObjectSchema()
errorSchema.addProperty('status', new PrimitiveSchema('integer'), true)
errorSchema.addProperty('code', new PrimitiveSchema('string'), true)
errorSchema.addProperty('detail', new PrimitiveSchema('string'), true)
const defaultErrorResponse = new Response('Unexpected error', new ReferenceSchema('Error'))

