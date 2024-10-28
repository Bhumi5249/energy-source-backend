export const STATUS_CODE = {
  SUCCESS: true,
  ERROR: false,
  HTTP_SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  HTTP_CREATED: 201,
  SERVICE_NOT_AVAILABLE: 503,
}

export const DB_CONFIG = {
  ADMIN_CREDENTIALS: {
    ADMIN_USER_NAME: 'admin@gmail.com',
    ADMIN_PASSWORD: 'Admin@123',
  },
  SALT_ROUND: 10,
  USER_ROLES: {
    super_admin: 'superAdmin',
    _1: 'admin',
    _2: 'branch',
    _3: 'faculty',
    _4: 'student',
    _5: 'inquiry',
  },
}

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY_TIME: '6h',
  REFRESH_TOKEN_EXPIRY_TIME: '12h',
  FORGOT_PASSWORD_TOKEN_EXPITY_TIME: '5m',
}

export const API_LIST = {
  'GET /count': ['ADMIN_DASHBOARD', 'STUDENT_DASHBOARD', 'FACULTY_DASHBOARD'],
}
