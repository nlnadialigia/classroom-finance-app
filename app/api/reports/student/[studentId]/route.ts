import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/services/prisma.service";
import { months } from "@/utils/date";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Buscar dados do aluno
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        monthlyReceipts: {
          where: { year }
        },
        user: {
          include: {
            config: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const config = student.user.config;
    const receipts = student.monthlyReceipts.filter(r => r.paid);
    const totalPaid = receipts.reduce((sum, r) => sum + r.value, 0);

    // Gerar HTML simples para PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório - ${student.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #666; }
            .student-info { background: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 5px; }
            .student-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .total-row { background-color: #e8f5e8; font-weight: bold; }
            .na { color: #999; }
            
            @media print {
              body { margin: 20px; }
              .header { margin-bottom: 20px; }
              .student-info { margin-bottom: 20px; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Relatório de Pagamentos</div>
            <div class="subtitle">Ano Letivo ${year}</div>
          </div>
          
          <div class="student-info">
            <div class="student-name">${student.name}</div>
            <div>Valor Mensal: R$ ${config?.monthlyValue?.toFixed(2) || '0,00'}</div>
            <div>Períodos de Contribuição: ${student.monthlyPeriods?.length || 12} meses</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Data Pagamento</th>
              </tr>
            </thead>
            <tbody>
              ${months.map((month, index) => {
                const monthNumber = index + 1;
                const isInPeriod = student.monthlyPeriods?.includes(monthNumber) ?? true;
                const receipt = student.monthlyReceipts.find(r => r.month === monthNumber);
                
                return `
                  <tr>
                    <td>${month}</td>
                    <td>${!isInPeriod ? '<span class="na">N/A</span>' : receipt?.paid ? 'Pago' : 'Pendente'}</td>
                    <td>${!isInPeriod ? '<span class="na">N/A</span>' : receipt ? `R$ ${receipt.value.toFixed(2)}` : '-'}</td>
                    <td>${receipt?.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '-'}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="total-row">
                <td colspan="2">TOTAL PAGO</td>
                <td>R$ ${totalPaid.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="relatorio-${student.name.replace(/\s+/g, '-').toLowerCase()}-${year}.html"`
      }
    });

  } catch (error) {
    console.error("Error generating student report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
