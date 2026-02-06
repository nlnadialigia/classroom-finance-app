# Plano - Sistema de Links Mágicos

## Alterações Necessárias

### 1. Modificar Schema Prisma
- Adicionar campo `magicToken` no User
- Manter login tradicional apenas para ADMIN

### 2. Criar API para Links Mágicos
- `/api/magic-links` - Gerar links para EDITOR e VIEWER
- `/api/auth/magic` - Autenticar via token mágico

### 3. Modificar Sistema de Autenticação
- Manter login tradicional para ADMIN
- Adicionar autenticação via token mágico
- Verificar permissões baseadas no role

### 4. Criar Página de Geração de Links
- Apenas para ADMIN
- Gerar links para EDITOR e VIEWER

### 5. Modificar Componentes
- Desabilitar botões/formulários para VIEWER
- Manter funcionalidade completa para EDITOR
- Funcionalidade administrativa para ADMIN

### 6. Middleware de Permissões
- Verificar role em cada ação
- Bloquear modificações para VIEWER
