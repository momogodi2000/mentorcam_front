// utils/tag.js

/**
 * Generate tags based on mentor's profile information
 * @param {Object} mentor - The mentor object
 * @returns {Array} - Array of tags
 */
export const generateMentorTags = (mentor) => {
    const tags = [];
  
    // Add domain and subdomains as tags
    if (mentor.domain_name) {
      tags.push(mentor.domain_name);
    }
    if (mentor.subdomains && mentor.subdomains.length > 0) {
      tags.push(...mentor.subdomains);
    }
  
    // Add certifications as tags if available
    if (mentor.certification_name) {
      tags.push(mentor.certification_name);
    }
  
    // Add expertise level based on experience
    if (mentor.years_of_experience) {
      if (mentor.years_of_experience >= 10) {
        tags.push('Expert');
      } else if (mentor.years_of_experience >= 5) {
        tags.push('Advanced');
      } else {
        tags.push('Beginner');
      }
    }
  
    // Add availability tags
    if (mentor.availability && mentor.availability.length > 0) {
      tags.push(...mentor.availability.map(avail => `Available ${avail}`));
    }
  
    // Add language proficiency tags
    if (mentor.languages && mentor.languages.length > 0) {
      tags.push(...mentor.languages.map(lang => `Speaks ${lang}`));
    }
  
    // Add pricing tier tags
    if (mentor.plan_price) {
      if (mentor.plan_price > 30000) {
        tags.push('Premium');
      } else if (mentor.plan_price > 15000) {
        tags.push('Mid-range');
      } else {
        tags.push('Budget-friendly');
      }
    }
  
    // Add success rate tags
    if (mentor.successRate) {
      if (mentor.successRate >= 90) {
        tags.push('Top Performer');
      } else if (mentor.successRate >= 75) {
        tags.push('High Success Rate');
      }
    }
  
    return [...new Set(tags)]; // Remove duplicates
  };
  
  /**
   * Filter mentors based on selected tags
   * @param {Array} mentors - Array of mentor objects
   * @param {Array} selectedTags - Array of selected tags
   * @returns {Array} - Filtered array of mentor objects
   */
  export const filterMentorsByTags = (mentors, selectedTags) => {
    if (!selectedTags || selectedTags.length === 0) return mentors;
  
    return mentors.filter(mentor => {
      const mentorTags = generateMentorTags(mentor);
      return selectedTags.every(tag => mentorTags.includes(tag));
    });
  };
  
  /**
   * Get all unique tags from a list of mentors
   * @param {Array} mentors - Array of mentor objects
   * @returns {Array} - Array of unique tags
   */
  export const getAllUniqueTags = (mentors) => {
    const allTags = mentors.flatMap(mentor => generateMentorTags(mentor));
    return [...new Set(allTags)]; // Remove duplicates
  };