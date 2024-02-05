<?php

namespace App\Utility;

use Closure;
use App\Exceptions\ApiException;
use Illuminate\Support\Facades\DB;

class DBTransaction
{
	/**
	 * @throws ApiException
	 */
	public static function begin(Closure $callback, Closure $handleError = null): void
	{
		DB::beginTransaction();
		try {
			$callback();
			DB::commit();
		} catch (\Exception $exception) {
			DB::rollBack();
			if ($handleError instanceof Closure) {
				$handleError($exception);
			}
			throw new ApiException($exception->getMessage(), is_int($exception->getCode()) ?: 500);
		}
	}
}
