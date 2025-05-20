
"use client";

import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadFormProps {
  uploadUrl: string;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ uploadUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    setUploadProgress(0);
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "Ningún Archivo Seleccionado",
        description: "Por favor, selecciona un archivo para subir.",
        variant: "destructive",
      });
      setStatusMessage({ type: 'error', title: 'Error', message: 'Por favor, selecciona un archivo para subir.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    setUploadProgress(0); // Iniciar progreso en 0

    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' es un nombre común para el campo del archivo

    try {
      setUploadProgress(10); // Mostrar un progreso inicial pequeño

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        // El navegador establece Content-Type automáticamente para FormData
      });

      if (response.ok) {
        setUploadProgress(100);
        const successMsg = `¡Archivo "${selectedFile.name}" subido exitosamente!`;
        toast({
          title: "Carga Exitosa",
          description: successMsg,
        });
        setStatusMessage({ type: 'success', title: '¡Éxito!', message: successMsg });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Resetear el input de archivo
        }
      } else {
        setUploadProgress(0); // Resetear progreso en caso de error
        let errorDetails = '';
        try {
            const errorData = await response.json();
            errorDetails = errorData.message || JSON.stringify(errorData);
        } catch (e) {
            errorDetails = await response.text();
        }
        const errorMsg = `Error al subir el archivo: ${response.status} ${response.statusText}. ${errorDetails ? `Detalles: ${errorDetails}`: ''}`;
        toast({
          title: "Error de Carga",
          description: errorMsg,
          variant: "destructive",
        });
        setStatusMessage({ type: 'error', title: 'Error', message: errorMsg });
      }
    } catch (error: any) {
      setUploadProgress(0); // Resetear progreso en caso de error de red
      const errorMsg = `Ocurrió un error de red o un problema inesperado: ${error.message || 'Error desconocido'}`;
      toast({
        title: "Error de Carga",
        description: errorMsg,
        variant: "destructive",
      });
      setStatusMessage({ type: 'error', title: 'Error', message: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 shadow-md">
          <UploadCloud size={32} />
        </div>
        <CardTitle className="text-3xl font-bold">CAT ASYNC</CardTitle>
        <CardDescription className="text-md pt-1">Sube tu archivo de forma segura y eficiente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="sr-only">Seleccionar archivo</label>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-foreground
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90
                         focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="file-description"
            />
            <p id="file-description" className="text-xs text-muted-foreground mt-1.5">Selecciona un único archivo para subir.</p>
          </div>

          {selectedFile && !isUploading && (
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md text-sm border">
              <FileText size={20} className="text-primary shrink-0" />
              <span className="font-medium truncate flex-1" title={selectedFile.name}>{selectedFile.name}</span>
              <span className="text-muted-foreground whitespace-nowrap">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
          )}

          {(isUploading || (statusMessage?.type === 'success' && uploadProgress === 100)) && (
            <div className="space-y-2 pt-2">
              <Progress value={uploadProgress} aria-label="Progreso de carga" className="w-full h-2.5 [&>div]:bg-accent" />
              <p className="text-sm text-center text-accent-foreground">{statusMessage?.type === 'success' && uploadProgress === 100 ? '¡Completado!' : (isUploading ? `${uploadProgress}% subiendo...` : `${uploadProgress}%`)}</p>
            </div>
          )}

          {statusMessage && statusMessage.type !== 'success' && (
             <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
              {statusMessage.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              <AlertTitle className="font-semibold">{statusMessage.title}</AlertTitle>
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}
           {statusMessage && statusMessage.type === 'success' && !isUploading && (
             <Alert variant='default' className='bg-accent/10 border-accent text-accent-foreground [&>svg]:text-accent-foreground'>
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle className="font-semibold">{statusMessage.title}</AlertTitle>
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isUploading || !selectedFile} className="w-full font-semibold text-base py-3 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" />
                Subir Archivo
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-center pt-4">
        <p>Tu archivo será enviado a un servidor seguro.</p>
      </CardFooter>
    </Card>
  );
};

export default FileUploadForm;

