import { Property } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { ArraySchema, EnumSchema, ObjectSchema, PrimitiveSchema, ReferenceSchema, PrimitiveType } from './openapi/schema';
import { Name } from "./openapi/name";

// TODO attributes that special types are also transformed (date, email, etc)

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
};

export function transformAttribute(transformer: Ontouml2Openapi, attribute: Property): boolean {
  const name = new Name(attribute.name.getText());

  const schema = transformer.getSchema(attribute.container.name.getText());
  if (!schema) return false;

  const attributeSchema = transformer.getSchema(attribute.name.getText());
  if (attributeSchema) {
    if (attributeSchema instanceof ObjectSchema){
      const reference = new ReferenceSchema(attribute.name.getText());
      schema.addProperty(attribute.name.getText(), reference);
      return true;
    } else if (attributeSchema instanceof EnumSchema) {
      schema.addProperty(attribute.name.getText(), attributeSchema);
      return true;
    }
  }

  let typeText = attribute.propertyType.name.getText().toLowerCase();
  let array = false;
  if (typeText.includes('[') && typeText.includes(']')) {
    typeText = typeText.replace('[', '').replace(']', '')
    array = true;
  }

  let type = typeMap[typeText];
  if (!type) type = 'string';

  if (array) {
    const arraySchema = new ArraySchema(new PrimitiveSchema(type));
    schema.addProperty(attribute.name.getText(), arraySchema);
    return true;
  }

  schema.addProperty(attribute.name.getText(), new PrimitiveSchema(type));

  return true;
}
