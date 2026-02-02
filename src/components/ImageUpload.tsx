import { useState, useRef } from "react";
import { Camera, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    existingImageUrl?: string | null;
}

export const ImageUpload = ({ onImageSelect, existingImageUrl }: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate file size
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                onImageSelect(file);
            };
            reader.onerror = () => {
                toast.error('Failed to read image file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full mt-4">
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-muted group"
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-full"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full md:hidden bg-black/50 hover:bg-black/70 text-white border-none"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline"
                            type="button"
                            className={cn(
                                "w-full h-14 border-dashed border-2 rounded-xl flex flex-row items-center justify-center gap-2 text-muted-foreground",
                                "hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-4 h-4" />
                            <span className="text-sm font-medium">Add optional photo (Max 5MB)</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
