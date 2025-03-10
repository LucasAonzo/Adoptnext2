/**
 * Test Components Page
 * 
 * This page is used to test UI components after migration to pure Tailwind CSS.
 */

import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Terminal, Bell } from "lucide-react";

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Component Tests</h1>
      
      {/* Badge Component Tests */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Badge Component</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium w-24">Default:</h3>
            <Badge>Default Badge</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium w-24">Secondary:</h3>
            <Badge variant="secondary">Secondary Badge</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium w-24">Destructive:</h3>
            <Badge variant="destructive">Destructive Badge</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium w-24">Outline:</h3>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </div>
      </section>
      
      {/* Alert Component Tests */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Alert Component</h2>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Default Alert:</h3>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This is a default alert with some information.
              </AlertDescription>
            </Alert>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Destructive Alert:</h3>
            <Alert variant="destructive">
              <Bell className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is a destructive alert for critical errors or warnings.
              </AlertDescription>
            </Alert>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Alert without icon:</h3>
            <Alert>
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This is an alert without an icon.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
      
      {/* Label Component Tests */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Label Component</h2>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Label:</h3>
            <Label htmlFor="basic-input">Basic Label</Label>
            <Input id="basic-input" className="mt-1 w-64" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Label with Checkbox:</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Disabled Label:</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled-checkbox" disabled />
              <Label htmlFor="disabled-checkbox" className="peer-disabled:text-muted-foreground">
                This label is associated with a disabled element
              </Label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 