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
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const t = await getTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Classroom Finance App</CardTitle>
          <CardDescription>
            {t('auth.login')}
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="text-blue-800 font-medium mb-2">📧 {t('auth.magicLinkSent')}</p>
            <p className="text-blue-700">
              Magic link access for editors and viewers. Password login is for admins only.
            </p>
          </div>
        </div>

        <form action={loginAction}>
          <CardContent className="space-y-4">
            {error === "invalid" && (
              <div className="text-sm text-destructive text-center">
                {t('auth.invalidToken')}
              </div>
            )}
            {error === "server" && (
              <div className="text-sm text-destructive text-center">
                {t('common.messages.error')}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">{t('common.labels.name')}</Label>
              <Input
                id="username"
                name="username"
                type="username"
                placeholder="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4" type="submit">
              {t('auth.login')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
