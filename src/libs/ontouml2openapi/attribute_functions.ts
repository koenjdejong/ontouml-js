import { Property } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import {PrimitiveSchema, PrimitiveType, ReferenceSchema} from './types';

const typeMap: Record<string, PrimitiveType> = {
  // boolean
  'boolean': 'boolean',
  'bool': 'boolean',
  // integer
  'integer': 'integer',
  'int': 'integer',
  // number
  'number': 'number',
  'num': 'number',
  'float': 'number',
  'double': 'number',
  // string
  'string': 'string',
  'str': 'string',
  'char': 'string',
  'character': 'string',
  'text': 'string',
  // TODO date
};

export function transformAttribute(transformer: Ontouml2Openapi, attribute: Property): boolean {
  const schema = transformer.getSchema(attribute.container.name.getText());
  if (!schema) return false;

  if (transformer.getSchema(attribute.name.getText())) {
    const reference = new ReferenceSchema(attribute.name.getText());
    schema.addProperty(attribute.name.getText(), reference, false);
    return true;
  }

  let type = typeMap[attribute.propertyType.name.getText().toLowerCase()];
  if (!type) type = 'string';

  schema.addProperty(attribute.name.getText(), new PrimitiveSchema(type));

  return true;
}
