import { notFound } from "next/navigation";
import {
  Target,
  Users,
  MessageSquare,
  Calendar,
  Heart,
  FileText,
  Code,
} from "lucide-react";
import Footer from "@/components/ui/footer";
import ServiceClient from "./ServiceClient";

const serviceData = {
  "programs-projects-management": {
    icon: "Target",
    title: "Programs/Projects Management",
    description:
      "Strategic planning and execution of complex projects with proven methodologies and expert oversight.",
    longDescription:
      "Our comprehensive project management services ensure your initiatives are delivered on time, within budget, and exceed expectations. We combine industry best practices with innovative approaches to drive successful outcomes.",
    features: [
      "Strategic project planning and roadmap development",
      "Risk assessment and mitigation strategies",
      "Resource allocation and team coordination",
      "Progress monitoring and reporting",
      "Quality assurance and control",
      "Stakeholder communication and management",
    ],
    benefits: [
      "Improved project success rates",
      "Reduced costs and timeline overruns",
      "Enhanced team productivity",
      "Better risk management",
      "Increased stakeholder satisfaction",
    ],
    process: [
      "Initial consultation and needs assessment",
      "Project scope definition and planning",
      "Team assembly and resource allocation",
      "Implementation and monitoring",
      "Quality review and delivery",
    ],
  },
  "capacity-building": {
    icon: "Users",
    title: "Capacity Building",
    description:
      "Empowering individuals and organizations through comprehensive training and skill development programs.",
    longDescription:
      "We design and deliver customized capacity building programs that enhance individual skills and organizational capabilities. Our approach focuses on sustainable development and long-term impact.",
    features: [
      "Skills assessment and gap analysis",
      "Customized training program design",
      "Leadership development workshops",
      "Technical skills enhancement",
      "Organizational development consulting",
      "Performance measurement and evaluation",
    ],
    benefits: [
      "Enhanced employee capabilities",
      "Improved organizational performance",
      "Increased innovation and adaptability",
      "Better succession planning",
      "Higher employee engagement",
    ],
    process: [
      "Organizational assessment",
      "Training needs analysis",
      "Program design and development",
      "Implementation and delivery",
      "Impact evaluation and follow-up",
    ],
  },
  "consultancy-services": {
    icon: "MessageSquare",
    title: "Consultancy Services",
    description:
      "Expert advisory services tailored to your unique challenges and organizational goals.",
    longDescription:
      "Our experienced consultants provide strategic guidance and practical solutions to help organizations overcome challenges and achieve their objectives. We bring deep industry knowledge and proven methodologies to every engagement.",
    features: [
      "Strategic planning and advisory",
      "Organizational restructuring",
      "Process optimization",
      "Change management support",
      "Market analysis and research",
      "Performance improvement initiatives",
    ],
    benefits: [
      "Objective external perspective",
      "Access to specialized expertise",
      "Accelerated problem-solving",
      "Improved operational efficiency",
      "Strategic competitive advantage",
    ],
    process: [
      "Problem identification and scoping",
      "Data collection and analysis",
      "Solution development",
      "Implementation planning",
      "Results monitoring and optimization",
    ],
  },
  "event-host-management": {
    icon: "Calendar",
    title: "Event Host/Management",
    description:
      "Professional event planning and management services that create memorable and impactful experiences.",
    longDescription:
      "From corporate conferences to community gatherings, we handle every aspect of event planning and execution. Our team ensures seamless experiences that engage audiences and achieve your event objectives.",
    features: [
      "Event concept development and planning",
      "Venue selection and management",
      "Speaker and entertainment coordination",
      "Registration and attendee management",
      "Marketing and promotion support",
      "On-site event coordination",
    ],
    benefits: [
      "Professional event execution",
      "Increased attendee engagement",
      "Reduced planning stress",
      "Cost-effective solutions",
      "Memorable experiences",
    ],
    process: [
      "Event planning and concept development",
      "Logistics coordination",
      "Marketing and promotion",
      "Event execution",
      "Post-event evaluation and reporting",
    ],
  },
  "community-development": {
    icon: "Heart",
    title: "Community Development",
    description:
      "Sustainable community-focused initiatives that drive positive social and economic change.",
    longDescription:
      "We work with communities to identify needs, develop solutions, and implement sustainable programs that create lasting positive impact. Our approach emphasizes local ownership and capacity building.",
    features: [
      "Community needs assessment",
      "Participatory planning processes",
      "Program design and implementation",
      "Stakeholder engagement",
      "Monitoring and evaluation",
      "Sustainability planning",
    ],
    benefits: [
      "Improved community well-being",
      "Enhanced local capacity",
      "Sustainable development outcomes",
      "Stronger community networks",
      "Increased social cohesion",
    ],
    process: [
      "Community engagement and assessment",
      "Collaborative planning",
      "Program implementation",
      "Capacity building",
      "Impact evaluation",
    ],
  },
  "content-development": {
    icon: "FileText",
    title: "Content Development",
    description:
      "High-quality content creation and strategy development for effective communication and engagement.",
    longDescription:
      "Our content development services help organizations communicate effectively with their audiences through compelling, well-crafted content across multiple channels and formats.",
    features: [
      "Content strategy development",
      "Writing and editing services",
      "Visual content creation",
      "Digital content optimization",
      "Brand voice development",
      "Content performance analysis",
    ],
    benefits: [
      "Enhanced brand communication",
      "Improved audience engagement",
      "Consistent messaging",
      "Better search visibility",
      "Increased conversion rates",
    ],
    process: [
      "Content audit and strategy development",
      "Content planning and creation",
      "Review and optimization",
      "Publication and distribution",
      "Performance monitoring",
    ],
  },
  "web-development": {
    icon: "Code",
    title: "Web Development",
    description:
      "Modern, responsive web solutions that enhance your digital presence and user experience.",
    longDescription:
      "We create custom web solutions that combine beautiful design with powerful functionality. Our development approach focuses on user experience, performance, and scalability.",
    features: [
      "Custom website development",
      "Responsive design implementation",
      "E-commerce solutions",
      "Content management systems",
      "Web application development",
      "SEO optimization",
    ],
    benefits: [
      "Professional online presence",
      "Improved user experience",
      "Mobile-friendly design",
      "Better search rankings",
      "Increased online conversions",
    ],
    process: [
      "Requirements gathering and planning",
      "Design and development",
      "Testing and optimization",
      "Launch and deployment",
      "Ongoing maintenance and support",
    ],
  },
  "talent-recruitment": {
    icon: "Briefcase",
    title: "Talent Recruitment",
    description:
      "End-to-end recruitment solutions designed to attract, assess, and onboard top talent for your organization.",
    longDescription:
      "Our recruitment services streamline the hiring process, ensuring organizations find the right talent efficiently. We combine modern recruitment technologies with human expertise to deliver tailored hiring solutions.",
    features: [
      "Job profiling and role definition",
      "Talent sourcing and outreach",
      "Screening and candidate assessment",
      "Interview coordination",
      "Onboarding support",
      "Recruitment process optimization",
    ],
    benefits: [
      "Access to top talent",
      "Reduced hiring time",
      "Improved candidate quality",
      "Enhanced employer reputation",
      "Scalable recruitment processes",
    ],
    process: [
      "Client consultation and role definition",
      "Talent search and outreach",
      "Candidate screening and interviews",
      "Final selection and offer",
      "Onboarding and follow-up",
    ],
  },
  branding: {
    icon: "Star",
    title: "Branding",
    description:
      "Creative branding strategies and identity design that strengthen your organization’s visibility and impact.",
    longDescription:
      "Our branding services help organizations establish a strong and memorable identity. From visual design to strategic positioning, we ensure your brand resonates with your target audience and stands out in the market.",
    features: [
      "Brand strategy development",
      "Logo and visual identity design",
      "Brand voice and messaging",
      "Marketing collateral creation",
      "Digital and social branding",
      "Brand performance analysis",
    ],
    benefits: [
      "Stronger market presence",
      "Improved customer loyalty",
      "Consistent brand identity",
      "Increased visibility",
      "Better audience connection",
    ],
    process: [
      "Brand discovery and research",
      "Strategy development",
      "Visual and verbal identity design",
      "Implementation across channels",
      "Monitoring and refinement",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service) {
    notFound();
  }
  return (
    <>
      <ServiceClient service={service} />
      <Footer />
    </>
  );
}
