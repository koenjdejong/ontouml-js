import { Ontouml2Openapi } from "./";
import { Path, Operator, Schema } from "./types";

export function createPath(transformer: Ontouml2Openapi, name: string, schema: Schema): boolean {
  const multiple = new Path();
  const multipleName = `${name.toLowerCase()}s`;
  multiple.addOperator(new Operator('get', multipleName, schema));
  multiple.addOperator(new Operator('post', multipleName, schema));
  transformer.addPath(`/${multipleName}`, multiple);

  const single = new Path();
  const singleName = name.toLowerCase()
  single.addOperator(new Operator('get', singleName, schema));
  single.addOperator(new Operator('put', singleName, schema));
  single.addOperator(new Operator('delete', singleName, schema));
  transformer.addPath(`/${multipleName}/{id}`, single);

  return true;
}
