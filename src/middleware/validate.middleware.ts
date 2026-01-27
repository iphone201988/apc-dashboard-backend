import { NextFunction, Request, Response } from "express";

const removeEmptyValues = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => removeEmptyValues(v))
      .filter((v) => v !== null && v !== undefined && v !== "");
  }

  if (typeof obj === "object" && obj !== null) {
    const newObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = removeEmptyValues(value);
      if (
        cleaned !== null &&
        cleaned !== undefined &&
        cleaned !== "" &&
        (typeof cleaned !== "object" || Object.keys(cleaned).length > 0)
      ) {
        newObj[key] = cleaned;
      }
    }
    return newObj;
  }

  return obj;
};

const validate =
  (schema: { body?: any; query?: any; params?: any }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Clean data safely (don’t reassign read-only properties)
      const cleanedBody = removeEmptyValues(req.body);
      const cleanedQuery = removeEmptyValues(req.query);
      const cleanedParams = removeEmptyValues(req.params);

      const validationErrors: string[] = [];

      const validateField = (
        field: "body" | "query" | "params",
        data: any
      ) => {
        if (schema[field]) {
          const { error } = schema[field].validate(data, {
            abortEarly: false,
          });
          if (error) {
            validationErrors.push(...error.details.map((e: any) => e.message));
          }
        }
      };

      validateField("params", cleanedParams);
      validateField("query", cleanedQuery);
      validateField("body", cleanedBody);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: validationErrors[0],
          details: validationErrors,
        });
      }

      // ✅ Attach cleaned versions for downstream handlers
      (req as any).validated = {
        body: cleanedBody,
        query: cleanedQuery,
        params: cleanedParams,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default validate;
