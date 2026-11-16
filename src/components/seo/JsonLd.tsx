import React from "react";
import { PROFILE } from "@/data/profile";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    givenName: "Ashwin",
    familyName: "T E",
    url: PROFILE.portfolioUrl,
    email: `mailto:${PROFILE.email}`,
    jobTitle: "Mechatronics & Robotics Engineer",
    description: PROFILE.objective,
    worksFor: {
      "@type": "EducationalOrganization",
      name: PROFILE.education.institution,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: PROFILE.education.institution,
    },
    sameAs: [
      PROFILE.githubUrl,
      PROFILE.linkedinUrl,
      PROFILE.portfolioUrl,
    ],
    knowsAbout: [
      "Robotics",
      "Mechatronics",
      "ROS 2",
      "Bio-Inspired Robotics",
      "Sensor Fusion",
      "Dual-EKF",
      "Embedded Systems",
      "State-Space LQR Control",
      "Computer-Aided Design (CAD)",
      "Finite Element Analysis (FEA)",
      "Autonomous Mobile Robots",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
