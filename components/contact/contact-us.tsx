"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("All field are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        alert("message sent successfully");
      } else {
        throw new Error("contact failed to send");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="btn text-white bg-blue-600 hover:bg-orange-700 w-full mb-4 sm:w-auto sm:mb-0">
          Let's talk
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Send us a message.
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Interested in our services? Let's start a conversation! Send us a
            message today.
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-[15px] flex flex-col items-start  gap-1">
              <label
                className="text-violet11  text-right text-[15px] font-medium"
                htmlFor="name"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter your full name"
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_0.3px] outline-none"
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex flex-col items-start  gap-1">
              <label
                className="text-violet11  text-right text-[15px] font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Enter your email address"
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_0.3px] outline-none"
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex flex-col items-start gap-1">
              <label
                className="text-violet11  text-right text-[15px] font-medium"
                htmlFor="username"
              >
                Message
              </label>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                rows={6}
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_0.3px] outline-none "
                placeholder="write your message here..."
                required
              />
            </fieldset>
            <div className="flex justify-start">
              <button
                type="submit"
                className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
              >
                Send message
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
