"use client"; // This is important to declare it as a Client Component

import { useEffect } from "react";

export default function TallyScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Clean up on unmount
    };
  }, []);

  return null; // This component only loads the script
}
