export const getBaseUrl = () => {
    const isProd = process.env.NODE_ENV === 'production'; 
    const productionBaseUrl = "https://www.shamzbridgeconsult.org";
    const developmentBaseUrl =  typeof window !== 'undefined' ? window.location.href : '';
    
    return isProd ? productionBaseUrl : developmentBaseUrl; 
};
  