import { getBaseUrl } from "../utils/getBaseUrl";


export const getAllJob = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/career`, {
        cache: "no-store",
      });
      if (!res.ok) {
        console.error(`Fetch error: ${res.status} - ${res.statusText}`);
        throw new Error("Error found while fetching");
      }


      return res.json();
    } catch (error) {
      console.log("Error loading data", error);
      throw error; 
  }
};

export const getJobById = async (_id: string) => {
  try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`/api/career/${_id}`, {
          cache: "no-store",
      });
      if (!res.ok) {
          throw new Error("Error fetching job");
      }
      return res.json();
  } catch (error) {
      console.error("Error loading data", error);
      return null;
  }
};