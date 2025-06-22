import { create } from 'zustand'

type FitcareFormData = {
  age: number;
  gender: string;
  state: string;
  city: string;
  height: number;
  hUnit: "cm" | "m" | "ft" | "in";
  weight: number;
  wUnit: "kg" | 'g' | 'lbs';
  goal: 'gain' | 'loss' | "maintain";
  target: number;
  tUnit: "kg" | 'g' | 'lbs';
  activity: string;
  food: string;
  taste: string[];
  targetDays: number
}

type FitcareStore = {
  step: number;
  form: Partial<FitcareFormData>;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<FitcareFormData>) => void;
  setForm: (data: Partial<FitcareFormData>) => void;
}

export const useFitcareForm = create<FitcareStore>((set) => ({
  step: 0,
  form: {},
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: s.step - 1 })),
  updateForm: (data) =>
    set((s) => ({ form: { ...s.form, ...data } })),
  setForm: (data: Partial<FitcareFormData>) => 
    set(() => ({ form: data })),
}))