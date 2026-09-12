
import { Metadata } from "next"
import ContactUs from "@/components/contact/contact-us"


export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Leading a national effort to promote responsible battery recycling in Nigeria. A network of collectors, recyclers",
}


export default function ContactPage() {
  return <ContactUs/>
 
}