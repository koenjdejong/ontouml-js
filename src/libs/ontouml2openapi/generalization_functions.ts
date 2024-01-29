import { Generalization } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { AllOfSchema, ObjectSchema, ReferenceSchema } from "./openapi/schema";
import { Name } from "./openapi/name";

export function transformGeneralization(transformer: Ontouml2Openapi, generalization: Generalization): boolean {
  const base =  {
    name: new Name(generalization.specific.name.getText()?.toLowerCase()),
    description: generalization.specific.description.getText(),
  };

  const general = transformer.getSchema(generalization.general.name.getText());
  const specific = transformer.getSchema(generalization.specific.name.getText());
  if (!specific || !general) return false;

  if (specific instanceof ObjectSchema) {
    const schema = new AllOfSchema({ ...base, objectSchema: specific });
    const reference = new ReferenceSchema({ name: general.name });
    schema.addReference(reference);
    transformer.addSchema(schema);
  } else if (specific instanceof AllOfSchema) {
    const reference = new ReferenceSchema({ name: general.name });
    specific.addReference(reference);
  } else {
    throw new Error(`Invalid schema type: ${specific.name} for class ${generalization.specific.name.getText()}`);
  }
  return true;
}
