const express = require('express');
const app = express();

app.use(express.json());

// TODO: (Codex task) Implement the /health endpoint here
// It must return HTTP 200 with { status: 'up' }

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Triad Minimal API running on port ${PORT}`));
}
