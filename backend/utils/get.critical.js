export const getCriticalLevel = (volume) => {
    let critical = (volume - (0.7 * volume))
    console.log(critical, "critical")
    return Math.round(critical)
};