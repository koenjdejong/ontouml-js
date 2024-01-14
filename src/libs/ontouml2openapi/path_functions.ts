import { Ontouml2Openapi } from "./";
import {Path, Operator, Schema, ERROR_NAME, Parameter, PrimitiveSchema} from "./types";

export function createPath(transformer: Ontouml2Openapi, name: string, schema: Schema): boolean {
  if (name === ERROR_NAME) return false;

  const multiple = new Path();
  const multipleName = `${name.toLowerCase()}s`;
  multiple.addOperator(new Operator('get', multipleName, schema));
  multiple.addOperator(new Operator('post', multipleName, schema));
  transformer.addPath(`/${multipleName}`, multiple);

  const single = new Path();
  const singleName = name.toLowerCase()
  const get = new Operator('get', singleName, schema);
  const parameter = new Parameter('id', 'path', new PrimitiveSchema('string'), true, 'The id of the resource');
  get.addParameter(parameter);
  single.addOperator(get);
  const put = new Operator('put', singleName, schema);
  put.addParameter(parameter);
  single.addOperator(put);
  const delete_ = new Operator('delete', singleName, schema);
  delete_.addParameter(parameter);
  single.addOperator(delete_);
  transformer.addPath(`/${multipleName}/{id}`, single);

  return true;
}
