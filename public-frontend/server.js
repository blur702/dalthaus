const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Serve uploaded images from the backend uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// For single-page app routes (if needed in the future)
// Don't use catch-all since we have multiple HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Public frontend server running on http://localhost:${PORT}`);
});