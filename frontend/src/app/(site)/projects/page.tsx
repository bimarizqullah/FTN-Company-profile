import HeroSub from "@/components/shared/HeroSub";
import ProjectsListing from "@/components/Projects/ProjectList";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Fiber Teknologi Nusantara",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Our Ongoing & Completed Projects"
        description="Fiber Teknologi Nusantara terus mengembangkan infrastruktur fiber optik yang mendukung konektivitas dan digitalisasi. Saat ini salah satunya adalah Project Madiun yang sedang dalam proses pembangunan."
        badge="Projects"
      />
      {/* ProjectsListing tetap digunakan tapi kita bisa isi dari API atau hardcode */}
      <ProjectsListing />
    </>
  );
};

export default page;
