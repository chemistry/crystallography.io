import { handler } from './index';

let originalConsoleInfo = console.info;
let originalConsoleError = console.error;

describe('Get Structures List', () => {

  beforeEach(()=> {
      jest.clearAllMocks();
      console.info = () => {}
      console.error = () => {}
  });
  afterEach(()=> {
      console.info = originalConsoleInfo;
      console.error = originalConsoleError;
  });

  test('should define function', ()=> {
      expect(handler).toBeDefined();
  });
});
