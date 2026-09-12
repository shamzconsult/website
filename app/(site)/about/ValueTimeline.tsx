import type React from "react";

interface TimelineValue {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  year?: string;
  step?: number;
}

interface ValuesTimelineProps {
  values: TimelineValue[];
  className?: string;
}

export function ValueTimeline({ values, className }: ValuesTimelineProps) {
  return (
    <section
      className="py-20 relative bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/bg2.jpg')",
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-[#1e1e1e]/80 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className=" text-3xl md:text-4xl font-bold mb-4">
            Our Values Journey
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            These core principles guide every decision we make and every project
            we undertake, developed through our journey of growth.
          </p>
        </div>

        <div className={`relative max-w-4xl mx-auto ${className || ""}`}>
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-0.5 top-0 h-full w-0.5 bg-orange-600" />

          {values.map((value, index) => (
            <div
              key={index}
              className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot with icon */}
              <div className="relative z-10 hidden md:flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 border-4  shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                <value.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content card */}
              <div
                className={`flex-1 ml-8 md:ml-0 ${
                  index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}
              >
                <div className="bg-white/10 border border-white backdrop-blur-sm rounded-lg p-6">
                  <div>
                    {value.step && (
                      <div className="text-amber-400 font-semibold text-sm mb-2">
                        Step {value.step}
                      </div>
                    )}
                    {value.year && (
                      <div className="text-amber-400 font-semibold text-sm mb-2">
                        {value.year}
                      </div>
                    )}
                    <h3 className="text-white text-xl mb-3 font-semibold">
                      {value.title}
                    </h3>
                    <p className="text-blue-200 text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Spacer for alternating layout on desktop */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
