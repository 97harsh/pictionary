
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { APPS, App } from '@/lib/apps';
import { ArrowRight } from 'lucide-react';

export default function AppHub() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPS.filter((app) =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-primary">App Hub</h1>
          <p className="text-muted-foreground mt-2">Discover and launch a variety of games and tools.</p>
        </header>

        <div className="mb-8 max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Search for an app..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-lg p-6 rounded-full shadow-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="flex flex-col group hover:border-primary transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                    {app.icon && <app.icon className="h-8 w-8 text-primary" />}
                    <CardTitle className="text-2xl">{app.title}</CardTitle>
                </div>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link href={app.href} className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Launch App <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredApps.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No apps found matching your search.</p>
            </div>
        )}
            </div>
            <footer className="w-full mt-12">
              <div className="max-w-4xl mx-auto text-center py-6 text-sm text-muted-foreground">
                Harsh Sharma | harshsrharsh@gmail.com
              </div>
            </footer>
    </main>
  );
}
