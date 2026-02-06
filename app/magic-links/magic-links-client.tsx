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

export function MagicLinksClient() {
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
      toast.success("Links mágicos gerados com sucesso!");
      setUsername("");
      queryClient.invalidateQueries({ queryKey: ["magic-links"] });
    },
    onError: () => {
      toast.error("Erro ao gerar links mágicos");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("Selecione um usuário");
      return;
    }
    generateLinkMutation.mutate({ username });
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Links Mágicos</h1>
        <p className="text-muted-foreground">
          Gere links de acesso para editores e visualizadores
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerar Novos Links</CardTitle>
            <CardDescription>
              Crie links mágicos permanentes (editor e visualizador) para acesso direto ao sistema.
              Gerar novos links para o mesmo usuário invalidará os anteriores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="mb-2">Usuário</Label>
                <Select value={username} onValueChange={setUsername}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
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
                {generateLinkMutation.isPending ? "Gerando..." : "Gerar Links Mágicos"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedLinks && (
          <Card>
            <CardHeader>
              <CardTitle>Links Gerados</CardTitle>
              <CardDescription>
                Compartilhe estes links com o usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Link Editor (Pode modificar)</Label>
                  <div className="p-3 bg-muted rounded-md break-all text-sm mb-2">
                    {generatedLinks.editorLink}
                  </div>
                  <Button onClick={() => copyToClipboard(generatedLinks.editorLink)} className="w-full" size="sm">
                    <Copy className="size-4 mr-2" />
                    Copiar Link Editor
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">Link Visualizador (Apenas leitura)</Label>
                  <div className="p-3 bg-muted rounded-md break-all text-sm mb-2">
                    {generatedLinks.viewerLink}
                  </div>
                  <Button onClick={() => copyToClipboard(generatedLinks.viewerLink)} className="w-full" size="sm" variant="outline">
                    <Copy className="size-4 mr-2" />
                    Copiar Link Visualizador
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
          <CardTitle>Usuários com Links Ativos</CardTitle>
          <CardDescription>
            Links mágicos já gerados e ativos no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Link Editor</TableHead>
                <TableHead>Link Visualizador</TableHead>
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
                        Copiar Editor
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sem link gerado
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
                        Copiar Visualizador
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sem link gerado
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!Array.isArray(existingUsers) || existingUsers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum usuário com link ativo
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
