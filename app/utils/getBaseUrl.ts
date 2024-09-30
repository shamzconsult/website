export const getBaseUrl = () => {
  const isProd = process.env.NODE_ENV === "production";
  const productionBaseUrl = "https://www.shamzbridgeconsult.org";
  const developmentBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return isProd ? productionBaseUrl : developmentBaseUrl;
};
