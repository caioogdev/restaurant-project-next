import { useState } from "react";
import { Button } from "../ui/button";
import { LogIn, MapPinned, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { InputComponent } from "@/components/input";

export default function Header() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = () => {
    console.log("Redirecionando para autenticação com o Google...");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-red-600">ClickMesa</h1>
          <MapPinned />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <LogIn />
              Entrar
            </Button>
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center justify-center p-6">
            <div className="flex w-[450px] flex-col justify-center gap-4 rounded-lg">

              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Acessar Painel</h1>
                <p className="text-sm text-muted-foreground">Login obrigatório para acessar aplicação</p>
              </div>

              <div className="space-y-4">
                
                <div className="space-y-1">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail..."
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Sua senha:</Label>
                  <InputComponent
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha..."
                    icon={
                      <div onClick={togglePasswordVisibility}>
                        {showPassword ? <Eye className="h-5 w-5 text-zinc-500" /> : <EyeOff className="h-5 w-5 text-zinc-500" />}
                      </div>
                    }
                  />
                </div>

              </div>

                <div className="flex justify-end underline">
                  <span className="text-red-500 text-sm">Redefinir minha senha</span>
                </div>

                <Button className="w-full" type="submit">
                  Acessar
                </Button>
              

              <div className="flex justify-center items-center gap-3 mt-2">
                <Separator className="w-[45%]" />
                <span className="text-xs text-muted-foreground">OU</span>
                <Separator className="w-[45%]" />
              </div>

              {/* Botão para login com Google */}
              <Button variant="outline" className="flex items-center justify-center w-full gap-2" onClick={handleGoogleAuth}>
                <img src="/images/GmailIcon.svg" alt="Google Icon" />
                Continuar com Google
              </Button>

            </div>

            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}