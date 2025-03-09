import axiosInstance from '../backend_connection';

/**
 * Service class for handling amateur user statistics API calls
 */
class AmateurStatServices {
    /**
     * Fetch professional statistics
     * @returns {Promise} Professional statistics data
     */
    async getProfessionalStats() {
        try {
            const response = await axiosInstance.get('/stats/professionals/');
            return response.data;
        } catch (error) {
            console.error('Error fetching professional statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch booking statistics
     * @returns {Promise} Booking statistics data
     */
    async getBookingStats() {
        try {
            const response = await axiosInstance.get('/stats/bookings/');
            return response.data;
        } catch (error) {
            console.error('Error fetching booking statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch event statistics
     * @returns {Promise} Event statistics data
     */
    async getEventStats() {
        try {
            const response = await axiosInstance.get('/stats/events/');
            return response.data;
        } catch (error) {
            console.error('Error fetching event statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch job statistics
     * @returns {Promise} Job statistics data
     */
    async getJobStats() {
        try {
            const response = await axiosInstance.get('/stats/jobs/');
            return response.data;
        } catch (error) {
            console.error('Error fetching job statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch exam statistics
     * @returns {Promise} Exam statistics data
     */
    async getExamStats() {
        try {
            const response = await axiosInstance.get('/stats/exams/');
            return response.data;
        } catch (error) {
            console.error('Error fetching exam statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch course statistics
     * @returns {Promise} Course statistics data
     */
    async getCourseStats() {
        try {
            const response = await axiosInstance.get('/stats/courses/');
            return response.data;
        } catch (error) {
            console.error('Error fetching course statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch overall platform statistics
     * @returns {Promise} Overall statistics data
     */
    async getOverallStats() {
        try {
            const response = await axiosInstance.get('/stats/overall/');
            return response.data;
        } catch (error) {
            console.error('Error fetching overall statistics:', error);
            throw error;
        }
    }

    /**
     * Fetch all statistics in a single call
     * @returns {Promise} Object containing all statistics
     */
    async getAllStats() {
        try {
            const [
                professionals,
                bookings,
                events,
                jobs,
                exams,
                courses,
                overall
            ] = await Promise.all([
                this.getProfessionalStats(),
                this.getBookingStats(),
                this.getEventStats(),
                this.getJobStats(),
                this.getExamStats(),
                this.getCourseStats(),
                this.getOverallStats()
            ]);

            return {
                professionals,
                bookings,
                events,
                jobs,
                exams,
                courses,
                overall
            };
        } catch (error) {
            console.error('Error fetching all statistics:', error);
            throw error;
        }
    }

    /**
     * Format data for chart display
     * @param {Object} data - Raw statistics data
     * @param {String} type - Chart type (pie, bar, line)
     * @returns {Object} Formatted chart data
     */
    formatChartData(data, type) {
        switch (type) {
            case 'pie':
                return this.formatPieChartData(data);
            case 'bar':
                return this.formatBarChartData(data);
            case 'line':
                return this.formatLineChartData(data);
            default:
                return data;
        }
    }

    /**
     * Format data for pie charts
     * @param {Object} data - Raw data object with key-value pairs
     * @returns {Object} Formatted pie chart data
     */
    formatPieChartData(data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#8AC64A'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#8AC64A'
                    ]
                }
            ]
        };
    }

    /**
     * Format data for bar charts
     * @param {Object} data - Raw data object with key-value pairs
     * @returns {Object} Formatted bar chart data
     */
    formatBarChartData(data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        return {
            labels,
            datasets: [
                {
                    label: 'Value',
                    data: values,
                    backgroundColor: '#36A2EB',
                    borderColor: '#2980B9',
                    borderWidth: 1
                }
            ]
        };
    }

    /**
     * Format data for line charts (typically time-series data)
     * @param {Array} data - Array of objects with time and value properties
     * @param {String} xKey - The key for X-axis values
     * @param {String} yKey - The key for Y-axis values
     * @returns {Object} Formatted line chart data
     */
    formatLineChartData(data, xKey = 'month', yKey = 'count') {
        const labels = data.map(item => item[xKey]);
        const values = data.map(item => item[yKey]);
        
        return {
            labels,
            datasets: [
                {
                    label: 'Trend',
                    data: values,
                    fill: false,
                    borderColor: '#2980B9',
                    tension: 0.1
                }
            ]
        };
    }

    /**
     * Format data specifically for domain-based analysis
     * @param {Array} domains - Array of domain objects with name and count
     * @returns {Object} Formatted domain chart data
     */
    formatDomainData(domains) {
        const labels = domains.map(item => item.domain || item.name);
        const values = domains.map(item => item.count);
        
        return {
            labels,
            datasets: [
                {
                    label: 'Domains',
                    data: values,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }
            ]
        };
    }

    /**
     * Get trend analysis data comparing current period with previous
     * @param {Array} timeData - Time series data
     * @param {Number} periodLength - Length of period to compare (in array elements)
     * @returns {Object} Trend analysis with percentage changes
     */
    calculateTrends(timeData, periodLength = 3) {
        if (!timeData || timeData.length < periodLength * 2) {
            return { change: 0, trend: 'stable' };
        }

        const currentPeriod = timeData.slice(-periodLength);
        const previousPeriod = timeData.slice(-periodLength * 2, -periodLength);

        const currentSum = currentPeriod.reduce((sum, item) => sum + item.count, 0);
        const previousSum = previousPeriod.reduce((sum, item) => sum + item.count, 0);

        let percentChange = 0;
        if (previousSum > 0) {
            percentChange = ((currentSum - previousSum) / previousSum) * 100;
        }

        let trend = 'stable';
        if (percentChange > 5) trend = 'increasing';
        if (percentChange < -5) trend = 'decreasing';

        return {
            change: percentChange.toFixed(1),
            trend
        };
    }
}

export default new AmateurStatServices();