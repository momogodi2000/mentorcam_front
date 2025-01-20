import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const DOMAINS = {
  "Software Development": [
    "Web Development",
    "Mobile App Development",
    "Game Development",
    "DevOps & CI/CD",
    "Software Testing & QA"
  ],
  "Data Science": [
    "Data Analytics",
    "Machine Learning",
    "Deep Learning",
    "Data Visualization",
    "NLP"
  ],
  // Add more domains as needed
};

const DomainSelection = () => {
  const [selectedDomains, setSelectedDomains] = useState({});

  const handleDomainChange = (domain) => {
    setSelectedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Your Domains of Expertise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(DOMAINS).map(([domain, subdomains]) => (
          <div key={domain} className="flex items-start space-x-3">
            <Checkbox
              id={domain}
              checked={selectedDomains[domain] || false}
              onCheckedChange={() => handleDomainChange(domain)}
            />
            <div className="space-y-1">
              <label
                htmlFor={domain}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {domain}
              </label>
              <p className="text-sm text-gray-500">
                {subdomains.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainSelection;