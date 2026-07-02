'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, Map, Eye, Save, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer, CROP_OPTIONS } from '@/lib/constants';
import { farmFieldsFromProfile, withSoilPresets, type FarmModelFields } from '@/lib/farm-fields';
import { FarmModelFieldsForm } from '@/components/farm/farm-model-fields-form';
import { useSoilGrids } from '@/hooks/use-soil-grids';
import type { CropType } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsPage() {
  const { dictionary, locale, setLocale } = useI18n();
  const s = dictionary.settings;
  const crops = dictionary.crops;
  const { profile, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [farmName, setFarmName] = useState('');
  const [farmCrop, setFarmCrop] = useState<string>('');
  const [farmArea, setFarmArea] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares'>('acres');
  const [farmFields, setFarmFields] = useState<FarmModelFields>(farmFieldsFromProfile({}));

  const [saving, setSaving] = useState(false);
  const { fetchSoil, loading: soilLoading, error: soilError, soilData } = useSoilGrids();

  const refreshSoilFromProfile = async () => {
    if (profile?.latitude == null || profile?.longitude == null) {
      toast.error('Set your farm location first to fetch soil data.');
      return;
    }
    const updates = await fetchSoil(profile.latitude, profile.longitude);
    setFarmFields((prev) => ({ ...prev, ...withSoilPresets(updates ?? {}) }));
    if (updates) {
      toast.success('Soil values updated from ISRIC SoilGrids.');
    } else {
      toast.message('SoilGrids unavailable — using typical cropland defaults.');
    }
  };

  // Sync inputs with profile data once loaded
  useEffect(() => {
    if (profile) {
      setUserName(profile.name || '');
      setUserEmail(profile.email || '');
      setFarmName(profile.farm_name || '');
      setFarmCrop(profile.crop || '');
      setFarmArea(profile.farm_area || 0);
      setAreaUnit(profile.area_unit || 'acres');
      setFarmFields(farmFieldsFromProfile(profile));
    }
  }, [profile]);

  const selectedCrops = farmCrop ? farmCrop.split(',').map(c => c.trim()).filter(Boolean) : [];
  
  const handleToggleCrop = (cropVal: string) => {
    let nextCrops;
    if (selectedCrops.includes(cropVal)) {
      nextCrops = selectedCrops.filter(c => c !== cropVal);
    } else {
      nextCrops = [...selectedCrops, cropVal];
    }
    setFarmCrop(nextCrops.join(','));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: userName });
      toast.success('Profile settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFarm = async () => {
    setSaving(true);
    try {
      await updateProfile({
        farm_name: farmName,
        crop: farmCrop,
        farm_area: Number(farmArea),
        area_unit: areaUnit,
        state_name: farmFields.state_name,
        season: farmFields.season,
        annual_rainfall: farmFields.annual_rainfall,
        fertilizer_kg: farmFields.fertilizer_kg,
        pesticide_kg: farmFields.pesticide_kg,
        land_cover: farmFields.land_cover,
        soil_type: farmFields.soil_type,
        elevation_m: farmFields.elevation_m,
        near_river: farmFields.near_river,
        historical_floods: farmFields.historical_floods,
        soil_n: farmFields.soil_n,
        soil_p: farmFields.soil_p,
        soil_k: farmFields.soil_k,
        soil_ph: farmFields.soil_ph,
        expected_rainfall_mm: farmFields.expected_rainfall_mm,
      });
      toast.success('Farm settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save farm settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (lang: 'en' | 'hi') => {
    setLocale(lang);
    try {
      await updateProfile({ language: lang });
      toast.success(lang === 'en' ? 'Interface language set to English' : 'इंटरफ़ेस भाषा हिन्दी में सेट की गई');
    } catch (err: any) {
      console.error('Failed to sync language settings with profile:', err);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 select-none"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-heading-1">{s.title}</h1>
        <p className="mt-1 text-body text-muted-foreground">{s.subtitle}</p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-muted p-1">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2 text-body-sm rounded-lg cursor-pointer">
              <User className="h-4 w-4" />
              {s.tabs.profile}
            </TabsTrigger>
            <TabsTrigger value="farm" className="flex items-center gap-2 px-4 py-2 text-body-sm rounded-lg cursor-pointer">
              <Map className="h-4 w-4" />
              {s.tabs.farm}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 px-4 py-2 text-body-sm rounded-lg cursor-pointer">
              <Eye className="h-4 w-4" />
              {s.tabs.preferences}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 outline-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-heading-4">{s.profile.title}</CardTitle>
                <CardDescription>Manage your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">{s.profile.name}</Label>
                  <Input
                    id="profile-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">{s.profile.email}</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={userEmail}
                    disabled
                    className="opacity-60 bg-muted cursor-not-allowed"
                  />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSaveProfile} disabled={saving} className="gap-2 cursor-pointer">
                    <Save className="h-4 w-4" />
                    {s.profile.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farm Tab */}
          <TabsContent value="farm" className="space-y-4 outline-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-heading-4">Farm Details</CardTitle>
                <CardDescription>Update your agricultural area and crop configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3 col-span-1 sm:col-span-2">
                    <Label>Active Crops (Select all that apply)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[160px] overflow-y-auto pr-1 pb-1">
                      {CROP_OPTIONS.map((opt) => {
                        const isSelected = selectedCrops.includes(opt.value);
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleToggleCrop(opt.value)}
                            className={cn(
                              'flex items-center justify-between rounded-lg border p-2.5 text-left transition-all duration-200 cursor-pointer select-none text-caption',
                              isSelected
                                ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                                : 'border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <span className="font-semibold capitalize">
                              {crops[opt.value as keyof typeof crops] || opt.value}
                            </span>
                            {isSelected && (
                              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <Label htmlFor="farm-name">Farm Name</Label>
                    <Input
                      id="farm-name"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Valley Farm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 col-span-1 sm:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="farm-area">Area Size</Label>
                      <Input
                        id="farm-area"
                        type="number"
                        value={farmArea || ''}
                        onChange={(e) => setFarmArea(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={areaUnit} onValueChange={(v) => setAreaUnit((v || 'acres') as 'acres' | 'hectares')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="hectares">Hectares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <FarmModelFieldsForm
                  values={farmFields}
                  onChange={(updates) => setFarmFields((prev) => ({ ...prev, ...updates }))}
                  showState
                  soilData={soilData}
                  soilLoading={soilLoading}
                  soilError={soilError}
                  onRefreshSoil={refreshSoilFromProfile}
                />

                <div className="pt-2">
                  <Button onClick={handleSaveFarm} disabled={saving} className="gap-2 cursor-pointer">
                    <Save className="h-4 w-4" />
                    {s.profile.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 outline-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-heading-4">{s.preferences.title}</CardTitle>
                <CardDescription>Configure language, units, and system overrides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <Label className="text-body-sm font-semibold">{s.preferences.language}</Label>
                    <p className="text-caption text-muted-foreground mt-0.5">Select your primary user interface language</p>
                  </div>
                  <RadioGroup
                    value={locale}
                    onValueChange={(v) => handleLanguageChange(v as 'en' | 'hi')}
                    className="flex gap-2 bg-muted p-1 rounded-xl"
                  >
                    <Label
                      htmlFor="pref-lang-en"
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-caption font-medium transition-colors',
                        locale === 'en' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                      )}
                    >
                      <RadioGroupItem value="en" id="pref-lang-en" className="sr-only" />
                      English
                    </Label>
                    <Label
                      htmlFor="pref-lang-hi"
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-caption font-medium transition-colors',
                        locale === 'hi' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                      )}
                    >
                      <RadioGroupItem value="hi" id="pref-lang-hi" className="sr-only" />
                      हिन्दी
                    </Label>
                  </RadioGroup>
                </div>

                {/* System Units */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Label className="text-body-sm font-semibold">{s.preferences.units}</Label>
                    <p className="text-caption text-muted-foreground mt-0.5">Choose measurement standard for soil moisture & area metrics</p>
                  </div>
                  <RadioGroup
                    defaultValue="metric"
                    className="flex gap-2 bg-muted p-1 rounded-xl"
                  >
                    <Label
                      htmlFor="units-metric"
                      className="flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-caption font-medium bg-background text-foreground shadow-xs"
                    >
                      <RadioGroupItem value="metric" id="units-metric" className="sr-only" />
                      {s.preferences.metric}
                    </Label>
                    <Label
                      htmlFor="units-imperial"
                      className="flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-caption font-medium text-muted-foreground"
                    >
                      <RadioGroupItem value="imperial" id="units-imperial" className="sr-only" />
                      {s.preferences.imperial}
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
