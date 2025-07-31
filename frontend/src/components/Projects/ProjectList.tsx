export default function ProjectsList() {
  const projects = [
    {
      id: 1,
      name: "Revitalisasi Infrastruktur Telekomunikasi Madiun",
      location: "Madiun, Jawa Timur",
      status: "Ongoing",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-bold mb-8">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.location}</p>
              <span className="text-blue-500 font-medium">{project.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}