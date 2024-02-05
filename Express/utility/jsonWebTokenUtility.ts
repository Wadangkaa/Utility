import jwt from "jsonwebtoken"
import { Request } from "express"
import { AuthPayload } from "../dto/auth.dto"

const APP_SECRET_KEY = "THIS-SECRET-KEY"

export const generateAccessToken = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET_KEY, { expiresIn: "1d" })
}

export const verifyAccessToken = (req: Request) => {
  const bearerToken = req.get("Authorization")

  if (bearerToken) {
    const token = bearerToken.split(" ")[1]
    const payload = jwt.verify(token, APP_SECRET_KEY) as AuthPayload

    req.user = payload
    return true
  }

  return false
}
