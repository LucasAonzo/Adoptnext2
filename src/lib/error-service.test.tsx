import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleError, getErrorMessage } from './error-service';
import { toast } from 'sonner';

// Mock the toast library
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }
}));

describe('Error Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('handleError', () => {
    it('should log error to console', () => {
      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Call handleError with a simple error
      const error = new Error('Test error');
      handleError(error);
      
      // Verify console.error was called with the error
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', error, expect.any(Object));
      
      // Reset mock
      consoleErrorSpy.mockRestore();
    });
    
    it('should show error toast by default', () => {
      // Create an error
      const error = new Error('Test error');
      
      // Call handleError
      handleError(error);
      
      // Verify toast.error was called
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Test error');
    });
    
    it('should use custom user message when provided', () => {
      // Create an error
      const error = new Error('Test error');
      const userMessage = 'Friendly error message';
      
      // Call handleError with custom message
      handleError(error, { userMessage });
      
      // Verify toast.error was called with custom message
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(userMessage);
    });
    
    it('should use appropriate toast method based on severity', () => {
      // Create an error
      const error = new Error('Test error');
      
      // Call handleError with different severities
      handleError(error, { severity: 'info' });
      expect(toast.info).toHaveBeenCalledTimes(1);
      
      handleError(error, { severity: 'warning' });
      expect(toast.warning).toHaveBeenCalledTimes(1);
      
      handleError(error, { severity: 'error' });
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error message');
      const message = getErrorMessage(error);
      expect(message).toBe('Test error message');
    });
    
    it('should handle string errors', () => {
      const error = 'String error message';
      const message = getErrorMessage(error);
      expect(message).toBe('String error message');
    });
    
    it('should handle object with message property', () => {
      const error = { message: 'Object error message' };
      const message = getErrorMessage(error);
      expect(message).toBe('Object error message');
    });
    
    it('should return default message for unknown error types', () => {
      const error = null;
      const message = getErrorMessage(error);
      expect(message).toBe('An unexpected error occurred');
    });
  });
}); 