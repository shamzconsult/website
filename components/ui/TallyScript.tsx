import Script from "next/script";

export default function TallyScript() {
  return (
    <>
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive" 
      />
    </>
  );
}
