"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "@/lib/ag-grid-config";
import { Link } from "@/i18n/routing";
import { roleMap, User, UserList } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AdminClientProps {
  initialUsers: UserList[];
}

const initialNewUser = {
  username: "",
  role: "EDITOR",
  publicSlug: "",
};

export function AdminClient({ initialUsers }: AdminClientProps) {
  const t = useTranslations();
  const [newUser, setNewUser] = useState(initialNewUser);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<{ editorLink: string; viewerLink: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: users = initialUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return response.json();
    },
    initialData: initialUsers,
  });

  const { data: usersWithLinks = [], isError: linksError } = useQuery({
    queryKey: ["magic-links"],
    queryFn: async () => {
      const response = await fetch("/api/magic-links");
      if (!response.ok) {
        throw new Error('Failed to fetch magic links');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(t('admin.messages.userCreated'));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["magic-links"] });
      setNewUser(initialNewUser);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(t('admin.messages.userCreateError'));
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: {
      id: string;
      username: string;
      role: string;
    }) => {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success(t('admin.messages.userUpdated'));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditDialogOpen(false);
      setEditUser(null);
    },
    onError: (error) => {
      toast.error(t('admin.messages.userUpdateError'));
    },
  });

  const generateLinksMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await fetch("/api/magic-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLinks({ editorLink: data.editorLink, viewerLink: data.viewerLink });
      toast.success(t('admin.messages.linksGenerated'));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["magic-links"] });
    },
    onError: () => {
      toast.error(t('admin.messages.linksGenerateError'));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success(t('admin.messages.userDeleted'));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(t('admin.messages.userDeleteError'));
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUser);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      updateUserMutation.mutate(editUser);
    }
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success(t('admin.messages.linkCopied'));
  };

  const handleGenerateLinks = (username: string) => {
    generateLinksMutation.mutate(username);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const generateRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "EDITOR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const roleRenderer = (params: any) => (
    <span
      className={`px-2 py-1 rounded text-xs ${generateRoleColor(params.value)}`}
    >
      {roleMap[params.value as keyof typeof roleMap]}
    </span>
  );

  const linksRenderer = (params: any) => {
    const userWithLinks = usersWithLinks.find((u: any) => u.username === params.data.username);
    return (
      <div className="flex gap-1">
        {userWithLinks?.editorLink ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(userWithLinks.editorLink)}
          >
            {t('admin.roles.editor')}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </div>
    );
  };

  const viewerLinksRenderer = (params: any) => {
    const userWithLinks = usersWithLinks.find((u: any) => u.username === params.data.username);
    return (
      <div className="flex gap-1">
        {userWithLinks?.viewerLink ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(userWithLinks.viewerLink)}
          >
            {t('admin.roles.viewer')}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </div>
    );
  };

  const actionsRenderer = (params: any) => (
    <div className="flex gap-2 p-1">
      <Button
        className="bg-white text-green-600 border-green-600 hover:bg-green-100 hover:text-green-600"
        variant="outline"
        size="sm"
        onClick={() => handleEditUser(params.data)}
      >
        {t('common.buttons.edit')}
      </Button>
      {params.data.role !== "ADMIN" && (
        <>
          <Button
            className="bg-white text-blue-600 border-blue-600 hover:bg-blue-100 hover:text-blue-600"
            variant="outline"
            size="sm"
            onClick={() => handleGenerateLinks(params.data.username)}
            disabled={generateLinksMutation.isPending}
          >
            {t('admin.generateLinks')}
          </Button>
          <Button
            className="bg-white text-red-600 border-red-600 hover:bg-red-100 hover:text-red-600"
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(params.data.id)}
            disabled={deleteUserMutation.isPending}
          >
            {t('common.buttons.delete')}
          </Button>
        </>
      )}
    </div>
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      { field: "username", headerName: t('admin.table.username'), flex: 1 },
      {
        field: "role",
        headerName: t('admin.table.role'),
        flex: 1,
        cellRenderer: roleRenderer,
      },
      { headerName: t('admin.table.editorLink'), flex: 1, cellRenderer: linksRenderer },
      { headerName: t('admin.table.viewerLink'), flex: 1, cellRenderer: viewerLinksRenderer },
      { headerName: t('admin.table.actions'), flex: 1, cellRenderer: actionsRenderer },
    ],
    [t, deleteUserMutation.isPending, generateLinksMutation.isPending, usersWithLinks],
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('admin.title')}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('admin.addUser')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.createUser.title')}</DialogTitle>
                <DialogDescription>
                  {t('admin.createUser.description')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.createUser.nameLabel')}</Label>
                  <Input
                    id="name"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.createUser.magicLinksNote')}
                </p>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending
                    ? t('admin.createUser.creating')
                    : t('admin.createUser.create')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={users}
              columnDefs={columnDefs}
              domLayout="autoHeight"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.editUser.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.editUser.description')}
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('admin.editUser.usernameLabel')}</Label>
                <Input
                  id="edit-name"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending
                  ? t('common.buttons.saving')
                  : t('common.buttons.saveChanges')}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Links Gerados */}
      <Dialog open={!!generatedLinks} onOpenChange={() => setGeneratedLinks(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.generatedLinks')}</DialogTitle>
            <DialogDescription>
              {t('admin.copyLinksDescription')}
            </DialogDescription>
          </DialogHeader>
          {generatedLinks && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('admin.editorLink')}</Label>
                <div className="flex gap-2">
                  <Input value={generatedLinks.editorLink} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedLinks.editorLink)}
                  >
                    {t('admin.copyEditor')}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.viewerLink')}</Label>
                <div className="flex gap-2">
                  <Input value={generatedLinks.viewerLink} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedLinks.viewerLink)}
                  >
                    {t('admin.copyViewer')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
