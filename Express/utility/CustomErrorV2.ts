import { Request, Response, NextFunction } from "express"

class CustomError extends Error {
  public code?: number
  public statusCode: number
  public status: string
  public isOperational: boolean

  constructor(message: string, statusCode: number, code?: number) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error"
    this.isOperational = true
    this.code = code

    Error.captureStackTrace(this, this.constructor)
  }
}

const castErrorHandler = (err: any) => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`
  return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err: any) => {
  const name = err.keyValue.name
  const msg = `There is already a movie with name ${name}. Please use another name!`
  return new CustomError(msg, 400)
}

const validationErrorHandler = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => val.message)
  const errorMessages = errors.join(". ")
  const msg = `Invalid input data: ${errorMessages}`
  return new CustomError(msg, 400)
}

const errorHandler = (
  err: CustomError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default values for errors without statusCode or status
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castErrorHandler(err)
    if (err.code === 11000) err = duplicateKeyErrorHandler(err)
    if (err.name === "ValidationError") err = validationErrorHandler(err)
  }

  // Respond to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && {
      stackTrace: err.stack,
      error: err,
    }),
  })
}

export { errorHandler, CustomError }
