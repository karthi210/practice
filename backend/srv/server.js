const cds = require('@sap/cds');
const express = require('express');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();

// Serve static files from frontend in development
if (process.env.NODE_ENV === 'development') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}

// Connect to database
cds.connect();

// Serve CDS services
cds.serve('EmployeeService')
    .at('/odata/v4/ess')
    .in(app)
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'ess-backend', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`ESS Backend running on http://localhost:${PORT}`);
    console.log(`OData Service: http://localhost:${PORT}/odata/v4/ess`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});