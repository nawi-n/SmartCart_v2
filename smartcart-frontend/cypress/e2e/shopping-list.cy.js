describe('Shopping List Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  afterEach(() => {
    cy.logout();
  });

  it('should create a new shopping list', () => {
    const listName = 'Weekly Groceries';
    cy.createShoppingList(listName);
    cy.get('[data-testid="shopping-list"]', { timeout: 10000 }).should('be.visible').should('contain', listName);
  });

  it('should add items to shopping list', () => {
    const productName = 'Milk';
    cy.createShoppingList('Test List');
    cy.addItemToList(productName);
    cy.get('[data-testid="shopping-list-items"]', { timeout: 10000 }).should('be.visible').should('contain', productName);
  });

  it('should remove items from shopping list', () => {
    const productName = 'Bread';
    cy.createShoppingList('Test List');
    cy.addItemToList(productName);
    cy.get(`[data-testid="remove-item-${productName}"]`, { timeout: 10000 }).should('be.visible').click();
    cy.get('[data-testid="shopping-list-items"]').should('not.contain', productName);
  });

  it('should mark items as purchased', () => {
    const productName = 'Eggs';
    cy.createShoppingList('Test List');
    cy.addItemToList(productName);
    cy.get(`[data-testid="toggle-purchased-${productName}"]`, { timeout: 10000 }).should('be.visible').click();
    cy.get(`[data-testid="item-${productName}"]`).should('have.class', 'purchased');
  });

  it('should update item quantity', () => {
    const productName = 'Apples';
    cy.createShoppingList('Test List');
    cy.addItemToList(productName);
    cy.get(`[data-testid="quantity-${productName}"]`, { timeout: 10000 }).should('be.visible').clear().type('5');
    cy.get(`[data-testid="quantity-${productName}"]`).should('have.value', '5');
  });

  it('should show item recommendations based on mood', () => {
    cy.createShoppingList('Test List');
    cy.selectMood('happy');
    cy.get('[data-testid="recommendations"]', { timeout: 10000 }).should('be.visible');
  });

  it('should show item recommendations based on persona', () => {
    cy.createShoppingList('Test List');
    cy.updatePersona('health-conscious');
    cy.get('[data-testid="recommendations"]', { timeout: 10000 }).should('be.visible');
  });

  it('should allow voice search for items', () => {
    cy.createShoppingList('Test List');
    cy.startVoiceSearch();
    cy.get('[data-testid="voice-search-status"]', { timeout: 10000 }).should('be.visible').should('contain', 'Listening');
    cy.stopVoiceSearch();
  });

  it('should show shopping list analytics', () => {
    cy.createShoppingList('Test List');
    cy.addItemToList('Milk');
    cy.addItemToList('Bread');
    cy.navigateToAnalytics();
    cy.get('[data-testid="shopping-analytics"]', { timeout: 10000 }).should('be.visible');
  });
}); 