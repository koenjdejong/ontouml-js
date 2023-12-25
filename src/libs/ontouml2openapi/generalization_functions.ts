import { Generalization } from '@libs/ontouml';
import { Ontouml2Openapi } from './';

export function transformGeneralization(transformer: Ontouml2Openapi, generalization: Generalization) {
  const specific = generalization.specific;
  const general = generalization.general;

  const specificUri = transformer.getUri(specific);
  const generalUri = transformer.getUri(general);

  if (generalization.involvesClasses()) {
    transformer.addQuad(specificUri, 'rdfs:subClassOf', generalUri);
  }

  if (generalization.involvesRelations()) {
    transformer.addQuad(specificUri, 'rdfs:subPropertyOf', generalUri);
  }
}
