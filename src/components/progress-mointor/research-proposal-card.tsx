import React, { useEffect, useRef, useState } from 'react';

interface ResearchProposalCardProps {
  title?: string;
  authorName?: string;
  authorDegree?: string;
  submissionDate?: string;
  status?: 'Pending' | 'Approved' | 'Under Review' | 'Rejected';
  description?: string;
  methodology?: string;
}

const ResearchProposalCard: React.FC<ResearchProposalCardProps> = ({
  title = "Machine Learning for Early Disease Detection",
  authorName = "John Smith",
  authorDegree = "PhD",
  submissionDate = "05-15-2025",
  status = "Pending",
  description = "This research aims to develop machine learning algorithms that can identify early signs of diseases from medical data. The study will focus on creating models that can detect patterns in medical images and patient data that might indicate the onset of conditions before they become clinically apparent.",
  methodology = "I will use supervised learning techniques with medical imaging datasets, employing CNN architectures and validation through cross-validation methods. The research will include collaboration with medical professionals to ensure clinical relevance."
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer after animation triggers
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`max-w-4xl mx-auto bg-blue-50 border border-gray-200 rounded-lg shadow-sm p-8 transition-all duration-1000 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header Section */}
      <div className={`flex justify-between items-start mb-6 transition-all duration-1000 delay-200 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-medium">{authorName}</span>
            <span className="text-purple-600 font-semibold">{authorDegree}</span>
            <span>Submitted: {submissionDate}</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border font-medium text-sm ${getStatusColor(status)}`}>
          {status}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Description Section */}
        <div className={`transition-all duration-1000 delay-400 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Description
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Methodology Section */}
        <div className={`transition-all duration-1000 delay-600 ease-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Methodology
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            {methodology}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchProposalCard;