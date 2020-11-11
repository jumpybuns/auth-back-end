require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token;
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [
        {
          'id': 1,
          'todo': 'sweep',
          'completed': true,
          'owner_id': 1
        },
        {
          'id': 2,
          'todo': 'dust',
          'completed': false,
          'owner_id': 1
        },
        {
          'id': 3,
          'todo': 'clean',
          'completed': true,
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
