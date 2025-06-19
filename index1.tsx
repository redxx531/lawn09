import Layout from '@/components/layout/Layout';
import ProjectGrid from '@/components/projects/ProjectGrid';

export default function Projects() {
  return (
    <Layout title="Explore Projects - Launch Tribe">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Explore Projects</h1>
            <p className="lead mb-5">
              Discover innovative projects from entrepreneurs and find your next investment opportunity.
            </p>
            
            <ProjectGrid />
          </div>
        </div>
      </div>
    </Layout>
  );
}