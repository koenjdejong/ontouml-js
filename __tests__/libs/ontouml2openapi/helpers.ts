import { Package, Project } from '@libs/ontouml';
import { Ontouml2Openapi, Ontouml2OpenapiOptions } from "@libs/ontouml2openapi";

export function generateOpenAPI(modelOrProject: Package | Project, options?: Partial<Ontouml2OpenapiOptions>) {
  const ontouml2openapi = new Ontouml2Openapi(modelOrProject, options);

  return ontouml2openapi.run().result;
}

export function generateOpenAPIIssues(modelOrProject: Package | Project, options?: Partial<Ontouml2OpenapiOptions>) {
  const ontouml2openapi = new Ontouml2Openapi(modelOrProject, options);

  return ontouml2openapi.run().issues;
}
