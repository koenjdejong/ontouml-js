import { Package, Project } from '@libs/ontouml';
import {Ontouml2Openapi, Ontouml2OpenapiOptions, } from "@libs/ontouml2openapi";

export function generateOpenAPI(modelOrProject: Package | Project, options?: Partial<Ontouml2OpenapiOptions>) {
  const ontouml2openapi = new Ontouml2Openapi(modelOrProject, options);

  return ontouml2openapi.run().result;
}

// export function getIssues(modelOrProject: Package | Project, options?: Partial<Ontouml2GufoOptions>): Issue[] {
//   const optionsWithDefaults = {
//     baseIri: 'https://example.com',
//     format: 'Turtle',
//     ...options
//   };
//   const ontouml2gufo = new Ontouml2Gufo(modelOrProject, optionsWithDefaults);
//
//   ontouml2gufo.transform();
//
//   return ontouml2gufo.getIssues();
// }
//
// export function getUriManager(modelOrProject: Package | Project, options?: Partial<Ontouml2GufoOptions>): UriManager {
//   const optionsWithDefaults = {
//     baseIri: 'https://example.com',
//     format: 'Turtle',
//     ...options
//   };
//   const ontouml2gufo = new Ontouml2Gufo(modelOrProject, optionsWithDefaults);
//
//   return ontouml2gufo.uriManager;
// }
