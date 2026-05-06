
// Shared helper for rule evaluations (array-safe for allowMultiple params)
    const matches = (selected, param, expectedValues) => {
        const value = selected[param];
        if (!value) {
            // If parameter not selected, check if "normal" is in expected values
            return Array.isArray(expectedValues) ? expectedValues.includes('normal') : expectedValues === 'normal';
        }
        if (Array.isArray(value)) {
            // Multi-select param: check if ANY selected value matches expected
            return Array.isArray(expectedValues)
                ? value.some(v => expectedValues.includes(v))
                : value.includes(expectedValues);
        }
        return Array.isArray(expectedValues) ? expectedValues.includes(value) : value === expectedValues;
    };

    // Helper for direct value checks on params that may be arrays (allowMultiple)
    const hasValue = (selected, param, val) => {
        const value = selected[param];
        if (!value) return false;
        return Array.isArray(value) ? value.includes(val) : value === val;
    };

    // Helper for displaying param values in evidence strings (array-safe)
    const displayValue = (selected, param) => {
        const value = selected[param];
        if (!value) return '';
        return Array.isArray(value) ? value.join(', ') : value;
    };
    // Pain helpers for per-location pain params
    const hasAnyPain = (selected) => {
        return (selected.painCervical && selected.painCervical !== 'none') ||
               (selected.painThoracolumbar && selected.painThoracolumbar !== 'none') ||
               (selected.painLumbar && selected.painLumbar !== 'none') ||
               (selected.painLumbosacral && selected.painLumbosacral !== 'none');
    };
    const hasNoPain = (selected) => !hasAnyPain(selected);
    const hasPainLevel = (selected, level) => {
        return selected.painCervical === level || selected.painThoracolumbar === level ||
               selected.painLumbar === level || selected.painLumbosacral === level;
    };
    const hasSevereOrModeratePain = (selected) => hasPainLevel(selected, 'severe') || hasPainLevel(selected, 'moderate');
    const hasMildOrNoPain = (selected) => !hasSevereOrModeratePain(selected);

    // Head tilt helper (checks both L and R)
    const hasHeadTilt = (selected) => hasValue(selected, 'headPosture', 'head tilt L') || hasValue(selected, 'headPosture', 'head tilt R');

// Utility functions for neurological examination evaluation

// Severity ordering for reflexes (0 = least severe, 3 = most severe)
const REFLEX_SEVERITY = {
    'normal': 0,
    'increased': 1,
    'decreased': 2,
    'absent': 3
};

/**
 * Returns the worst (most severe) reflex value between left and right sides
 * @param {string} leftValue - Left side reflex value
 * @param {string} rightValue - Right side reflex value
 * @returns {string} The worse of the two values
 */
function worstReflex(leftValue, rightValue) {
    const leftScore = REFLEX_SEVERITY[leftValue] || 0;
    const rightScore = REFLEX_SEVERITY[rightValue] || 0;
    return leftScore >= rightScore ? leftValue : rightValue;
}

/**
 * Checks if both left and right reflexes match the expected values
 * @param {string} left - Left side value
 * @param {string} right - Right side value
 * @param {string|string[]} expectedValues - Expected value(s) - can be string or array
 * @returns {boolean} True if both sides match expected values
 */
function bothReflexesMatch(left, right, expectedValues) {
    const expected = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
    return expected.includes(left) && expected.includes(right);
}

/**
 * Checks if either left or right reflex matches the expected values
 * @param {string} left - Left side value
 * @param {string} right - Right side value
 * @param {string|string[]} expectedValues - Expected value(s) - can be string or array
 * @returns {boolean} True if either side matches expected values
 */
function eitherReflexMatches(left, right, expectedValues) {
    const expected = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
    return expected.includes(left) || expected.includes(right);
}

/**
 * Checks if reflexes are considered decreased or absent (LMN signs)
 * @param {string} value - Reflex value
 * @returns {boolean} True if decreased or absent
 */
function isReflexDecreased(value) {
    return value === 'decreased' || value === 'absent';
}

/**
 * Checks if reflexes are considered normal or increased (UMN pattern)
 * @param {string} value - Reflex value
 * @returns {boolean} True if normal or increased
 */
function isReflexNormalOrIncreased(value) {
    return value === 'normal' || value === 'increased';
}

/**
 * Checks if there's marked asymmetry between left and right reflexes
 * @param {string} left - Left side value
 * @param {string} right - Right side value
 * @returns {boolean} True if there's >1 grade difference in severity
 */
function hasMarkedAsymmetry(left, right) {
    const leftScore = REFLEX_SEVERITY[left] || 0;
    const rightScore = REFLEX_SEVERITY[right] || 0;
    return Math.abs(leftScore - rightScore) > 1;
}

/**
 * Helper to check if selected value matches expected value(s)
 * Same as existing matches() function but standalone
 * @param {object} selected - The data object
 * @param {string} key - The key to check
 * @param {string|string[]} expected - Expected value(s)
 * @returns {boolean} True if matches
 */
function paramMatches(selected, key, expected) {
    const value = selected[key];
    if (Array.isArray(expected)) {
        return expected.includes(value);
    }
    return value === expected;
}
   