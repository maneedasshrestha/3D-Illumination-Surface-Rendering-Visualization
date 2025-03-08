
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import ShapeGrid from '@/components/ShapeGrid';
import LoadingTransition from '@/components/LoadingTransition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demonstration purposes - in a real app you would process the 3D model file
      // and create a URL for it or store it in state
      toast({
        title: "Model Upload",
        description: `Custom model "${file.name}" would be uploaded and processed here`,
      });
      
      // Navigate to a special view for custom models - in a real implementation
      // you would pass the model data or URL
      navigate('/view/customModel');
    }
  };

  return (
    <LoadingTransition isLoading={isLoading}>
      <div className="min-h-screen bg-background text-foreground px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
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
              <label htmlFor="file-upload">
                <Button className="gap-2" variant="outline">
                  <Upload size={18} />
                  Upload Custom 3D Model
                  <input
                    id="file-upload"
                    type="file"
                    accept=".obj,.gltf,.glb,.stl"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Button>
              </label>
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
