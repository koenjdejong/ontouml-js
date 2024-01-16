import { Name } from './name';
import { PrimitiveSchema, Schema } from './schema';

export class Path {
  name: string;
  operators: Operation[];

  constructor(name: Name, schema: Schema, multiple?: boolean) {
    this.name = multiple ? name.multiple : name.single;
    if (multiple) {
      this.operators.push(new Operation('get', schema, multiple));
      this.operators.push(new Operation('post', schema, multiple));
    } else {
      this.operators.push(new Operation('get', schema, multiple));
      this.operators.push(new Operation('put', schema, multiple));
      this.operators.push(new Operation('delete', schema, multiple));
    }
  }
}

type Method = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'trace';
export class Operation {
  name: Method;
  tags: string[];
  parameters: Parameter[] = [];
  responses: Response[] = [];

  constructor(name: Method, schema: Schema, multiple?: boolean) {
    this.name = name;
    this.tags = [schema.name.multiple];
    if (!multiple) {
      const parameter = new Parameter({
        name: new Name('id'),
        in: 'path',
        schema: new PrimitiveSchema( { name: new Name('string') }),
        required: true,
        description: 'The id of the resource',
      });
      this.parameters.push(parameter);
    }
    const response = new Response({ status: '200', schema });
    this.responses.push(response);
  }
}

export class Parameter {
  name: Name;
  in: string;
  schema: Schema;
  required: boolean;
  description?: string;

  constructor(base: { name: Name, in: string, schema: Schema, required: boolean, description?: string }) {
    Object.assign(this, base);
  }
}

export class Response {
  status: string;
  description?: string;
  content: { [key: string]: MediaType };

  constructor(base: { status: string, description?: string, schema: Schema }) {
    Object.assign(this, base);
    this.content['application/json'] = new MediaType({ schema: base.schema });
  }
}

export class MediaType {
  schema: Schema;

  constructor(base: { schema: Schema }) {
    Object.assign(this, base);
  }
}
