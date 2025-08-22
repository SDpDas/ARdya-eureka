export function UseCases() {
  const useCases = [
    {
      title: "Retail Product Visualization",
      description: "Allow customers to view products in 3D and place them in their space before purchasing.",
    },
    {
      title: "Virtual Furniture Placement",
      description: "Help customers visualize how furniture will look and fit in their homes.",
    },
    {
      title: "Educational 3D Models",
      description: "Create interactive 3D models for educational purposes, from anatomy to architecture.",
    },
    {
      title: "Real Estate Virtual Tours",
      description: "Showcase properties with 3D models that potential buyers can explore virtually.",
    },
    {
      title: "Interactive Museum Exhibits",
      description: "Enhance museum experiences with AR overlays for artifacts and exhibits.",
    },
    {
      title: "Architectural Visualization",
      description: "Present architectural designs in 3D and AR for better client understanding.",
    },
    {
      title: "Product Packaging AR",
      description: "Create interactive AR experiences triggered by product packaging.",
    },
    {
      title: "Virtual Try-On",
      description: "Allow customers to virtually try on accessories, glasses, or clothing.",
    },
    {
      title: "Interactive Manuals",
      description: "Create AR-enhanced instruction manuals for products and equipment.",
    },
    {
      title: "Event and Exhibition Displays",
      description: "Enhance trade shows and exhibitions with interactive 3D and AR displays.",
    },
    {
      title: "Medical Visualization",
      description: "Create 3D models of medical scans for better diagnosis and patient education.",
    },
    {
      title: "Training Simulations",
      description: "Develop interactive 3D training scenarios for various industries.",
    },
    {
      title: "Gaming and Entertainment",
      description: "Create AR games and interactive entertainment experiences.",
    },
    {
      title: "Marketing Campaigns",
      description: "Develop engaging AR marketing campaigns that stand out from competitors.",
    },
    {
      title: "Virtual Prototyping",
      description: "Create and share 3D prototypes before physical manufacturing.",
    },
    {
      title: "Automotive Visualization",
      description: "Allow customers to configure and view vehicles in their driveway before purchase.",
    },
    {
      title: "Fashion Design",
      description: "Visualize clothing and accessory designs in 3D before production.",
    },
    {
      title: "Interactive Advertising",
      description: "Create AR-enhanced advertisements that engage users in new ways.",
    },
    {
      title: "Virtual Art Galleries",
      description: "Display artwork in 3D spaces or allow placement in users' homes.",
    },
    {
      title: "Industrial Maintenance",
      description: "Provide AR-assisted maintenance instructions for industrial equipment.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {useCases.map((useCase, index) => (
        <div key={index} className="border rounded-lg p-4 hover:border-primary transition-colors">
          <h3 className="font-bold mb-2">{useCase.title}</h3>
          <p className="text-sm text-muted-foreground">{useCase.description}</p>
        </div>
      ))}
    </div>
  )
}
