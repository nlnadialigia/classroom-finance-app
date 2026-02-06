import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { months } from '@/utils/date';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  studentInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bfbfbf',
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#bfbfbf',
  },
  tableCellHeader: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 9,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 12,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

interface StudentReportProps {
  student: any;
  config: any;
  year: number;
}

export const StudentReport = ({ student, config, year }: StudentReportProps) => {
  const monthlyReceipts = student.monthlyReceipts?.filter((r: any) => r.year === year) || [];
  const paidReceipts = monthlyReceipts.filter((r: any) => r.paid);
  const totalPaid = paidReceipts.reduce((sum: number, r: any) => sum + r.value, 0);
  const expectedTotal = (config?.monthlyValue || 0) * (student.monthlyPeriods?.length || 12);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Pagamentos</Text>
          <Text style={styles.subtitle}>Ano Letivo {year}</Text>
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text>Valor Mensal: R$ {config?.monthlyValue?.toFixed(2) || '0,00'}</Text>
          <Text>Períodos de Contribuição: {student.monthlyPeriods?.length || 12} meses</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Mês</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Valor</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Data Pagamento</Text>
            </View>
          </View>

          {months.map((month, index) => {
            const monthNumber = index + 1;
            const isInPeriod = student.monthlyPeriods?.includes(monthNumber) ?? true;
            const receipt = monthlyReceipts.find((r: any) => r.month === monthNumber);

            return (
              <View style={styles.tableRow} key={month}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{month}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {!isInPeriod ? 'N/A' : receipt?.paid ? 'Pago' : 'Pendente'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {!isInPeriod ? 'N/A' : receipt ? `R$ ${receipt.value.toFixed(2)}` : '-'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {receipt?.paymentDate 
                      ? new Date(receipt.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                      : '-'
                    }
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryItem}>
            <Text>Total Esperado:</Text>
            <Text>R$ {expectedTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Total Pago:</Text>
            <Text>R$ {totalPaid.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Meses Pagos:</Text>
            <Text>{paidReceipts.length} de {student.monthlyPeriods?.length || 12}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text>Pendente:</Text>
            <Text>R$ {(expectedTotal - totalPaid).toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
