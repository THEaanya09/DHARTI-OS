'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/lib/i18n';
import { CROP_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { OnboardingData, OnboardingStep, Locale, CropType } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const TOTAL_STEPS = 5;

const INDIAN_STATES_CITIES: Record<string, { name: string; lat: number; lng: number }[]> = {
  'Andhra Pradesh': [
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Guntur', lat: 16.3067, lng: 80.4365 }
  ],
  'Bihar': [
    { name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { name: 'Gaya', lat: 24.7955, lng: 84.9994 }
  ],
  'Delhi': [
    { name: 'New Delhi', lat: 28.6139, lng: 77.2090 }
  ],
  'Gujarat': [
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812 }
  ],
  'Haryana': [
    { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 }
  ],
  'Karnataka': [
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
    { name: 'Hubli', lat: 15.3647, lng: 75.1240 }
  ],
  'Madhya Pradesh': [
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828 }
  ],
  'Maharashtra': [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 }
  ],
  'Punjab': [
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723 }
  ],
  'Rajasthan': [
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 }
  ],
  'Tamil Nadu': [
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 }
  ],
  'Telangana': [
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Warangal', lat: 17.9784, lng: 79.5941 }
  ],
  'Uttar Pradesh': [
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 }
  ],
  'West Bengal': [
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Asansol', lat: 23.6740, lng: 86.9730 }
  ]
};

