"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function MagicLinksClient() {
  const t = useTranslations();
  const [username, setUsername] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{ editorLink: string, viewerLink: string; } | null>(null);
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return response.json();
    },
  });

  const { data: existingUsers = [] } = useQuery({
    queryKey: ["magic-links"],
    queryFn: async () => {
      const response = await fetch("/api/magic-links");
      return response.json();
    },
  });

  const generateLinkMutation = useMutation({
    mutationFn: async (data: { username: string; }) => {
      const response = await fetch("/api/magic-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLinks({ editorLink: data.editorLink, viewerLink: data.viewerLink });
      toast.success(t('admin.magicLinksGenerated'));
      setUsername("");
      queryClient.invalidateQueries({ queryKey: ["magic-links"] });
    },
    onError: () => {
      toast.error(t('admin.errorGeneratingMagicLinks'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error(t('admin.selectUser'));
      return;
    }
    generateLinkMutation.mutate({ username });
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success(t('admin.linkCopied'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.magicLinks')}</h1>
        <p className="text-muted-foreground">
          {t('admin.generateAccessLinks')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.generateNewLinks')}</CardTitle>
            <CardDescription>
              {t('admin.generateNewLinksDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="mb-2">{t('admin.user')}</Label>
                <Select value={username} onValueChange={setUsername}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectUser')} />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.filter((user: any) => user.role !== "ADMIN").map((user: any) => (
                      <SelectItem key={user.id} value={user.username}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={generateLinkMutation.isPending}
              >
                <Link className="size-4 mr-2" />
                {generateLinkMutation.isPending ? t('common.buttons.generating') : t('admin.generateMagicLinks')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedLinks && (
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.generatedLinks')}</CardTitle>
              <CardDescription>
                {t('admin.shareLinksWithUser')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">{t('admin.editorLink')}</Label>
                  <div className="p-3 bg-muted rounded-md break-all text-sm mb-2">
                    {generatedLinks.editorLink}
                  </div>
                  <Button onClick={() => copyToClipboard(generatedLinks.editorLink)} className="w-full" size="sm">
                    <Copy className="size-4 mr-2" />
                    {t('admin.copyEditorLink')}
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('admin.viewerLink')}</Label>
                  <div className="p-3 bg-muted rounded-md break-all text-sm mb-2">
                    {generatedLinks.viewerLink}
                  </div>
                  <Button onClick={() => copyToClipboard(generatedLinks.viewerLink)} className="w-full" size="sm" variant="outline">
                    <Copy className="size-4 mr-2" />
                    {t('admin.copyViewerLink')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lista de Usuários Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.usersWithActiveLinks')}</CardTitle>
          <CardDescription>
            {t('admin.activeLinksDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.user')}</TableHead>
                <TableHead>{t('admin.editorLink')}</TableHead>
                <TableHead>{t('admin.viewerLink')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(existingUsers) && existingUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.editorLink ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(user.editorLink)}
                      >
                        <Copy className="size-4 mr-2" />
                        {t('admin.copyEditor')}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('admin.noLinkGenerated')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.viewerLink ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(user.viewerLink)}
                      >
                        <Copy className="size-4 mr-2" />
                        {t('admin.copyViewer')}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('admin.noLinkGenerated')}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!Array.isArray(existingUsers) || existingUsers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {t('admin.noUsersWithActiveLinks')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
