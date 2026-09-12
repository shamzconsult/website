"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, CheckCircle, Target } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";

type Service = {
  icon: keyof typeof Icons | string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  process: string[];
};

export default function ServiceClient({ service }: { service: Service }) {
  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = ["/bg1.jpg", "/bg2.jpg", "/shamz.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const IconComponent = Icons[
    service.icon as keyof typeof Icons
  ] as React.ComponentType<{
    className?: string;
  }>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section
        className="relative py-20 text-white flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${heroImages[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 p-6 rounded-full">
              {IconComponent && <IconComponent className="h-16 w-16" />}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {service.longDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Features */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 flex items-center">
                  <CheckCircle className="h-6 w-6 text-orange-600 mr-3" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 flex items-center">
                  <Target className="h-6 w-6 text-orange-600 mr-3" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Process */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 flex items-center">
                  <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                  Our Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 mr-3 mt-0.5 flex-shrink-0"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="py-12">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Let&apos;s discuss how our {service.title.toLowerCase()}{" "}
                  services can help your organization achieve its goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* <a
                    href="mailto:shamzbridgeconsult@gmail.com?subject=Contacting%20you%20about%20hiring%20service%20with%20Shamzbridge&body=Hi, %0D%0A%0D%0A"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 rounded-md font-medium text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Contact Us Today
                  </a> */}

                  <Link href="/shamzbridge-profile.pdf" target="_blank" rel="noopener noreferrer">
                    <Button
                      // asChild
                      variant="default"
                      size="lg"
                      className=" flex bg-orange-600 hover:bg-orange-800 text-white  px-6 py-2 rounded-md font-medium text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Book className="mr-2 h-5 w-5" />
                        View Our Profile
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 bg-transparent"
                    >
                      View All Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
