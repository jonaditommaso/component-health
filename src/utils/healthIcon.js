/**
 * Returns an appropriate health icon based on the health score percentage
 * @param {number} healthScore - Health score from 1 to 100
 * @returns {string} Emoji icon representing the health level
 */
function getHealthIcon(healthScore) {
    if (healthScore >= 90) {
        return '💚'; // Green heart - Excellent health
    } else if (healthScore >= 75) {
        return '🟢'; // Green circle - Good health
    } else if (healthScore >= 60) {
        return '🟡'; // Yellow circle - Warning
    } else if (healthScore >= 40) {
        return '🟠'; // Orange circle - Poor health
    } else if (healthScore >= 20) {
        return '🔴'; // Red circle - Bad health
    } else {
        return '❗'; // Exclamation - Critical health
    }
}

/**
 * Returns a descriptive health status text based on the health score
 * @param {number} healthScore - Health score from 1 to 100
 * @returns {string} Health status description
 */
function getHealthStatus(healthScore) {
    if (healthScore >= 90) {
        return 'Excellent';
    } else if (healthScore >= 75) {
        return 'Good';
    } else if (healthScore >= 60) {
        return 'Warning';
    } else if (healthScore >= 40) {
        return 'Poor';
    } else if (healthScore >= 20) {
        return 'Bad';
    } else {
        return 'Critical';
    }
}

module.exports = {
    getHealthIcon,
    getHealthStatus
};
