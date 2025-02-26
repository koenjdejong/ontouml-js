import { Name } from './name';
import { ObjectSchema, PrimitiveSchema } from './schema';
import { Response } from './response';

export const ERROR_SCHEMA =
  new ObjectSchema({ name: new Name('Error') })
    .addProperty(new PrimitiveSchema({ name: new Name('status', 'statuses'), type: 'integer' }), true)
    .addProperty(new PrimitiveSchema({ name: new Name('code'), type: 'string' }), true)
    .addProperty(new PrimitiveSchema({ name: new Name('detail'), type: 'string' }), true)
