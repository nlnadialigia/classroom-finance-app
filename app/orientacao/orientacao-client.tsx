"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, Users, DollarSign, FileText, BarChart3, AlertCircle } from "lucide-react";

export function OrientacaoClient() {
  const steps = [
    {
      id: 1,
      title: "Configurações Iniciais",
      icon: <Settings className="size-5" />,
      description: "Configure o sistema antes de começar",
      items: [
        "Acesse a aba 'Configurações'",
        "Defina o ano letivo (ex: 2024)",
        "Configure o valor mensal padrão das aulas",
        "Defina o saldo inicial (se houver)",
        "Clique em 'Salvar' para confirmar"
      ]
    },
    {
      id: 2,
      title: "Cadastro de Alunos",
      icon: <Users className="size-5" />,
      description: "Adicione seus alunos ao sistema",
      items: [
        "Na aba 'Configurações', vá para a seção 'Alunos'",
        "Clique em 'Novo Aluno'",
        "Preencha o nome do aluno",
        "Marque se o aluno tem recebimento mensal",
        "Selecione os meses de aula (ex: março a dezembro)",
        "Salve o cadastro"
      ]
    },
    {
      id: 3,
      title: "Controle de Mensalidades",
      icon: <DollarSign className="size-5" />,
      description: "Gerencie os pagamentos mensais",
      items: [
        "Acesse 'Recebimento Mensal'",
        "Visualize a tabela com todos os alunos e meses",
        "Clique em 'Adicionar Recebimento' para registrar pagamentos",
        "Selecione o aluno, mês, valor e data de recebimento",
        "Use 'Adicionar à Lista' para incluir vários pagamentos",
        "Clique em 'Salvar' para confirmar todos os recebimentos",
        "Para relatórios: clique no nome do aluno e depois em 'Salvar Relatório'"
      ]
    },
    {
      id: 4,
      title: "Recebimentos Extras",
      icon: <DollarSign className="size-5" />,
      description: "Registre valores adicionais",
      items: [
        "Acesse 'Recebimento Extra'",
        "Clique em 'Novo Recebimento'",
        "Selecione o aluno",
        "Descreva o recebimento (ex: 'Aula de reforço')",
        "Informe o valor e data",
        "Use os botões de editar/excluir conforme necessário"
      ]
    },
    {
      id: 5,
      title: "Controle de Gastos",
      icon: <FileText className="size-5" />,
      description: "Registre suas despesas",
      items: [
        "Acesse 'Gastos'",
        "Clique em 'Novo Gasto'",
        "Descreva a despesa (ex: 'Material didático')",
        "Informe o valor e data de pagamento",
        "Use 'Adicionar à Lista' para incluir vários gastos",
        "Edite ou exclua gastos quando necessário"
      ]
    },
    {
      id: 6,
      title: "Dashboard e Relatórios",
      icon: <BarChart3 className="size-5" />,
      description: "Acompanhe suas finanças",
      items: [
        "Acesse o 'Dashboard' para visão geral",
        "Visualize os cards de resumo financeiro",
        "Analise a tabela DRE (Demonstração do Resultado)",
        "Adicione rendimentos e recebimentos de anos anteriores",
        "Use os relatórios individuais por aluno"
      ]
    }
  ];

  const tips = [
    {
      title: "Formatação de Valores",
      description: "Todos os valores são formatados automaticamente no padrão brasileiro (1.234,56)"
    },
    {
      title: "Datas e Timezone",
      description: "O sistema processa datas no timezone brasileiro, evitando problemas de mês errado"
    },
    {
      title: "Backup de Dados",
      description: "Todos os dados são salvos automaticamente. Não há risco de perda de informações"
    },
    {
      title: "Edição Rápida",
      description: "Use os botões de editar (✏️) para modificar rapidamente qualquer registro"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orientação de Uso</h1>
        <p className="text-muted-foreground">
          Guia passo a passo para utilizar o sistema de gestão financeira
        </p>
      </div>

      {/* Passo a Passo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Passo a Passo</h2>
        <div className="grid gap-4">
          {steps.map((step) => (
            <Card key={step.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {step.id}
                  </Badge>
                  {step.icon}
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dicas Importantes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dicas Importantes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-blue-600" />
                  <CardTitle className="text-base">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fluxo Recomendado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Fluxo Recomendado de Uso
          </CardTitle>
          <CardDescription>
            Sequência ideal para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">1. Configurações</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">2. Cadastrar Alunos</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">3. Registrar Mensalidades</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">4. Adicionar Gastos</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">5. Acompanhar Dashboard</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Siga esta sequência na primeira utilização. Depois, use as abas conforme sua necessidade diária.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
