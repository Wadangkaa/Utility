import { AuthPayload } from "../dto/auth.dto"
import { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "../utility/jsonWebTokenUtility"

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatation = verifyAccessToken(req)
  if (validatation) {
    return next()
  } else {
    return res.json({ message: "unauthorized" })
  }
}
