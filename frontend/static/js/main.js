// Global variables
let currentCustomerId = null;
let currentMood = 'neutral';
let isVoiceSearchActive = false;

// API Configuration
const API_BASE_URL = '/api/v1';
let updateInterval = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const profileSection = document.getElementById('profileSection');
const personaTraits = document.getElementById('personaTraits');
const moodSelector = document.getElementById('moodSelector');
const productGrid = document.getElementById('productGrid');
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const shoppingListsContainer = document.getElementById('shopping-lists');
const recommendationsContainer = document.getElementById('recommendations');
const productsContainer = document.getElementById('products');
const createListButton = document.getElementById('create-list');
const personaContainer = document.getElementById('persona');
const moodContainer = document.getElementById('mood');
const behaviorsContainer = document.getElementById('behaviors');
const realTimeUpdates = document.getElementById('real-time-updates');
const updateContent = document.getElementById('update-content');
const closeUpdates = document.getElementById('close-updates');

// State
let currentUser = null;
let shoppingLists = [];
let recommendations = [];
let products = [];
let persona = null;
let mood = null;
let behaviors = [];
let lastUpdateTime = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login button click
    loginBtn.addEventListener('click', handleLogin);
    
    // Mood selector buttons
    moodSelector.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => handleMoodChange(btn.dataset.mood));
    });
    
    // Chat functionality
    chatToggle.addEventListener('click', toggleChat);
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Voice search
    voiceSearchBtn.addEventListener('click', toggleVoiceSearch);

    // Shopping List functionality
    createListButton.addEventListener('click', async () => {
        const listName = prompt('Enter shopping list name:');
        if (listName) {
            try {
                await fetchAPI('/shopping-lists', {
                    method: 'POST',
                    body: JSON.stringify({ name: listName }),
                });
                await loadShoppingLists();
                showUpdate(`Created new shopping list: ${listName}`, 'success');
            } catch (error) {
                console.error('Error creating shopping list:', error);
                showUpdate('Failed to create shopping list', 'error');
            }
        }
    });

    // Real-time updates
    closeUpdates.addEventListener('click', () => {
        realTimeUpdates.classList.add('hidden');
        updateContent.innerHTML = '';
    });
});

// Functions
async function handleLogin() {
    // For demo purposes, use a hardcoded customer ID
    currentCustomerId = 'CUST001';
    
    // Show profile section
    profileSection.classList.remove('hidden');
    
    // Generate persona
    await generatePersona();
    
    // Load recommendations
    await loadRecommendations();
}

async function generatePersona() {
    try {
        const response = await fetch('/api/generate_persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customer_id: currentCustomerId }),
        });
        
        const data = await response.json();
        
        // Display persona traits
        personaTraits.innerHTML = data.persona_traits
            .map(trait => `<span class="persona-trait">${trait}</span>`)
            .join('');
        
    } catch (error) {
        console.error('Error generating persona:', error);
    }
}

function handleMoodChange(mood) {
    currentMood = mood;
    
    // Update active state of mood buttons
    moodSelector.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });
    
    // Reload recommendations with new mood
    loadRecommendations();
}

async function loadRecommendations() {
    try {
        recommendations = await fetchAPI('/recommendations');
        renderRecommendations();
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

function renderRecommendations() {
    recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold">${rec.product.name}</h3>
                <span class="recommendation-score bg-blue-100 text-blue-800">
                    ${(rec.score * 100).toFixed(0)}% Match
                </span>
            </div>
            <p class="text-sm text-gray-600">${rec.reason}</p>
        </div>
    `).join('');
}

function toggleChat() {
    chatWindow.classList.toggle('hidden');
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                customer_id: currentCustomerId,
            }),
        });
        
        const data = await response.json();
        
        // Add assistant response to chat
        addChatMessage(data.response, 'assistant');
        
    } catch (error) {
        console.error('Error sending chat message:', error);
        addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `
        <div class="chat-bubble ${sender}">${message}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleVoiceSearch() {
    if (!isVoiceSearchActive) {
        startVoiceSearch();
    } else {
        stopVoiceSearch();
    }
}

function startVoiceSearch() {
    // This is a simplified version. In a real implementation,
    // you would use the Web Speech API
    isVoiceSearchActive = true;
    voiceSearchBtn.classList.add('voice-search-active');
    
    // Simulate voice recognition
    setTimeout(() => {
        const searchQuery = "Find me a new laptop";
        performVoiceSearch(searchQuery);
    }, 2000);
}

function stopVoiceSearch() {
    isVoiceSearchActive = false;
    voiceSearchBtn.classList.remove('voice-search-active');
}

async function performVoiceSearch(query) {
    try {
        const response = await fetch('/api/recommend_products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: currentCustomerId,
                query: query,
            }),
        });
        
        const products = await response.json();
        
        // Display search results
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="match-score ${getMatchScoreClass(product.match_score)}">
                        Match: ${(product.match_score * 100).toFixed(0)}%
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error performing voice search:', error);
    }
}

// Shopping List Functions
async function loadShoppingLists() {
    try {
        shoppingLists = await fetchAPI('/shopping-lists');
        renderShoppingLists();
    } catch (error) {
        console.error('Error loading shopping lists:', error);
    }
}

