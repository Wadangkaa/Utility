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

type ErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => void

const devErrors: ErrorHandler = (error, req, res, next) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace:
      process.env.NODE_ENV === "development" ? error.stack : undefined,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  })
}

const prodErrors: ErrorHandler = (error, req, res, next) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    })
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    })
  }
}

const errorHandler: ErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || "error"

  if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error)
    if (error.code === 11000) error = duplicateKeyErrorHandler(error)
    if (error.name === "ValidationError") error = validationErrorHandler(error)
  }

  if (process.env.NODE_ENV === "development") {
    devErrors(error, req, res, next)
  } else {
    prodErrors(error, req, res, next)
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

export { errorHandler, CustomError }
