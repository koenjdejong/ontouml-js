import { Generalization, GeneralizationSet, Class } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { EnumSchema, ObjectSchema, Schema } from "@libs/ontouml2openapi/types";

export const transformGeneralizationSet = (transformer: Ontouml2Openapi, set: GeneralizationSet): boolean => {
  if (!set.generalizations || set.generalizations.length === 0) return false;

  const children = set.generalizations.map((generalization: Generalization) => generalization.specific);
  const parent = set.getGeneralClass();
  if (!parent) return false;

  const parentSchema = transformer.getSchema(parent.name.getText());
  if (!parentSchema) return false;

  const childrenNames = children.map((child: Class) => child.name.getText());
  const childrenSchemas = childrenNames.map((name: string) => transformer.getSchema(name));
  // TODO fix this
  if (childrenSchemas.some((schema: Schema) => Object.keys(schema.properties || []).length)) return false;

  const schema = new EnumSchema(childrenNames);
  const name = set.name.getText() || `${parent.name.getText()}Type`;
  const required = set.isComplete || set.isDisjoint;
  parentSchema.addProperty(name, schema, required);

  childrenNames.forEach((name: string) => {
    const schema = transformer.getSchema(name);
    if (schema && !(schema as ObjectSchema).properties) {
      transformer.removeSchema(name);
    }
  });

  return true;
}
