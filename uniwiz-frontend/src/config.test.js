describe('API_BASE_URL', () => {
  const original = process.env.REACT_APP_API_URL;
  afterEach(() => {
    if (original === undefined) delete process.env.REACT_APP_API_URL;
    else process.env.REACT_APP_API_URL = original;
  });

  const load = () => {
    let value;
    jest.isolateModules(() => { value = require('./config').API_BASE_URL; });
    return value;
  };

  test('defaults to the local development backend', () => {
    delete process.env.REACT_APP_API_URL;
    expect(load()).toBe('http://uniwiz-backend.test/api');
  });

  test('uses REACT_APP_API_URL and strips trailing slashes', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com/api/';
    expect(load()).toBe('https://api.example.com/api');
  });
});
