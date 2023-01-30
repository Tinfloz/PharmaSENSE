export const getDaysUptoCriticalLevel = (volume, dosage, criticalLevel, times) => {
    return Math.floor((volume - criticalLevel) / (dosage * times));
};