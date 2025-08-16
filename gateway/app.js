const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express()

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
    next();
});

app.use("/user", expressProxy('http://localhost:3001'))
app.use("/captain", expressProxy('http://localhost:3002'))
app.use("/ride", expressProxy('http://localhost:3003'))

// Catch proxy errors
app.use((err, req, res, next) => {
    console.error('[Gateway Error]', err);
    res.status(500).json({ error: 'Gateway error', details: err.message });
});

// Catch 404s
app.use((req, res) => {
    console.warn(`[Gateway] 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => {
    console.log('gateway service is running on 3000')
})