
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import ShapeGrid from '@/components/ShapeGrid';
import LoadingTransition from '@/components/LoadingTransition';
import InteractiveBackground from '@/components/InteractiveBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loadModel } from '@/lib/modelLoader';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Check file size
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 50MB",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      toast({
        title: "Loading model",
        description: `Processing "${file.name}"...`,
      });
      
      // Store model metadata in sessionStorage
      sessionStorage.setItem('customModelName', file.name);
      sessionStorage.setItem('customModelFormat', file.name.split('.').pop()?.toLowerCase() || '');
      
      // We don't need to actually load the model here, just confirm the file is valid
      await loadModel(file);
      
      // Create a blob URL for the file and store it
      const fileURL = URL.createObjectURL(file);
      sessionStorage.setItem('customModelURL', fileURL);
      sessionStorage.setItem('customModelUploaded', 'true');
      
      toast({
        title: "Model loaded",
        description: `"${file.name}" loaded successfully!`,
      });
      
      // Navigate to view the custom model
      navigate('/view/customModel');
    } catch (error) {
      console.error('Error loading model:', error);
      toast({
        title: "Error loading model",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LoadingTransition isLoading={isLoading}>
      <InteractiveBackground />
      <div className="min-h-screen bg-background/80 backdrop-blur-sm text-foreground px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block animate-fade-in">
              <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full border border-primary/20 backdrop-blur-sm">
                Interactive Demo
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Surface Illumination
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore different rendering techniques and lighting models with interactive 3D shapes.
            </p>
            
            <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button className="gap-2" variant="outline" disabled={isUploading} asChild>
                  <span>
                    <Upload size={18} />
                    {isUploading ? 'Uploading...' : 'Upload Custom 3D Model'}
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".obj,.gltf,.glb,.stl"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Supported formats: OBJ, GLTF, GLB, STL
              </p>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ShapeGrid />
          </div>
        </div>
      </div>
    </LoadingTransition>
  );
};

export default Index;
