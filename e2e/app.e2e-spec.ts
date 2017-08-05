import { TeGoeSportsPage } from './app.po';

describe('te-goe-sports App', () => {
  let page: TeGoeSportsPage;

  beforeEach(() => {
    page = new TeGoeSportsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
