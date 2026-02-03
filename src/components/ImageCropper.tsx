import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import getCroppedImg from '@/lib/cropImage'
import { Loader2 } from 'lucide-react'

interface ImageCropperProps {
    imageSrc: string | null
    onCropComplete: (croppedImageBlob: Blob) => void
    onCancel: () => void
    open: boolean
}

export const ImageCropper = ({ imageSrc, onCropComplete, onCancel, open }: ImageCropperProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropAreaChange = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleCropImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return
        setIsProcessing(true)
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
            onCropComplete(croppedImage)
        } catch (e) {
            console.error(e)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-64 bg-black rounded-md overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onCropComplete={onCropAreaChange}
                            onZoomChange={onZoomChange}
                        />
                    )}
                </div>
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-12">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button onClick={handleCropImage} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Crop & Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
