import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const [pageContent, setPageContent] = useState({
    title: 'Frequently Asked Questions',
    content: '<p>Find answers to commonly asked questions about Launch Tribe.</p>',
    meta_description: 'Frequently Asked Questions about Launch Tribe'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        
        // Fetch page content
        const pageResponse = await fetch('/api/pages/faq');
        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          setPageContent(pageData);
        }
        
        // Fetch FAQs
        const faqResponse = await fetch('/api/faqs');
        if (faqResponse.ok) {
          const faqData = await faqResponse.json();
          setFaqs(faqData);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(faqData.map((faq: FAQ) => faq.category))].filter(Boolean);
          setCategories(uniqueCategories);
          
          // Set first item of each category as active
          const firstItems = faqData.reduce((acc: number[], faq: FAQ) => {
            const categoryFirstItem = faqData
              .filter((f: FAQ) => f.category === faq.category)
              .sort((a: FAQ, b: FAQ) => a.display_order - b.display_order)[0];
              
            if (categoryFirstItem && !acc.includes(categoryFirstItem.id)) {
              acc.push(categoryFirstItem.id);
            }
            return acc;
          }, []);
          
          setActiveItems(firstItems);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setActiveItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <Layout title="FAQ - Launch Tribe" description={pageContent.meta_description}>
      <div className="bg-light py-5" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold">{pageContent.title}</h1>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div dangerouslySetInnerHTML={{ __html: pageContent.content.replace('<div class="faq-placeholder"></div>', '') }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading FAQs...</p>
          </div>
        ) : (
          <>
            <ul className="nav nav-pills justify-content-center mb-5">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Questions
                </button>
              </li>
              {categories.map((category, index) => (
                <li key={index} className="nav-item">
                  <button 
                    className={`nav-link ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            <div className="row justify-content-center">
              <div className="col-lg-8">
                {filteredFaqs.length === 0 ? (
                  <div className="alert alert-info text-center">
                    No FAQs found in this category.
                  </div>
                ) : (
                  <div className="accordion" id="faqAccordion">
                    {filteredFaqs
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((faq, index) => (
                        <div key={faq.id} className={`faq-item mb-3 ${activeItems.includes(faq.id) ? 'active' : ''}`}>
                          <div 
                            className="faq-question bg-white rounded shadow-sm"
                            onClick={() => toggleFAQ(faq.id)}
                          >
                            <div className="d-flex justify-content-between align-items-center p-3">
                              <h5 className="mb-0 fw-medium">{faq.question}</h5>
                              <i className={`bi ${activeItems.includes(faq.id) ? 'bi-dash' : 'bi-plus'}`}></i>
                            </div>
                          </div>
                          <div className={`faq-answer bg-white rounded-bottom shadow-sm ${activeItems.includes(faq.id) ? 'show' : ''}`}>
                            <div className="p-3">
                              <p className="mb-0">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-primary bg-gradient text-white py-5">
        <div className="container text-center py-3">
          <h2 className="fw-bold mb-4">Still have questions?</h2>
          <p className="lead mb-4">If you couldn't find the answer to your question, feel free to contact our support team.</p>
          <a href="/contact" className="btn btn-light btn-lg px-4">
            Contact Support
          </a>
        </div>
      </div>
    </Layout>
  );
}