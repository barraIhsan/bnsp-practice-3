import { ResponseError } from "../errors/res.js";

export default function validate(schema, req) {
  const result = schema.safeParse(req);

  if (!result.success) {
    const message = result.error.issues[0].message;
    throw new ResponseError(400, message);
  }

  return result.data;
}
