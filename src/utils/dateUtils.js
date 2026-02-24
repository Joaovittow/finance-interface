// src/utils/dateUtils.js
export const calcularMesAtivo = () => {
  const hoje = new Date();
  const dia = hoje.getDate();
  const mesAtual = hoje.getMonth() + 1; // 1-12
  const anoAtual = hoje.getFullYear();

  // Regra: dia 1-10 = mês anterior, dia 11-31 = mês atual
  if (dia <= 10) {
    // Mês anterior
    if (mesAtual === 1) {
      // Se é janeiro, volta para dezembro do ano anterior
      return { mes: 12, ano: anoAtual - 1 };
    } else {
      return { mes: mesAtual - 1, ano: anoAtual };
    }
  } else {
    // Mês atual
    return { mes: mesAtual, ano: anoAtual };
  }
};

export const formatarMesAno = (mes, ano) => {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  return `${meses[mes - 1]} de ${ano}`;
};

export const mesEhAtivo = (mes, ano) => {
  const mesAtivo = calcularMesAtivo();
  return mes === mesAtivo.mes && ano === mesAtivo.ano;
};

// Função auxiliar para obter o período ativo em texto
export const obterPeriodoAtivo = () => {
  const mesAtivo = calcularMesAtivo();
  const mesTexto = formatarMesAno(mesAtivo.mes, mesAtivo.ano);

  // Calcular o próximo mês para mostrar o período completo
  let proximoMes = mesAtivo.mes + 1;
  let proximoAno = mesAtivo.ano;
  if (proximoMes > 12) {
    proximoMes = 1;
    proximoAno += 1;
  }
  const proximoMesTexto = formatarMesAno(proximoMes, proximoAno);

  return `Período ativo: 11/${mesAtivo.mes.toString().padStart(2, '0')} a 10/${proximoMes.toString().padStart(2, '0')} (${mesTexto})`;
};

const isYMD = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

const pad2 = (n) => String(n).padStart(2, '0');

export const toLocalYMD = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const receitaContaNoMes = (receita, hoje = new Date()) => {
  const dataDeposito = receita?.dataDeposito;
  if (!dataDeposito) return true; // compat: receitas antigas sem data contam no mês

  const hojeYMD = toLocalYMD(hoje);
  if (!hojeYMD) return true;

  if (isYMD(dataDeposito)) {
    return dataDeposito <= hojeYMD;
  }

  const parsed = new Date(dataDeposito);
  if (Number.isNaN(parsed.getTime())) return true;
  return toLocalYMD(parsed) <= hojeYMD;
};

export const filtrarReceitasDisponiveis = (receitas, hoje = new Date()) =>
  (receitas || []).filter((r) => receitaContaNoMes(r, hoje));

export const somarReceitasDisponiveis = (receitas, hoje = new Date()) =>
  filtrarReceitasDisponiveis(receitas, hoje).reduce(
    (total, receita) => total + (receita?.valor || 0),
    0,
  );
