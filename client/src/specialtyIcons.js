import { Heart, Wind, Activity, Brain, Sparkle, Stethoscope, Bone, Hand } from 'lucide-react';

export const SPECIALTY_ICON = {
  Cardiology: Heart,
  Pulmonology: Wind,
  Gastroenterology: Activity,
  Neurology: Brain,
  Dermatology: Sparkle,
  'General Medicine': Stethoscope,
  Rheumatology: Hand,
  Orthopedics: Bone,
};

export const specialtyIcon = (specialty) => SPECIALTY_ICON[specialty] || Stethoscope;
