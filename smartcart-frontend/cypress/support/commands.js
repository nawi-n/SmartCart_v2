// Custom commands for authentication
Cypress.Commands.add('login', (email, password) => {
  // First, try to register a new user
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/api/v1/users/',
    body: {
      email: email,
      password: password,
      first_name: 'Test',
      last_name: 'User'
    }
  }).then((response) => {
    // If registration fails (user might already exist), continue with login
    if (response.status !== 200) {
      console.log('User might already exist, continuing with login');
    }
    
    // Now try to login
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/token',
      form: true,
      body: {
        email: email,  // Updated to use email instead of username
        password: password
      }
    }).then((response) => {
      // Store the token
      window.localStorage.setItem('token', response.body.access_token);
      
      // Visit the home page
      cy.visit('/home');
    });
  });
});

Cypress.Commands.add('logout', () => {
  // Clear the token from localStorage
  window.localStorage.removeItem('token');
  
  // Visit home page first to ensure we're in an authenticated state
  cy.visit('/');
  // Wait for page load
  cy.get('body', { timeout: 10000 }).should('be.visible');
  // Try to find the user menu or logout link/button
  cy.get('body').then($body => {
    if ($body.find('[data-testid="user-menu"]').length) {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
    } else if ($body.find('a:contains("Logout"), button:contains("Logout")').length) {
      cy.get('a:contains("Logout"), button:contains("Logout")').first().click();
    } else {
      // If no logout UI elements found, try direct logout
      cy.visit('/logout');
    }
  });
  // Wait for redirect and verify we're on login page or home page
  cy.url({ timeout: 10000 }).should('satisfy', (url) => {
    return url.includes('/login') || url.endsWith('/');
  });
});

// Custom commands for shopping list operations
Cypress.Commands.add('createShoppingList', (name) => {
  cy.get('[data-testid="create-list"]').click();
  cy.get('[data-testid="list-name-input"]').type(name);
  cy.get('[data-testid="save-list"]').click();
});

Cypress.Commands.add('addItemToList', (productName) => {
  cy.get('[data-testid="add-to-list"]').click();
  cy.get('[data-testid="product-name-input"]').type(productName);
  cy.get('[data-testid="save-item"]').click();
});

// Custom commands for mood and persona
Cypress.Commands.add('selectMood', (mood) => {
  cy.get('[data-testid="mood-selector"]').click();
  cy.get(`[data-testid="mood-${mood}"]`).click();
});

Cypress.Commands.add('updatePersona', (persona) => {
  cy.get('[data-testid="persona-selector"]').click();
  cy.get(`[data-testid="persona-${persona}"]`).click();
});

// Custom commands for voice search
Cypress.Commands.add('startVoiceSearch', () => {
  cy.get('[data-testid="voice-search-button"]').click();
});

Cypress.Commands.add('stopVoiceSearch', () => {
  cy.get('[data-testid="stop-voice-button"]').click();
});

// Custom commands for chat assistant
Cypress.Commands.add('sendChatMessage', (message) => {
  cy.get('[data-testid="chat-input"]').type(message);
  cy.get('[data-testid="send-message"]').click();
});

// Custom commands for analytics
Cypress.Commands.add('navigateToAnalytics', () => {
  cy.get('[data-testid="analytics-link"]').click();
  cy.url().should('include', '/analytics');
}); 