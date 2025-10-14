
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as THREE from 'three';

interface TransformationControlsProps {
    b1Pos: THREE.Vector3;
    b2Pos: THREE.Vector3;
    determinant: number;
    coords: { x: number, y: number };
    onCoordsChange: (coords: { x: number, y: number }) => void;
    onPresetChange: (preset: 'reset' | 'shear' | 'rotate' | 'scale') => void;
    mode: 'explore' | 'rotation';
    onModeChange: (mode: 'explore' | 'rotation') => void;
    rotationAngle: number;
    onRotationChange: (angle: number) => void;
    vectorV: THREE.Vector3;
}

export function TransformationControls({
    b1Pos,
    b2Pos,
    determinant,
    coords,
    onCoordsChange,
    onPresetChange,
    mode,
    onModeChange,
    rotationAngle,
    onRotationChange,
    vectorV,
}: TransformationControlsProps) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center p-4 rounded-lg border bg-muted/50">
                <div className="text-center">
                    <Label className="font-semibold">Transformation Matrix (M)</Label>
                    <div className="font-mono text-xl mt-1 p-2 bg-background rounded-md">
                        <div className="flex justify-center items-center">
                            <div className="text-3xl font-thin">[</div>
                            <div className="grid grid-cols-2 gap-x-4 w-32 text-center">
                                <div className="text-orange-400">{b1Pos.x.toFixed(2)}</div>
                                <div className="text-green-300">{b2Pos.x.toFixed(2)}</div>
                                <div className="text-orange-400">{b1Pos.y.toFixed(2)}</div>
                                <div className="text-green-300">{b2Pos.y.toFixed(2)}</div>
                            </div>
                            <div className="text-3xl font-thin">]</div>
                        </div>
                         <div className={cn("text-xs mt-1", determinant < 0 ? 'text-red-400' : 'text-muted-foreground')}>
                            det(M) = {determinant.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-center block">Preset Transformations</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => onPresetChange('reset')}>Reset</Button>
                        <Button variant="outline" size="sm" onClick={() => onPresetChange('shear')}>Shear</Button>
                        <Button variant="outline" size="sm" onClick={() => onPresetChange('rotate')}>Rotate 90°</Button>
                        <Button variant="outline" size="sm" onClick={() => onPresetChange('scale')}>Scale 2x</Button>
                        <Button variant={mode === 'rotation' ? 'default' : 'outline'} size="sm" className="col-span-2" onClick={() => onModeChange(mode === 'rotation' ? 'explore' : 'rotation')}>Rotation Detective</Button>
                    </div>
                </div>
            </div>
            {mode === 'rotation' && (
                 <Alert className="mb-4 border-blue-500/50">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="font-semibold text-blue-400">Rotation Detective Mode</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-3 mt-2">
                             <Label>Rotate Basis by: {rotationAngle.toFixed(0)}°</Label>
                             <Slider min={0} max={360} step={1} value={[rotationAngle]} onValueChange={(v) => onRotationChange(v[0])} />
                             <p className="text-xs text-muted-foreground">✓ Lengths preserved: |b₁| = {b1Pos.length().toFixed(2)}, |b₂| = {b2Pos.length().toFixed(2)}</p>
                             <p className="text-xs text-muted-foreground">✓ Angle preserved: {(b1Pos.angleTo(b2Pos) * 180 / Math.PI).toFixed(0)}°</p>
                             <p className="text-xs text-muted-foreground">✓ Determinant preserved: {determinant.toFixed(2)}</p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-lg border bg-muted/50 items-center">
                <div className="text-center">
                    <Label className="font-semibold text-primary">Coordinates in New Basis</Label>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Input className="w-20 h-8 text-center" type="number" step="0.1" value={coords.x} onChange={e => onCoordsChange({...coords, x: parseFloat(e.target.value) || 0})} />
                        <Input className="w-20 h-8 text-center" type="number" step="0.1" value={coords.y} onChange={e => onCoordsChange({...coords, y: parseFloat(e.target.value) || 0})} />
                    </div>
                </div>
                 <div className="text-2xl font-bold text-muted-foreground text-center">=</div>
                 <div className="text-center">
                    <Label className="font-semibold">Resulting Vector (v)</Label>
                     <div className="font-mono text-lg p-2 mt-2">
                        {`[${vectorV.x.toFixed(2)}, ${vectorV.y.toFixed(2)}]`}
                    </div>
                </div>
            </div>
        </div>
    );
}

