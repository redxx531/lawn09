export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Jessica Chen',
      role: 'Entrepreneur',
      company: 'EcoTech Solutions',
      quote: 'Launch Tribe helped me raise funds for my sustainable packaging startup within just 3 weeks. The platform is intuitive and the investor community is highly engaged.',
      image: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Angel Investor',
      company: '',
      quote: 'As someone who enjoys investing in early-stage startups, Launch Tribe gives me access to quality projects that have been pre-vetted. The investment process is seamless.',
      image: 'https://randomuser.me/api/portraits/men/46.jpg'
    },
    {
      id: 3,
      name: 'Sarah Washington',
      role: 'Student Investor',
      company: 'NYU',
      quote: 'I started investing small amounts while in college. Launch Tribe makes it easy to find projects that accept micro-investments, allowing me to build a diverse portfolio.',
      image: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center mb-5">What Our Community Says</h2>
        
        <div className="row g-4">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <p className="card-text mb-4">"{testimonial.quote}"</p>
                  
                  <div className="d-flex align-items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <p className="text-muted small mb-0">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}