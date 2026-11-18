import { validatePasswordStrength } from './passwordValidator';
import { validateUniversityEmail, validateBasicEmail } from './emailValidator';

describe('validatePasswordStrength', () => {
  test('accepts a strong password', () => {
    expect(validatePasswordStrength('Zq!8vLm#Tr4x').valid).toBe(true);
  });

  test.each([
    ['short', 'Ab1!'],
    ['no uppercase', 'zq!8vlm#tr4x'],
    ['no lowercase', 'ZQ!8VLM#TR4X'],
    ['no number', 'Zq!vLm#Trxx'],
    ['no special character', 'Zq8vLmTr4xab'],
  ])('rejects a password with %s', (_label, pw) => {
    const result = validatePasswordStrength(pw);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('email validation', () => {
  test('accepts a UWU student email', () => {
    expect(validateUniversityEmail('kasun.perera@std.uwu.ac.lk').valid).toBe(true);
  });

  test('rejects a non-university email for students', () => {
    expect(validateUniversityEmail('someone@gmail.com').valid).toBe(false);
  });

  test('rejects malformed emails', () => {
    expect(validateUniversityEmail('not-an-email').valid).toBe(false);
    expect(validateBasicEmail('not-an-email').valid).toBe(false);
  });

  test('accepts any well-formed email for publishers', () => {
    expect(validateBasicEmail('hr@company.lk').valid).toBe(true);
  });
});
