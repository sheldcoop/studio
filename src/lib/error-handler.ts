export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: any): { error: string; statusCode: number } {
  console.error('Auth error:', error);

  // Firebase Auth errors
  if (error.code?.startsWith('auth/')) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return { error: 'This email is already registered', statusCode: 400 };
      case 'auth/invalid-email':
        return { error: 'Invalid email address', statusCode: 400 };
      case 'auth/operation-not-allowed':
        return { error: 'This sign-in method is not enabled', statusCode: 403 };
      case 'auth/weak-password':
        return { error: 'Password is too weak', statusCode: 400 };
      case 'auth/user-disabled':
        return { error: 'This account has been disabled', statusCode: 403 };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return { error: 'Invalid email or password', statusCode: 401 };
      case 'auth/too-many-requests':
        return { error: 'Too many attempts. Please try again later', statusCode: 429 };
      case 'auth/network-request-failed':
        return { error: 'Network error. Please check your connection', statusCode: 503 };
      default:
        return { error: 'Authentication failed', statusCode: 500 };
    }
  }

  // Custom AuthError
  if (error instanceof AuthError) {
    return { error: error.message, statusCode: error.statusCode };
  }

  // Generic error
  return { error: 'An unexpected error occurred', statusCode: 500 };
}
