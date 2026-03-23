import assert from 'node:assert/strict';
import test from 'node:test';

import { isRevalidationAuthorized } from '@/app/api/v1/revalidate-api/route';

test('returns true for a matching bearer token', () => {
  assert.equal(isRevalidationAuthorized('Bearer secret-key', 'secret-key'), true);
});

test('returns false when the authorization header is missing', () => {
  assert.equal(isRevalidationAuthorized(null, 'secret-key'), false);
});

test('returns false when the expected key is missing', () => {
  assert.equal(isRevalidationAuthorized('Bearer secret-key'), false);
});

test('returns false for a non-matching bearer token', () => {
  assert.equal(isRevalidationAuthorized('Bearer wrong-key', 'secret-key'), false);
});
