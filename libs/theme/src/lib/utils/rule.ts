import { isLiquidGlassAvailable } from 'expo-glass-effect';

export const isCustomDesignMandatory = !isLiquidGlassAvailable()
