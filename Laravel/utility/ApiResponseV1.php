<?php

namespace App\Utility;

class ApiResponse
{
	public $data;
	public $message;
	public $statusCode;

	public function __construct($data, $message = "data fetched successfully", $statusCode = 200)
	{
		$this->data = $data;
		$this->message = $message;
		$this->statusCode = $statusCode;
	}

	public function setMessage(string $message): self
	{
		$this->message = $message;
		return $this;
	}

	public function setStatusCode(int $statusCode): self
	{
		if ($statusCode < 100 || $statusCode > 599) {
			$statusCode = 500;
			$this->setMessage("Invalid status code. Set to default.");
		}
		$this->statusCode = $statusCode;
		return $this;
	}

	public function sendResponse()
	{
		return response()->json([
			'data' => $this->data,
			'message' => $this->message,
			'statusCode' => $this->statusCode
		], $this->statusCode);
	}
}
