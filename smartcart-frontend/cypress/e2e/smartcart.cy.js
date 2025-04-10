describe('SmartCart E2E Tests', () => {
  const BASE_URL = 'http://localhost:8000/api/v1';
  const TEST_USER = {
    email: 'test@example.com',
    password: 'testpassword123'
  };

  beforeEach(() => {
    // Start with a clean state
    cy.visit('/');
    cy.clearLocalStorage();
    
    // Wait for the page to load
    cy.get('body').should('be.visible');

    // Stub API requests
    cy.intercept('POST', `${BASE_URL}/users/`, {
      statusCode: 200,
      body: { id: 1, email: TEST_USER.email }
    }).as('registerUser');

    cy.intercept('POST', `${BASE_URL}/token`, {
      statusCode: 200,
      body: { access_token: 'test-token' }
    }).as('login');

    cy.intercept('POST', `${BASE_URL}/behaviors/`, {
      statusCode: 200,
      body: { success: true }
    }).as('submitBehavior');
  });

  it('should handle login and authentication', () => {
    // Test login with invalid credentials
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="submit-login"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');

    // Test successful login
    cy.get('[data-testid="email-input"]').clear().type(TEST_USER.email);
    cy.get('[data-testid="password-input"]').clear().type(TEST_USER.password);
    cy.get('[data-testid="submit-login"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should create and manage shopping lists', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Create a new shopping list
    cy.get('[data-testid="create-list-button"]').click();
    cy.get('[data-testid="list-name-input"]').type('Test Shopping List');
    cy.get('[data-testid="submit-list"]').click();
    cy.get('[data-testid="list-name"]').should('contain', 'Test Shopping List');

    // Add items to the list
    cy.get('[data-testid="add-item-button"]').click();
    cy.get('[data-testid="item-name-input"]').type('Milk');
    cy.get('[data-testid="item-quantity-input"]').type('2');
    cy.get('[data-testid="submit-item"]').click();
    cy.get('[data-testid="item-name"]').should('contain', 'Milk');
  });

  it('should handle mood and persona selection', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Select mood
    cy.get('[data-testid="mood-selector"]').click();
    cy.get('[data-testid="mood-happy"]').click();
    cy.get('[data-testid="current-mood"]').should('contain', 'Happy');

    // Update persona
    cy.get('[data-testid="persona-settings"]').click();
    cy.get('[data-testid="persona-healthy"]').click();
    cy.get('[data-testid="current-persona"]').should('contain', 'Health Conscious');
  });

  it('should test voice search functionality', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Start voice search
    cy.get('[data-testid="voice-search-button"]').click();
    cy.get('[data-testid="voice-recording"]').should('be.visible');

    // Simulate voice input
    cy.get('[data-testid="voice-input"]').type('Add milk to my shopping list');
    cy.get('[data-testid="submit-voice"]').click();
    cy.get('[data-testid="item-name"]').should('contain', 'Milk');
  });

  it('should test chat assistant functionality', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Open chat
    cy.get('[data-testid="chat-button"]').click();
    cy.get('[data-testid="chat-window"]').should('be.visible');

    // Send message
    cy.get('[data-testid="chat-input"]').type('What are some healthy snacks?');
    cy.get('[data-testid="send-message"]').click();
    cy.get('[data-testid="chat-message"]').should('contain', 'healthy');
  });

  it('should test analytics features', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Navigate to analytics
    cy.get('[data-testid="analytics-button"]').click();
    cy.url().should('include', '/analytics');

    // Check analytics data
    cy.get('[data-testid="spending-chart"]').should('be.visible');
    cy.get('[data-testid="category-breakdown"]').should('be.visible');
  });

  describe('1. Landing Page Flow', () => {
    it('should display hero banner and handle login', () => {
      // Check hero banner
      cy.get('h1').should('contain', 'SmartCart');
      cy.get('p').should('contain', 'Your AI-powered shopping companion');
      
      // Login form should be visible
      cy.get('form').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');

      // Test login
      cy.get('input[name="email"]').type(TEST_USER.email);
      cy.get('input[name="password"]').type(TEST_USER.password);
      cy.get('button[type="submit"]').click();

      // Wait for login request
      cy.wait('@login');

      // Should redirect to home page
      cy.url().should('include', '/home', { timeout: 10000 });
    });
  });

  describe('2. Sidebar: Persona + Mood Panel', () => {
    beforeEach(() => {
      // Login first
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should display persona information', () => {
      // Check persona card
      cy.get('[data-testid="persona-card"]').should('exist');
      cy.get('[data-testid="persona-traits"]').should('exist');
    });

    it('should handle mood selection', () => {
      // Check mood picker
      cy.get('[data-testid="mood-picker"]').should('exist');
      
      // Select a mood
      cy.get('[data-testid="mood-happy"]').click();
      
      // Verify mood was updated
      cy.get('[data-testid="current-mood"]').should('contain', 'happy');
    });
  });

  describe('3. Main Product Listing', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should display product recommendations', () => {
      // Check product grid
      cy.get('[data-testid="product-grid"]').should('exist');
      cy.get('[data-testid="product-card"]').should('have.length.gt', 0);

      // Check product card elements
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('exist');
        cy.get('[data-testid="product-brand"]').should('exist');
        cy.get('[data-testid="product-image"]').should('exist');
        cy.get('[data-testid="match-percentage"]').should('exist');
      });
    });

    it('should show product storytelling and explanation', () => {
      // Click on a product
      cy.get('[data-testid="product-card"]').first().click();

      // Check for storytelling modal
      cy.get('[data-testid="storytelling-modal"]').should('exist');
      cy.get('[data-testid="product-story"]').should('exist');
      cy.get('[data-testid="product-explanation"]').should('exist');
    });
  });

  describe('4. Voice-Based Search', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should handle voice search', () => {
      // Navigate to voice search
      cy.visit('/voice-search');

      // Check voice search interface
      cy.get('[data-testid="voice-search"]').should('exist');
      
      // Mock voice input
      cy.get('[data-testid="voice-input"]').type('Show me colorful products');
      
      // Check results
      cy.get('[data-testid="search-results"]').should('exist');
    });
  });

  describe('5. Conversational Assistant', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should handle chat interactions', () => {
      // Open chat
      cy.get('[data-testid="chat-button"]').click();
      
      // Check chat interface
      cy.get('[data-testid="chat-interface"]').should('exist');
      
      // Send message
      cy.get('[data-testid="chat-input"]').type('What do you recommend?');
      cy.get('[data-testid="send-message"]').click();
      
      // Check response
      cy.get('[data-testid="chat-messages"]').should('contain', 'recommend');
    });
  });

  describe('6. Behavior Logging', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should log product interactions', () => {
      // Click on a product
      cy.get('[data-testid="product-card"]').first().click();
      
      // Verify behavior was logged
      cy.wait('@submitBehavior').its('request.body').should('include', {
        action_type: 'click'
      });
    });

    it('should log mood changes', () => {
      // Change mood
      cy.get('[data-testid="mood-happy"]').click();
      
      // Verify behavior was logged
      cy.wait('@submitBehavior').its('request.body').should('include', {
        action_type: 'mood_change'
      });
    });
  });

  describe('7. Shopping List', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should create and manage shopping lists', () => {
      // Create shopping list
      cy.get('[data-testid="create-list"]').click();
      cy.get('[data-testid="list-name-input"]').type('Test List');
      cy.get('[data-testid="save-list"]').click();

      // Add item to list
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="add-to-list"]').click();
      });

      // Check list analysis
      cy.get('[data-testid="analyze-list"]').click();
      cy.get('[data-testid="list-analysis"]').should('exist');
    });
  });

  describe('8. Analytics', () => {
    beforeEach(() => {
      cy.login(TEST_USER.email, TEST_USER.password);
    });

    it('should display all analytics data', () => {
      // Check shopping patterns
      cy.get('[data-testid="shopping-patterns"]').should('exist');
      
      // Check mood trends
      cy.get('[data-testid="mood-trends"]').should('exist');
      
      // Check categories distribution
      cy.get('[data-testid="categories-distribution"]').should('exist');
      
      // Check recommendation performance
      cy.get('[data-testid="recommendation-performance"]').should('exist');
    });
  });
}); 