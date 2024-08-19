"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      alert("field is required");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSubmitted(true); // Set the submission state to true
        setEmail("");
      } else {
        throw new Error("subscription failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div
            className="relative bg-gray-900 rounded py-10 px-8 md:py-16 md:px-12 shadow-2xl overflow-hidden"
            data-aos="zoom-y-out"
          >
            <div
              className="absolute right-0 bottom-0 pointer-events-none hidden lg:block"
              aria-hidden="true"
            >
              <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
                {/* SVG content */}
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-center">
              <div className="text-center lg:text-left lg:max-w-xl">
                <h3 className="h3 text-white mb-2">Be the First to Know.</h3>
                <p className="text-gray-300 text-lg mb-6">
                  Subscribe to Receive Our Latest News and Updates.
                </p>

                {/* Conditionally render success message or form */}
                {isSubmitted ? (
                  <p className="text-lg text-orange-600  mt-3 font-bold">
                    You’ve subscribed to the newsletter successfully🎉
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="form-input w-full appearance-none bg-gray-800 border border-gray-700 focus:border-gray-600 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-gray-500"
                        placeholder="Your email…"
                        aria-label="Your email…"
                        required
                      />
                      <button
                        className="btn text-white bg-orange-600 hover:bg-orange-700 shadow"
                        type="submit"
                      >
                        Subscribe.
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                      No spam. You can unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
