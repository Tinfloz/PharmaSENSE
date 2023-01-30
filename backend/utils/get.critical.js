export const getCriticalLevel = (volume) => {
    let critical = (volume - (0.7 * volume))
    return Math.round(critical)
};