function renderShoppingLists() {
    shoppingListsContainer.innerHTML = shoppingLists.map(list => `
        <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold">${list.name}</h3>
            <div class="mt-2">
                ${list.items.map(item => `
                    <div class="shopping-list-item">
                        <span>${item.product.name}</span>
                        <span>${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Product Functions
async function loadProducts() {
    try {
        products = await fetchAPI('/products');
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card bg-white rounded-lg shadow">
            <img src="${product.image_url}" alt="${product.name}">
            <div class="p-4">
                <h3 class="font-semibold">${product.name}</h3>
                <p class="text-gray-600 text-sm">${product.description}</p>
                <div class="mt-2 flex justify-between items-center">
                    <span class="font-bold">$${product.price}</span>
                    <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onclick="addToShoppingList(${product.id})">
                        Add to List
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
}

// Real-time Updates
function showUpdate(message, type = 'info') {
    const updateElement = document.createElement('div');
    updateElement.className = `p-2 mb-2 rounded ${
        type === 'info' ? 'bg-blue-50 text-blue-800' :
        type === 'success' ? 'bg-green-50 text-green-800' :
        type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
        'bg-red-50 text-red-800'
    }`;
    updateElement.textContent = message;
    updateContent.appendChild(updateElement);
    realTimeUpdates.classList.remove('hidden');
}

function startRealTimeUpdates() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(async () => {
        try {
            const updates = await fetchAPI('/updates');
            if (updates.length > 0) {
                updates.forEach(update => {
                    if (!lastUpdateTime || new Date(update.timestamp) > lastUpdateTime) {
                        showUpdate(update.message, update.type);
                        lastUpdateTime = new Date(update.timestamp);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching updates:', error);
        }
    }, 5000); // Check for updates every 5 seconds
}

// Agent-specific Functions
async function loadPersona() {
    try {
        persona = await fetchAPI('/users/me/persona');
        renderPersona();
    } catch (error) {
        console.error('Error loading persona:', error);
    }
}

function renderPersona() {
    if (!persona) return;
    
    personaContainer.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-700">Personality Traits</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${persona.traits.map(trait => `
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            ${trait}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div>
                <h3 class="font-semibold text-gray-700">Interests</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${persona.interests.map(interest => `
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            ${interest}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div>
                <h3 class="font-semibold text-gray-700">Shopping Style</h3>
                <p class="mt-2 text-gray-600">${persona.shopping_style.style}</p>
            </div>
        </div>
    `;

    // Render collaborative insights
    if (persona.insights) {
        document.getElementById('persona-collaboration').innerHTML = `
            <p class="mb-2">${persona.insights.assessment}</p>
            <div class="space-y-1">
                ${persona.insights.recommendations.split('\n').map(rec => `
                    <p class="flex items-center">
                        <span class="mr-2">•</span>
                        ${rec}
                    </p>
                `).join('')}
            </div>
        `;
    }
}

async function loadMood() {
    try {
        mood = await fetchAPI('/users/me/mood');
        renderMood();
    } catch (error) {
        console.error('Error loading mood:', error);
    }
}

function renderMood() {
    if (!mood) return;
    
    const moodEmoji = {
        'happy': '😊',
        'excited': '🤩',
        'neutral': '😐',
        'stressed': '😰',
        'sad': '😢'
    }[mood.mood] || '😐';
    
    moodContainer.innerHTML = `
        <div class="space-y-4">
            <div class="text-4xl text-center">${moodEmoji}</div>
            <div class="text-center">
                <h3 class="font-semibold text-gray-700">${mood.mood}</h3>
                <p class="text-gray-600">Intensity: ${mood.intensity}/10</p>
            </div>
            <div>
                <h3 class="font-semibold text-gray-700">Context</h3>
                <p class="mt-2 text-gray-600">${mood.context}</p>
            </div>
        </div>
    `;

    // Render mood insights
    if (mood.insights) {
        document.getElementById('mood-collaboration').innerHTML = `
            <p class="mb-2">${mood.insights.assessment}</p>
            <div class="space-y-1">
                ${mood.insights.recommendations.split('\n').map(rec => `
                    <p class="flex items-center">
                        <span class="mr-2">•</span>
                        ${rec}
                    </p>
                `).join('')}
            </div>
        `;
    }
}

async function loadBehaviors() {
    try {
        behaviors = await fetchAPI('/users/me/behaviors');
        renderBehaviors();
    } catch (error) {
        console.error('Error loading behaviors:', error);
    }
}

function renderBehaviors() {
    if (!behaviors.length) return;
    
    behaviorsContainer.innerHTML = `
        <div class="space-y-2">
            ${behaviors.map(behavior => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                        <span class="font-semibold">${behavior.action_type}</span>
                        <span class="text-gray-600">${behavior.product.name}</span>
                    </div>
                    <span class="text-sm text-gray-500">
                        ${new Date(behavior.created_at).toLocaleTimeString()}
                    </span>
                </div>
            `).join('')}
        </div>
    `;

    // Render behavior insights
    if (behaviors[0]?.insights) {
        document.getElementById('behavior-collaboration').innerHTML = `
            <p class="mb-2">${behaviors[0].insights.assessment}</p>
            <div class="space-y-1">
                ${behaviors[0].insights.recommendations.split('\n').map(rec => `
                    <p class="flex items-center">
                        <span class="mr-2">•</span>
                        ${rec}
                    </p>
                `).join('')}
            </div>
        `;
    }
}

// Initialize
async function initialize() {
    await Promise.all([
        loadPersona(),
        loadMood(),
        loadBehaviors(),
        loadShoppingLists(),
        loadRecommendations(),
        loadProducts(),
    ]);
    startRealTimeUpdates();
}

// Start the application
initialize(); 