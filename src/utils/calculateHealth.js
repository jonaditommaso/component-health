/**
 * Calculates the health score of a React component based on various metrics.
 * Health starts at 100 and gets penalized for complexity indicators.
 *
 * @param {Object} metrics - The metrics object containing code analysis data
 * @param {number} metrics.linesOfCode - Total lines of code in the file
 * @param {number} metrics.useEffectCount - Number of useEffect hooks
 * @param {number} metrics.useStateCount - Number of useState hooks
 * @param {number} metrics.functionalComponentCount - Number of functional components
 * @param {number} metrics.internalFunctionsCount - Number of internal functions
 * @param {number} metrics.conditionalReturnsCount - Number of conditional returns
 * @param {number} metrics.jsxNestingDepth - Maximum JSX nesting depth
 * @param {number} metrics.customHooksCount - Number of custom hooks
 * @returns {number} Health score (minimum 1, maximum 100)
 */
function calculateHealth(metrics) {
    let health = 100;

    const {
        linesOfCode,
        useEffectCount,
        useStateCount,
        internalFunctionsCount,
        conditionalReturnsCount,
        jsxNestingDepth,
        customHooksCount
    } = metrics;

    // Lines of code penalties
    if (linesOfCode > 1000) {
        health -= 50;
    } else if (linesOfCode > 300) {
        health -= 10;
    }

    // useEffect penalties (-5 for each useEffect above the 2nd)
    if (useEffectCount > 2) {
        const excessUseEffects = useEffectCount - 2;
        health -= excessUseEffects * 5;
    }

    // useState penalties (-3 for each useState above the 3rd)
    if (useStateCount > 3) {
        const excessUseStates = useStateCount - 3;
        health -= excessUseStates * 3;
    }

    // Internal functions penalty (-6 if more than 4)
    if (internalFunctionsCount > 4) {
        health -= 6;
    }

    // Conditional returns penalty (-5 if more than 1)
    if (conditionalReturnsCount > 1) {
        health -= 5;
    }

    // JSX nesting penalty (-6 if more than 4 levels)
    if (jsxNestingDepth > 4) {
        health -= 6;
    }

    // Custom hooks bonus (+8 for each custom hook)
    health += customHooksCount * 8;

    // Ensure minimum health is 1 and maximum is 100
    return Math.max(1, Math.min(100, health));
}

module.exports = {
    calculateHealth
};
