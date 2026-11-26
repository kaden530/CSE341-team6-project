import { describe, expect, test } from 'vitest';
import request from 'supertest';

process.env.SESSION_SECRET ||= 'test-session-secret';
const { default: app } = await import('../app.js');

describe('authentication pages', () => {
  test('GET /register renders the registration form', async () => {
    const response = await request(app).get('/register');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Create an Account');
    expect(response.text).toContain('name="name"');
    expect(response.text).toContain('name="email"');
    expect(response.text).toContain('name="password"');
  });

  test('GET /login renders the sign-in form', async () => {
    const response = await request(app).get('/login');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Sign In');
    expect(response.text).toContain('name="email"');
    expect(response.text).toContain('name="password"');
  });
});