export default function OnboardingPage() {
  const { dictionary, locale, setLocale } = useI18n();
  const { updateProfile, loading, loadingMessage } = useAuth();
  const router = useRouter();

  const ob = dictionary.onboarding;
  const crops = dictionary.crops;
  const [step, setStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    locale: locale,
    crop: 'wheat',
    area: 0,
    area_unit: 'acres',
    location: null,
  });

  const selectedCrops = data.crop ? data.crop.split(',').map(c => c.trim()).filter(Boolean) : [];
  
  const handleToggleCrop = (cropVal: string) => {
    let nextCrops;
    if (selectedCrops.includes(cropVal)) {
      nextCrops = selectedCrops.filter(c => c !== cropVal);
    } else {
      nextCrops = [...selectedCrops, cropVal];
    }
    setData({ ...data, crop: nextCrops.join(',') });
  };

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  const [states, setStates] = useState<{ id: string; name: string; iso2: string; latitude: string; longitude: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetch all states of India on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingLocations(true);
      try {
        const res = await fetch('/api/locations?type=states');
        if (res.ok) {
          const rawData = await res.json();
          const sorted = rawData.sort((a: any, b: any) => a.name.localeCompare(b.name));
          setStates(sorted);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchStates();
  }, []);

  // Restore state/city from existing location label
  useEffect(() => {
    if (data.location?.label && states.length > 0) {
      const parts = data.location.label.split(', ');
      if (parts.length === 2) {
        const stateName = parts[1];
        const cityName = parts[0];
        const stateObj = states.find((s) => s.name === stateName);
        if (stateObj && selectedState !== stateName) {
          setSelectedState(stateName);
          setSelectedCity(cityName);
          
          fetch(`/api/locations?type=cities&stateCode=${stateObj.iso2}`)
            .then((res) => res.json())
            .then((cityData) => {
              const sorted = cityData.sort((a: any, b: any) => a.name.localeCompare(b.name));
              setCities(sorted);
            })
            .catch(console.error);
        }
      }
    }
  }, [data.location, states]);

  const handleStateChange = async (stateIso: string | null) => {
    const val = stateIso || '';
    if (!val) {
      setSelectedState('');
      setSelectedCity('');
      setCities([]);
      setData((prev) => ({ ...prev, location: null }));
      return;
    }

    const stateObj = states.find((s) => s.iso2 === val);
    if (!stateObj) return;

    setSelectedState(stateObj.name);
    setSelectedCity('');
    setCities([]);
    setData((prev) => ({ ...prev, location: null }));

    try {
      const res = await fetch(`/api/locations?type=cities&stateCode=${val}`);
      if (res.ok) {
        const cityData = await res.json();
        const sorted = cityData.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCities(sorted);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleCityChange = (cityName: string | null) => {
    const val = cityName || '';
    setSelectedCity(val);
    if (!val) {
      setData((prev) => ({ ...prev, location: null }));
      return;
    }
    const stateObj = states.find((s) => s.name === selectedState);
    if (stateObj) {
      setData((prev) => ({
        ...prev,
        location: {
          lat: parseFloat(stateObj.latitude) || 20.5937,
          lng: parseFloat(stateObj.longitude) || 78.9629,
          label: `${val}, ${selectedState}`,
        },
      }));
    }
  };

  // Helper for safety key check
  const stateNameKey = (name: string): string => {
    return name;
  };

  const canNext = () => {
    switch (step) {
      case 1: return data.name.length > 1;
      case 2: return data.crop.trim().length > 0;
      case 3: return data.area > 0;
      case 4: return data.location !== null;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 5) setStep((s) => (s + 1) as OnboardingStep);
  };
  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as OnboardingStep);
  };

  const handleFinish = async () => {
    try {
      await updateProfile({
        name: data.name,
        language: data.locale,
        crop: data.crop,
        farm_area: data.area,
        latitude: data.location?.lat || null,
        longitude: data.location?.lng || null,
        farm_name: 'Active Field',
      });
      router.push('/dashboard');
    } catch (err) {
      // Handled in auth provider toast
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/" className="transition-transform duration-150 hover:scale-[1.02]">
          <Logo />
        </Link>
        <span className="text-caption text-muted-foreground">
          {step}/{TOTAL_STEPS}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className={cn("w-full transition-all duration-300", step >= 4 ? "max-w-2xl" : "max-w-lg")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Profile */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-heading-1">{ob.steps.profile.title}</h1>
                    <p className="mt-2 text-body text-muted-foreground">{ob.steps.profile.description}</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>{ob.steps.profile.nameLabel}</Label>
                      <Input
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder={ob.steps.profile.namePlaceholder}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{ob.steps.profile.languageLabel}</Label>
                      <RadioGroup
                        value={data.locale}
                        onValueChange={(v) => {
                          const newLocale = v as Locale;
                          setData({ ...data, locale: newLocale });
                          setLocale(newLocale);
                        }}
                        className="grid grid-cols-2 gap-3"
                      >
                        {(['en', 'hi'] as Locale[]).map((loc) => (
                          <Label
                            key={loc}
                            htmlFor={`lang-${loc}`}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors',
                              data.locale === loc
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            )}
                          >
                            <RadioGroupItem value={loc} id={`lang-${loc}`} />
                            <span className="text-body font-medium">
                              {ob.steps.profile.languages[loc]}
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Farm Info */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-heading-1">{ob.steps.farm.title}</h1>
                    <p className="mt-2 text-body text-muted-foreground">{ob.steps.farm.description}</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>{ob.steps.farm.cropLabel} (Select all that apply)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1 pb-1">
                        {CROP_OPTIONS.map((opt) => {
                          const isSelected = selectedCrops.includes(opt.value);
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => handleToggleCrop(opt.value)}
                              className={cn(
                                'flex items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer select-none',
                                isSelected
                                  ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                                  : 'border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <span className="text-body-sm font-semibold capitalize">
                                {crops[opt.value as keyof typeof crops] || opt.value}
                              </span>
                              {isSelected && (
                                <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Area */}
              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-heading-1">{ob.steps.area.title}</h1>
                    <p className="mt-2 text-body text-muted-foreground">{ob.steps.area.description}</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>{ob.steps.area.areaLabel}</Label>
                      <Input
                        type="number"
                        value={data.area || ''}
                        onChange={(e) => setData({ ...data, area: Number(e.target.value) })}
                        placeholder={ob.steps.area.areaPlaceholder}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{ob.steps.area.unitLabel}</Label>
                      <RadioGroup
                        value={data.area_unit}
                        onValueChange={(v) => setData({ ...data, area_unit: v as 'acres' | 'hectares' })}
                        className="grid grid-cols-2 gap-3"
                      >
                        {(['acres', 'hectares'] as const).map((unit) => (
                          <Label
                            key={unit}
                            htmlFor={`unit-${unit}`}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors',
                              data.area_unit === unit
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            )}
                          >
                            <RadioGroupItem value={unit} id={`unit-${unit}`} />
                            <span className="text-body font-medium">{ob.steps.area[unit]}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Region Selection */}
              {step === 4 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-heading-1">Farm Location</h1>
                    <p className="mt-2 text-body text-muted-foreground">Select the state and city of your farm to load climate models.</p>
                  </div>
                  <div className="space-y-6">
                    {/* State Dropdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>State of India</Label>
                        {loadingLocations && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      </div>
                      <Select
                        value={states.find((s) => s.name === selectedState)?.iso2 || ''}
                        onValueChange={handleStateChange}
                        disabled={loadingLocations || states.length === 0}
                      >
                        <SelectTrigger className="w-full h-10 px-3 bg-background">
                          <SelectValue placeholder={loadingLocations ? "Loading states..." : "Select state"} />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.iso2} value={state.iso2}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Dropdown */}
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Select
                        value={selectedCity}
                        onValueChange={handleCityChange}
                        disabled={!selectedState || cities.length === 0}
                      >
                        <SelectTrigger className="w-full h-10 px-3 bg-background">
                          <SelectValue placeholder={selectedState ? (cities.length === 0 ? "Loading cities..." : "Select city") : "First select a state"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Coordinates Display */}
                    {data.location && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4"
                      >
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex gap-6">
                          <div>
                            <p className="text-caption text-muted-foreground">Latitude</p>
                            <p className="text-body-sm font-mono font-medium">{data.location.lat}° N</p>
                          </div>
                          <div>
                            <p className="text-caption text-muted-foreground">Longitude</p>
                            <p className="text-body-sm font-mono font-medium">{data.location.lng}° E</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-heading-1">{ob.steps.review.title}</h1>
                    <p className="mt-2 text-body text-muted-foreground">{ob.steps.review.description}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-elevated divide-y divide-border">
                    {[
                      { label: ob.steps.review.name, value: data.name },
                      { label: ob.steps.review.language, value: data.locale === 'en' ? 'English' : 'हिन्दी' },
                      { label: ob.steps.review.crop, value: data.crop.split(',').map((c) => crops[c.trim() as keyof typeof crops] || c.trim()).join(', ') },
                      { label: ob.steps.review.area, value: `${data.area} ${data.area_unit}` },
                      {
                        label: ob.steps.review.location,
                        value: data.location?.label || (data.location
                          ? `${data.location.lat}°, ${data.location.lng}°`
                          : '—'),
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between px-6 py-4">
                        <span className="text-body-sm text-muted-foreground">{item.label}</span>
                        <span className="text-body-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {ob.back}
            </Button>

            {step < 5 ? (
              <Button onClick={handleNext} disabled={!canNext()} className="gap-2">
                {ob.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingMessage || 'Saving profile...'}
                  </>
                ) : (
                  <>
                    {ob.finish}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
