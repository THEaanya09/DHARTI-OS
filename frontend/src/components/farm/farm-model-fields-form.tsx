'use client';

import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  HISTORICAL_FLOODS_OPTIONS,
  LAND_COVER_OPTIONS,
  SEASON_OPTIONS,
  SOIL_TYPE_OPTIONS,
  type FarmModelFields,
} from '@/lib/farm-fields';
import type { SoilPropertiesResponse } from '@/lib/soil-mapper';
import { cn } from '@/lib/utils';

interface FarmModelFieldsFormProps {
  values: FarmModelFields;
  onChange: (updates: Partial<FarmModelFields>) => void;
  showState?: boolean;
  className?: string;
  soilData?: SoilPropertiesResponse | null;
  soilLoading?: boolean;
  soilError?: string | null;
  onRefreshSoil?: () => void;
}

export function FarmModelFieldsForm({
  values,
  onChange,
  showState = false,
  className,
  soilData,
  soilLoading = false,
  soilError,
  onRefreshSoil,
}: FarmModelFieldsFormProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <section className="space-y-4">
        <div>
          <h3 className="text-heading-4">Crop & yield inputs</h3>
          <p className="text-caption text-muted-foreground mt-1">
            Used by the crop yield model — season, rainfall, and inputs applied this year.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {showState && (
            <div className="space-y-2 sm:col-span-2">
              <Label>State</Label>
              <Input
                value={values.state_name || ''}
                onChange={(e) => onChange({ state_name: e.target.value })}
                placeholder="e.g. Punjab"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Growing season</Label>
            <Select value={values.season || ''} onValueChange={(v) => onChange({ season: v || null })}>
              <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
              <SelectContent>
                {SEASON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Annual rainfall (mm)</Label>
            <Input
              type="number"
              min={0}
              value={values.annual_rainfall ?? ''}
              onChange={(e) => onChange({ annual_rainfall: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 650"
            />
          </div>
          <div className="space-y-2">
            <Label>Fertilizer used (kg)</Label>
            <Input
              type="number"
              min={0}
              value={values.fertilizer_kg ?? ''}
              onChange={(e) => onChange({ fertilizer_kg: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 120"
            />
          </div>
          <div className="space-y-2">
            <Label>Pesticide used (kg)</Label>
            <Input
              type="number"
              min={0}
              value={values.pesticide_kg ?? ''}
              onChange={(e) => onChange({ pesticide_kg: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 15"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-heading-4">Flood risk inputs</h3>
          <p className="text-caption text-muted-foreground mt-1">
            Land characteristics and flood history for your field location.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Land cover</Label>
            <Select value={values.land_cover || 'Agricultural'} onValueChange={(v) => onChange({ land_cover: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LAND_COVER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Soil type</Label>
            <Select value={values.soil_type || 'Loam'} onValueChange={(v) => onChange({ soil_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SOIL_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Field elevation (m)</Label>
            <Input
              type="number"
              min={0}
              value={values.elevation_m ?? ''}
              onChange={(e) => onChange({ elevation_m: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 250"
            />
          </div>
          <div className="space-y-2">
            <Label>Flood history (last 10 years)</Label>
            <Select
              value={String(values.historical_floods ?? 0)}
              onValueChange={(v) => onChange({ historical_floods: Number(v) })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {HISTORICAL_FLOODS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Near a major river or canal?</Label>
            <RadioGroup
              value={values.near_river ? 'yes' : 'no'}
              onValueChange={(v) => onChange({ near_river: v === 'yes' })}
              className="flex gap-3"
            >
              <Label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5">
                <RadioGroupItem value="yes" /> Yes
              </Label>
              <Label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5">
                <RadioGroupItem value="no" /> No
              </Label>
            </RadioGroup>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-heading-4">Soil test & recommendation inputs</h3>
            <p className="text-caption text-muted-foreground mt-1">
              Auto-filled from ISRIC SoilGrids using your farm coordinates. Override any value if you have a lab report.
            </p>
          </div>
          {onRefreshSoil && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefreshSoil}
              disabled={soilLoading}
              className="shrink-0"
            >
              {soilLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {soilLoading ? 'Fetching…' : 'Refresh from SoilGrids'}
            </Button>
          )}
        </div>

        {soilLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-body-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading soil properties from ISRIC SoilGrids…
          </div>
        )}

        {soilError && !soilLoading && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-body-sm text-amber-800 dark:text-amber-200">
            Could not reach SoilGrids — showing typical cropland defaults (N 90, P 42, K 43, pH 6.5). Edit below if you have lab results.
          </div>
        )}

        {soilData && !soilLoading && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-body-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Fetched from {soilData.source}
              {soilData.wrb_class ? ` · ${soilData.wrb_class}` : ''}
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5 text-body-sm">
              {soilData.phh2o != null && (
                <div>
                  <p className="text-caption text-muted-foreground">pH</p>
                  <p className="font-mono font-medium">{soilData.phh2o}</p>
                </div>
              )}
              {soilData.nitrogen != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Nitrogen</p>
                  <p className="font-mono font-medium">{soilData.nitrogen} g/kg</p>
                </div>
              )}
              {soilData.clay != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Clay</p>
                  <p className="font-mono font-medium">{soilData.clay}%</p>
                </div>
              )}
              {soilData.sand != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Sand</p>
                  <p className="font-mono font-medium">{soilData.sand}%</p>
                </div>
              )}
              {soilData.silt != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Silt</p>
                  <p className="font-mono font-medium">{soilData.silt}%</p>
                </div>
              )}
              {soilData.organic_carbon != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Organic C</p>
                  <p className="font-mono font-medium">{soilData.organic_carbon} g/kg</p>
                </div>
              )}
              {soilData.cec != null && (
                <div>
                  <p className="text-caption text-muted-foreground">CEC</p>
                  <p className="font-mono font-medium">{soilData.cec} cmol/kg</p>
                </div>
              )}
              {soilData.bulk_density != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Bulk density</p>
                  <p className="font-mono font-medium">{soilData.bulk_density} kg/dm³</p>
                </div>
              )}
              {soilData.soil_organic_matter != null && (
                <div>
                  <p className="text-caption text-muted-foreground">Organic matter</p>
                  <p className="font-mono font-medium">{soilData.soil_organic_matter} g/kg</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nitrogen — N (kg/ha)</Label>
            <Input
              type="number"
              min={0}
              value={values.soil_n ?? ''}
              onChange={(e) => onChange({ soil_n: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 90"
            />
          </div>
          <div className="space-y-2">
            <Label>Phosphorus — P (kg/ha)</Label>
            <Input
              type="number"
              min={0}
              value={values.soil_p ?? ''}
              onChange={(e) => onChange({ soil_p: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 42"
            />
          </div>
          <div className="space-y-2">
            <Label>Potassium — K (kg/ha)</Label>
            <Input
              type="number"
              min={0}
              value={values.soil_k ?? ''}
              onChange={(e) => onChange({ soil_k: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 43"
            />
          </div>
          <div className="space-y-2">
            <Label>Soil pH</Label>
            <Input
              type="number"
              min={0}
              max={14}
              step={0.1}
              value={values.soil_ph ?? ''}
              onChange={(e) => onChange({ soil_ph: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 6.5"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Expected seasonal rainfall (mm)</Label>
            <Input
              type="number"
              min={0}
              value={values.expected_rainfall_mm ?? ''}
              onChange={(e) => onChange({ expected_rainfall_mm: e.target.value ? Number(e.target.value) : null })}
              placeholder="Leave blank to use annual rainfall"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
