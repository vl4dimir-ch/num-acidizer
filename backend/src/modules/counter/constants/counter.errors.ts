import { ErrorResponse } from '../../../utils/api.utils';
import { HTTP_STATUS_CODES } from '../../../utils/constants/http.status-codes';

export const COUNTER_ERRORS = {
  EXCEED_MAX_VALUE: {
    message: 'Counter would exceed maximum value',
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    code: 'COUNTER_EXCEED_MAX_VALUE'
  },
  EXCEED_MIN_VALUE: {
    message: 'Counter would exceed minimum value',
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    code: 'COUNTER_EXCEED_MIN_VALUE'
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    code: 'COUNTER_INTERNAL_ERROR'
  },
} as const satisfies Record<string, ErrorResponse>; 