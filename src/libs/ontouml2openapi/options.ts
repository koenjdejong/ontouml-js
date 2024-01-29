import { ServiceOptions } from '@libs/service_options';
import type { Contact, License, Server } from './openapi';

type OutputFormat = 'JSON' | 'YAML'

export class Ontouml2OpenapiOptions implements ServiceOptions {
  // Service
  format: OutputFormat;
  addOntoUMLAttributes: boolean;
  // Schema
  version: string;
  servers: Server[];
  summary: string;
  termsOfService: string;
  contact: Contact;
  license: License;

  constructor(base: Partial<Ontouml2OpenapiOptions> = {}) {
    this.format = base.format || 'JSON';
    this.addOntoUMLAttributes = base.addOntoUMLAttributes || false;
    this.version = base.version || '1.0.0';
    this.servers = base.servers;
    this.summary = base.summary;
    this.termsOfService = base.termsOfService;
    this.contact = base.contact;
    this.license = base.license;
  }
}
