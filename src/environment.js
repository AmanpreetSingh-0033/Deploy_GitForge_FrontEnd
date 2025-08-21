let IS_PROD = true;

const server = IS_PROD
  ? "https://gitforge-backend-deploy-render.onrender.com"
  : "http://localhost:3000";

export default server;
