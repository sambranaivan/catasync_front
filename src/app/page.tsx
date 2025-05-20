import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UploadCloud } from 'lucide-react';

export default function HomePage() {
  const exampleHash = "e18324dd-a9c3-4f27-a0d1-c37656150c70"; // Example hash from prompt

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-background">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-6">
            <UploadCloud size={40} />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">Bienvenido a CAT ASYNC</CardTitle>
          <CardDescription className="text-lg text-foreground/80 pt-2">
            Sube tus archivos de forma segura utilizando un identificador único.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-md text-muted-foreground">
            Para utilizar el cargador, necesitas una URL específica que se te proporcionó, la cual incluye un hash único. Por ejemplo:
            <code className="block bg-muted text-muted-foreground px-3 py-2 rounded-md font-mono text-sm my-2 break-all">
              tu-sitio-web/{exampleHash}
            </code>
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={`/${exampleHash}`}>
              Ver Página de Carga de Ejemplo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
