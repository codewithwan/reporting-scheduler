import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`API documentation available at http://localhost:${PORT}/api/v1/api-docs`);
});
