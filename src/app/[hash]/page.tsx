import type { Metadata } from 'next';
import FileUploadForm from '@/components/file-upload-form';
import { AlertTriangle } from 'lucide-react';

type Props = {
  params: { hash: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Upload File | File Shuttle`,
    description: `Upload a file using the provided identifier.`, 
  };
}

export default function FileUploadPage({ params }: Props) {
  const { hash } = params;
  // Basic UUID validation (common format for such hashes)
  const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(hash);

  if (!isValidUUID) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
        <div className="w-full max-w-md text-center bg-card p-8 rounded-lg shadow-xl">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold text-destructive">Invalid Upload Link</h1>
          <p className="text-muted-foreground mt-2">
            The link you followed appears to be invalid or malformed. Please check the link and try again.
          </p>
        </div>
      </main>
    );
  }
  
  const uploadUrl = `https://desacriminis.juscorrientes.gov.ar/api/cat/upload/${hash}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <FileUploadForm uploadUrl={uploadUrl} />
    </main>
  );
}
