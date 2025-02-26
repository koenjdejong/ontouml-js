import { Name } from './name'

export type PrimitiveType = 'string' | 'number' | 'integer' | 'boolean'
export type Type = PrimitiveType | 'object' | 'array'

type BaseSchema = { name: Name, description?: string }
export abstract class Schema {
  name: Name
  description?: string

  protected constructor(base: BaseSchema) {
    Object.assign(this, base)
  }

  parse(): { [key: string]: any } {
    if (this.description) return { description: this.description }
    return {}
  }
}

export class PrimitiveSchema extends Schema {
  type: PrimitiveType = 'string'

  constructor(base: BaseSchema & { type?: PrimitiveType }) {
    super(base)
  }

  parse() {
    return {
      ...super.parse(),
      type: this.type,
    }
  }
}

export class ObjectSchema extends Schema {
  type: Type = 'object'
  required: string[] = []
  properties: Schema[] = []

  constructor(base: BaseSchema) {
    super(base)
  }

  addProperty(schema: Schema, required?: boolean): ObjectSchema {
    this.properties.push(schema)
    if (required) this.required.push(schema.name.single)
    return this
  }

  parse() {
    const result: any = {
      ...super.parse(),
      type: this.type,
    }
    if (Object.keys(this.properties).length > 0) {
      result.properties = {}
      Object.entries(this.properties).forEach(([name, schema]: [string, Schema]) => {
        result.properties[name] = schema.parse()
      })
    }
    if (this.required.length > 0) result.required = this.required
    return result
  }
}

export class ArraySchema extends Schema {
  type: Type = 'array'
  items: Schema

  constructor(base: BaseSchema & { items: Schema }) {
    super(base)
  }

  parse() {
    const result: any = {
      ...super.parse(),
      type: this.type,
    }
    result.items = this.items.parse()
    return result
  }
}

export class EnumSchema extends PrimitiveSchema {
  type: PrimitiveType = 'string'
  enum: string[]

  constructor(base: BaseSchema & { enum: string[] }) {
    super(base)
  }

  parse() {
    return {
      ...super.parse(),
      type: this.type,
      enum: this.enum,
    }
  }
}

export class ReferenceSchema extends Schema {
  $ref: string

  constructor(base: BaseSchema) {
    super(base)
    this.$ref = `#/components/schemas/${base.name.single}`
  }

  parse() {
    return {
      ...super.parse(),
      $ref: this.$ref,
    }
  }
}

export class AllOfSchema extends Schema {
  allOf: [ObjectSchema, ...ReferenceSchema[]]

  constructor(base: BaseSchema & { objectSchema: ObjectSchema }) {
    super(base)
    this.allOf = [base.objectSchema]
  }

  addReference(schema: ReferenceSchema): AllOfSchema {
    this.allOf.push(schema)
    return this
  }

  parse() {
    return {
      ...super.parse(),
      allOf: this.allOf.map((schema: Schema) => schema.parse()),
    }
  }
}
