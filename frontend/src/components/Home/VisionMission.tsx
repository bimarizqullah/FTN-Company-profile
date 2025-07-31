import React from "react";

const VisionMission: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-sky-50 dark:from-dark dark:to-dark/80">
      <div className="container max-w-7xl mx-auto px-5">
        
        {/* Vision */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark dark:text-white mb-6">
            Vision
          </h2>
          <p className="text-lg text-dark/70 dark:text-white/70 max-w-4xl mx-auto leading-relaxed">
            To become a reliable and high-standard infrastructure provider, actively contributing to the realization of urban digital transformation towards a modern, efficient, and sustainable Smart City.
          </p>
        </div>
        
        {/* Mission */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-dark dark:text-white mb-10">
            Mission
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            
            <div className="p-6 bg-white dark:bg-dark rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Menata Estetika Perkotaan
              </h3>
              <p className="text-dark/70 dark:text-white/70">
                Mengintegrasikan solusi infrastruktur yang modern dan tertata guna mengurangi kesemrawutan kabel udara serta meningkatkan estetika dan keamanan lingkungan perkotaan.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-dark rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Menyediakan Infrastruktur Digital yang Tersertifikasi
              </h3>
              <p className="text-dark/70 dark:text-white/70">
                Menghadirkan standarisasi infrastruktur digital yang berkualitas, aman, dan sesuai dengan regulasi untuk mendukung konektivitas yang andal.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-dark rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Meningkatkan Efisiensi & Keberlanjutan
              </h3>
              <p className="text-dark/70 dark:text-white/70">
                Mengoptimalkan pemanfaatan infrastruktur pasif secara bersama guna mengurangi redundansi jaringan, meningkatkan efisiensi biaya, serta mendukung penggunaan teknologi ramah lingkungan.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-dark rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Mendukung Transformasi Digital Kota
              </h3>
              <p className="text-dark/70 dark:text-white/70">
                Berkontribusi dalam percepatan digitalisasi melalui pembangunan infrastruktur digital yang mendukung Smart City, IoT, dan ekosistem digital yang inovatif.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionMission;
