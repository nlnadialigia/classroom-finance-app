import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/login-form";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema Financeiro Escolar</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="text-blue-800 font-medium mb-2">📧 Acesso para Usuários</p>
            <p className="text-blue-700">
              Se você é um usuário comum (editor ou visualizador), utilize o link mágico 
              enviado pelo administrador. O login com senha é apenas para administradores.
            </p>
          </div>
        </div>

        <form action={loginAction}>
          <CardContent className="space-y-4">
            {error === "invalid" && (
              <div className="text-sm text-destructive text-center">
                Usuário ou senha inválidos
              </div>
            )}
            {error === "server" && (
              <div className="text-sm text-destructive text-center">
                Erro interno do servidor
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="username"
                placeholder="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4" type="submit">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
