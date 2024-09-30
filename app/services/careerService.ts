import { getBaseUrl } from "../utils/getBaseUrl";


export const getAllJob = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      // const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/career`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Error found while fetching");
      }
      return res.json();
    } catch (error) {
      console.log("Error loading data", error);
      throw error;
    }
  };
  