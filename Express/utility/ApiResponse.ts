class ApiResponse {
  public statusCode: number
  public success: boolean
  public message: string
  public data: any

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode
    this.success = statusCode < 400
    this.message = message
    this.data = data
  }
}

export { ApiResponse }
