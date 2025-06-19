import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function TermsOfService() {
  const [pageContent, setPageContent] = useState({
    title: 'Terms of Service',
    content: '<p>Loading content...</p>',
    meta_description: 'Our terms of service outline the rules and guidelines for using Launch Tribe, including user responsibilities and our policies.'
  });

  useEffect(() => {
    // Fetch page content
    const fetchPageContent = async () => {
      try {
        const response = await fetch('/api/pages/terms');
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch page content', error);
      }
    };

    fetchPageContent();
  }, []);

  return (
    <Layout title="Terms of Service - Launch Tribe" description={pageContent.meta_description}>
      <div className="container py-5" style={{ paddingTop: '120px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <h1 className="mb-4">{pageContent.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}