import { Generalization } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { AllOfSchema, ObjectSchema, ReferenceSchema } from "@libs/ontouml2openapi/types";

export function transformGeneralization(transformer: Ontouml2Openapi, generalization: Generalization): boolean {
  const general = transformer.getSchema(generalization.general.name.getText());
  const specific = transformer.getSchema(generalization.specific.name.getText());
  if (!specific || !general) return false;

  if (specific instanceof ObjectSchema) {
    const schema = new AllOfSchema(specific);
    const reference = new ReferenceSchema(generalization.general.name.getText());
    schema.addSchema(reference);
    transformer.addSchema(generalization.specific.name.getText(), schema);
  } else if (specific instanceof AllOfSchema) {
    const reference = new ReferenceSchema(generalization.general.name.getText());
    specific.addSchema(reference);
  } else if (specific instanceof ReferenceSchema) {
    const schema = new AllOfSchema(new ObjectSchema());
    schema.addSchema(general);
    transformer.addSchema(generalization.specific.name.getText(), schema);
  } else {
    return false;
  }
  return true;
}
