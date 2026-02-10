"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, Users, DollarSign, FileText, BarChart3, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrientacaoClient() {
  const t = useTranslations();
  const steps = [
    {
      id: 1,
      title: t('guidance.steps.initialSettings.title'),
      icon: <Settings className="size-5" />,
      description: t('guidance.steps.initialSettings.description'),
      items: [
        t('guidance.steps.initialSettings.items.0'),
        t('guidance.steps.initialSettings.items.1'),
        t('guidance.steps.initialSettings.items.2'),
        t('guidance.steps.initialSettings.items.3'),
        t('guidance.steps.initialSettings.items.4')
      ]
    },
    {
      id: 2,
      title: t('guidance.steps.studentRegistration.title'),
      icon: <Users className="size-5" />,
      description: t('guidance.steps.studentRegistration.description'),
      items: [
        t('guidance.steps.studentRegistration.items.0'),
        t('guidance.steps.studentRegistration.items.1'),
        t('guidance.steps.studentRegistration.items.2'),
        t('guidance.steps.studentRegistration.items.3'),
        t('guidance.steps.studentRegistration.items.4'),
        t('guidance.steps.studentRegistration.items.5')
      ]
    },
    {
      id: 3,
      title: t('guidance.steps.monthlyControl.title'),
      icon: <DollarSign className="size-5" />,
      description: t('guidance.steps.monthlyControl.description'),
      items: [
        t('guidance.steps.monthlyControl.items.0'),
        t('guidance.steps.monthlyControl.items.1'),
        t('guidance.steps.monthlyControl.items.2'),
        t('guidance.steps.monthlyControl.items.3'),
        t('guidance.steps.monthlyControl.items.4'),
        t('guidance.steps.monthlyControl.items.5'),
        t('guidance.steps.monthlyControl.items.6')
      ]
    },
    {
      id: 4,
      title: t('guidance.steps.extraReceipts.title'),
      icon: <DollarSign className="size-5" />,
      description: t('guidance.steps.extraReceipts.description'),
      items: [
        t('guidance.steps.extraReceipts.items.0'),
        t('guidance.steps.extraReceipts.items.1'),
        t('guidance.steps.extraReceipts.items.2'),
        t('guidance.steps.extraReceipts.items.3'),
        t('guidance.steps.extraReceipts.items.4'),
        t('guidance.steps.extraReceipts.items.5')
      ]
    },
    {
      id: 5,
      title: t('guidance.steps.expenseControl.title'),
      icon: <FileText className="size-5" />,
      description: t('guidance.steps.expenseControl.description'),
      items: [
        t('guidance.steps.expenseControl.items.0'),
        t('guidance.steps.expenseControl.items.1'),
        t('guidance.steps.expenseControl.items.2'),
        t('guidance.steps.expenseControl.items.3'),
        t('guidance.steps.expenseControl.items.4'),
        t('guidance.steps.expenseControl.items.5')
      ]
    },
    {
      id: 6,
      title: t('guidance.steps.dashboardReports.title'),
      icon: <BarChart3 className="size-5" />,
      description: t('guidance.steps.dashboardReports.description'),
      items: [
        t('guidance.steps.dashboardReports.items.0'),
        t('guidance.steps.dashboardReports.items.1'),
        t('guidance.steps.dashboardReports.items.2'),
        t('guidance.steps.dashboardReports.items.3'),
        t('guidance.steps.dashboardReports.items.4')
      ]
    }
  ];

  const tips = [
    {
      title: t('guidance.tips.valueFormatting.title'),
      description: t('guidance.tips.valueFormatting.description')
    },
    {
      title: t('guidance.tips.datesTimezone.title'),
      description: t('guidance.tips.datesTimezone.description')
    },
    {
      title: t('guidance.tips.dataBackup.title'),
      description: t('guidance.tips.dataBackup.description')
    },
    {
      title: t('guidance.tips.quickEdit.title'),
      description: t('guidance.tips.quickEdit.description')
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('guidance.title')}</h1>
        <p className="text-muted-foreground">
          {t('guidance.subtitle')}
        </p>
      </div>

      {/* Passo a Passo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('guidance.stepByStep')}</h2>
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
        <h2 className="text-2xl font-semibold">{t('guidance.importantTips')}</h2>
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
            {t('guidance.recommendedFlow.title')}
          </CardTitle>
          <CardDescription>
            {t('guidance.recommendedFlow.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{t('guidance.recommendedFlow.steps.0')}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">{t('guidance.recommendedFlow.steps.1')}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">{t('guidance.recommendedFlow.steps.2')}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">{t('guidance.recommendedFlow.steps.3')}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">{t('guidance.recommendedFlow.steps.4')}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('guidance.recommendedFlow.note')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
