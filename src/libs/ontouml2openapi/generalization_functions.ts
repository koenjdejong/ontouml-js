import { Generalization } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import {AllOfSchema, ObjectSchema, ReferenceSchema} from "@libs/ontouml2openapi/types";

export function transformGeneralization(transformer: Ontouml2Openapi, generalization: Generalization): boolean {
  const general = transformer.getSchema(generalization.general.name.getText());
  const specific = transformer.getSchema(generalization.specific.name.getText());
  if (!specific || !general) return false;

  if (!(specific instanceof ObjectSchema)) return false;

  const schema = new AllOfSchema(specific);
  new ReferenceSchema(generalization.general.name.getText());
  schema.addSchema(general);
  transformer.addSchema(generalization.specific.name.getText(), schema);

  return true;
}
