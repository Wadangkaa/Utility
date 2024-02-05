<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            $this->renderable(function (ApiException $e, $request) {
                $statusCode = $e->getStatusCode();
                $errorFormat = [
                    'error' => [
                        'message' => $e->getMessage(),
                        'status_code' => $statusCode,
                    ],
                ];

                return new JsonResponse($errorFormat, $statusCode);
            });
        });
    }
}
