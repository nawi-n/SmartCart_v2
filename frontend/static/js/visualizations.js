// Chart configurations
const chartConfigs = {
    shoppingPatterns: {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Shopping Frequency',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Shopping Activity Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    },
    moodTrends: {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Mood Intensity',
                data: [],
                borderColor: 'rgb(16, 185, 129)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Mood Trends Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    },
    categories: {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(139, 92, 246)',
                    'rgb(239, 68, 68)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Product Categories Distribution'
                }
            }
        }
    },
    recommendations: {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Recommendation Score (%)',
                data: [],
                backgroundColor: 'rgb(59, 130, 246)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Recommendation Performance'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    }
};

// Initialize charts
function initializeCharts() {
    const charts = {};
    Object.keys(chartConfigs).forEach(chartId => {
        const canvas = document.getElementById(`${chartId}Chart`);
        if (canvas) {
            charts[chartId] = new Chart(canvas, chartConfigs[chartId]);
        }
    });
    return charts;
}

// Update chart data
async function updateChartData(charts) {
    try {
        // Update shopping patterns
        const patternsResponse = await fetch('/api/analytics/shopping-patterns');
        const patternsData = await patternsResponse.json();
        charts.shoppingPatterns.data.labels = patternsData.dates;
        charts.shoppingPatterns.data.datasets[0].data = patternsData.frequencies;
        charts.shoppingPatterns.update();

        // Update mood trends
        const moodResponse = await fetch('/api/analytics/mood-trends');
        const moodData = await moodResponse.json();
        charts.moodTrends.data.labels = moodData.dates;
        charts.moodTrends.data.datasets[0].data = moodData.intensities;
        charts.moodTrends.update();

        // Update categories distribution
        const categoriesResponse = await fetch('/api/analytics/categories');
        const categoriesData = await categoriesResponse.json();
        charts.categories.data.labels = categoriesData.categories;
        charts.categories.data.datasets[0].data = categoriesData.counts;
        charts.categories.update();

        // Update recommendation performance
        const recommendationsResponse = await fetch('/api/analytics/recommendations');
        const recommendationsData = await recommendationsResponse.json();
        charts.recommendations.data.labels = recommendationsData.products;
        charts.recommendations.data.datasets[0].data = recommendationsData.scores;
        charts.recommendations.update();
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
}

// Initialize interactive features
function initializeInteractiveFeatures() {
    // Quick action buttons
    const quickActionButtons = {
        'find-deals': async () => {
            try {
                const response = await fetch('/api/quick-actions/find-deals', { method: 'POST' });
                const data = await response.json();
                showUpdate('Found best deals for you!', 'success');
            } catch (error) {
                console.error('Error finding deals:', error);
                showUpdate('Failed to find deals', 'error');
            }
        },
        'healthy-options': async () => {
            try {
                const response = await fetch('/api/quick-actions/healthy-options', { method: 'POST' });
                const data = await response.json();
                showUpdate('Found healthy options for you!', 'success');
            } catch (error) {
                console.error('Error finding healthy options:', error);
                showUpdate('Failed to find healthy options', 'error');
            }
        },
        'budget-friendly': async () => {
            try {
                const response = await fetch('/api/quick-actions/budget-friendly', { method: 'POST' });
                const data = await response.json();
                showUpdate('Found budget-friendly items!', 'success');
            } catch (error) {
                console.error('Error finding budget-friendly items:', error);
                showUpdate('Failed to find budget-friendly items', 'error');
            }
        },
        'trending': async () => {
            try {
                const response = await fetch('/api/quick-actions/trending', { method: 'POST' });
                const data = await response.json();
                showUpdate('Found trending items!', 'success');
            } catch (error) {
                console.error('Error finding trending items:', error);
                showUpdate('Failed to find trending items', 'error');
            }
        }
    };

    // Add event listeners to quick action buttons
    Object.entries(quickActionButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
}

// Show real-time update
function showUpdate(message, type = 'info') {
    const updateDiv = document.getElementById('real-time-updates');
    const updateContent = document.getElementById('update-content');
    
    updateContent.textContent = message;
    updateDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        updateDiv.classList.add('hidden');
    }, 5000);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const charts = initializeCharts();
    initializeInteractiveFeatures();
    
    // Update charts every 30 seconds
    setInterval(() => updateChartData(charts), 30000);
    
    // Initial data load
    updateChartData(charts);
    
    // Close updates button
    document.getElementById('close-updates').addEventListener('click', () => {
        document.getElementById('real-time-updates').classList.add('hidden');
    });
}); 