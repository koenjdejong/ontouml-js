import { ServiceOptions } from '@libs/service_options';

type OutputFormat = 'JSON' | 'YAML'

export class Ontouml2OpenapiOptions implements ServiceOptions {
  format: OutputFormat;
  addOntoumlAttributes: boolean;

  constructor(base: Partial<Ontouml2OpenapiOptions> = {}) {
    this.format = base.format || 'JSON';
    this.addOntoumlAttributes = base.addOntoumlAttributes || false;
  }
}
