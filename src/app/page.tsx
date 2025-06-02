"use client";

import { useState, useCallback, useMemo, Suspense, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from "@/components/ui/toaster"
import InfoTooltip from "@/components/InfoTooltip";
import { Progress } from "@/components/ui/progress"
import { PrintButton } from '@/components/PrintButton'
// import { utcToZonedTime, format } from 'date-fns-tz';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
  } from "@/components/ui/table"
  import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  
  import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
  } from "recharts";

//ICONES
import { FaBullhorn, FaPaperPlane, FaUsers, FaMoneyBillWave, FaShoppingCart, FaChartLine, FaPercent, FaChartBar } from 'react-icons/fa'; // Ícone de gráfico do Font Awesome
import { MdCalendarToday, MdChatBubbleOutline } from 'react-icons/md'; // Ícone de calendário do Material Design Icons
import { BsTable } from "react-icons/bs";
import { IoFunnelOutline, IoFunnelSharp } from "react-icons/io5";



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


type CampaignData = {
  [key: string]: string;
};

// Custo por mensagem - Valor atual é de R$ 0,10 por mensagem por estar sendo utilizada a mensagem de Utilidade pelo Blip
const costPerMessage = 0.10;

// Valor medio da venda dos produto
const averageSaleValue = 149.9;

export default function Home() {
  
  
  const [csvData, setCsvData] = useState<CampaignData[]>([]);
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const csvText = reader.result as string;
      const parsedData = parseCSV(csvText);
      setCsvData(parsedData);
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const parseCSV = (csvText: string): CampaignData[] => {
    const lines = csvText.split("\n");
    const headers = lines[0].split(";").map((header) => header.trim());
    const data: CampaignData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(";").map((value) => value.trim());
      if (values.length === headers.length) {
        const row: CampaignData = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j];
        }
        data.push(row);
      }
    }

    return data;
  };

  const campaignNames = useMemo(() => {
    return [...new Set(csvData.map((row) => row["Campanha"]).filter(Boolean))];
  }, [csvData]);

  const campaignDateValue = useMemo(() => {
    const datesEnvio = csvData.map((row) => row["Dt.Envio"]).filter(Boolean);
    const datesInclusao = csvData.map((row) => row["Dt.Inclusão"]).filter(Boolean);
    const rawDate = datesEnvio.length > 0 ? datesEnvio[0] : datesInclusao.length > 0 ? datesInclusao[0] : null;
    const timeZone = 'America/Sao_Paulo'; // Ajuste para o fuso horário desejado
    return rawDate ? format(new Date(rawDate), 'dd/MM/yyyy', { locale: ptBR }) : "N/A";
  }, [csvData]);

//Calcula o total de clientes únicos filtrando apenas 1 linha por campanha que existe e somando os valores usando a coluna Qtd.Cli.Campanha
  // const totalClientes = () => {
  //   const uniqueCampaigns = useMemo(() => [...new Set(csvData.map((row) => row["Campanha"]).filter(Boolean))], [csvData]);
  //   let total = 0;
  //   uniqueCampaigns.forEach(campaignName => {
  //     const campaignData = csvData.filter(row => row["Campanha"] === campaignName);
  //     if (campaignData && campaignData.length > 0) {
  //       // const qtdCliCampanha = parseInt(campaignData.reduce((sum, row) => sum + Number(row["Qtd.Cli.Campanha"] || 0), 0), 10);
  //       const qtdCliCampanha = parseInt(campaignData.reduce((sum, row) => sum + Number(row["Qtd.Cli.Campanha"] || "0"), 0).toString(), 10);
  //       if (!isNaN(qtdCliCampanha)) { //
  //         total += qtdCliCampanha;
  //       }
  //     }
  //   });
  //   return total;
  // };
//Calcula o total de clientes únicos usando a coluna CPFs/CNPJs
  const totalClientesValue = useMemo(() => {
    let total = 0;
    // Cria um conjunto (Set) de CPFs/CNPJs únicos
    const uniqueCPFs = new Set(csvData.map(row => row["Cód.TMK"]).filter(Boolean));
    // Retorna o tamanho do conjunto (número de CPFs únicos)
    total = uniqueCPFs.size;
    return total;
  }, [csvData]);

  const totalDisparos = useMemo(() => csvData.length, [csvData]);

  const totalRespostas = useMemo(() => {
    return csvData.filter((row) => row["Nome WhatsApp"]).length;
  }, [csvData]);

  const { data: chartData, totalVendasCalc } = useMemo(() => {
    const uniqueClientsMap = new Map();
    const statusCountsMap = new Map();
    let totalVendasCalc = 0;
    const filteredData = csvData.filter(row => row["Nome WhatsApp"]);

    filteredData.forEach((row) => {
      const client = row["Cód.TMK"];
      const status = row["Status"];

      if (!client) return;

      if (!uniqueClientsMap.has(client)) {
        uniqueClientsMap.set(client, true);
        statusCountsMap.set(status, (statusCountsMap.get(status) || 0) + 1);
      }

      if (status === "Venda IA" || status === "Venda pela IA" || status === "Venda manual") {
        totalVendasCalc += 1;
      }
    });

    const data: { name: string; valor: number }[] = [];
    statusCountsMap.forEach((valor: number, key: string) => {
      data.push({ name: key, valor: valor });
    });

    return { data, totalVendasCalc };
  }, [csvData]);

  const totalVendas = useMemo(() => totalVendasCalc, [totalVendasCalc]);

  const mediaValorVendido = useMemo(() => totalVendas * averageSaleValue, [totalVendas, averageSaleValue]);

  const percentualRespostas = useMemo(() => (totalRespostas / totalClientesValue) * 100 || 0, [totalRespostas, totalClientesValue]);

  const taxaConversaoClientes = useMemo(() => (totalVendas / totalClientesValue) * 100 || 0, [totalVendas, totalClientesValue]);
  const taxaConversaoRespostas = useMemo(() => (totalVendas / totalRespostas) * 100 || 0, [totalVendas, totalRespostas]);
  const custoTotal = useMemo(() => totalDisparos * costPerMessage, [totalDisparos, costPerMessage]);

  const iconSize = "h-4 w-4"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="container mx-auto px-4">
        {/* Área de upload - não será impressa */}
        <div className="no-print">
          <div {...getRootProps()} className="rounded-md border-2 border-dashed border-primary/30 p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Arraste o arquivo aqui...</p>
            ) : (
              <p>Arraste e solte o arquivo CSV aqui, ou clique para selecionar o arquivo</p>
            )}
          </div>
        </div>

        {csvData.length > 0 && (
          <>
            {/* Botão de exportação - não será impresso */}
            <div className="no-print mt-4 flex justify-end">
              <PrintButton contentRef={printRef} />
            </div>

            {/* Conteúdo que será impresso */}
            <div ref={printRef}>
              {/* Header do relatório para impressão */}
              <div className="mb-6 text-center print-only">
                <h1 className="text-2xl font-bold mb-2">Relatório de Dashboard - Mundo dos Filtros</h1>
                <p className="text-gray-600">Data de geração: {new Date().toLocaleDateString('pt-BR')}</p>
                {/* <p className="text-gray-600">Campanha: {campaignNames.join(', ')}</p> */}
              </div>

              {/* Grid de cards */}
              <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                
                <Card className={"lg:col-span-4"}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaBullhorn className={`${iconSize} text-primary`} />
                      <span>Campanhas</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe a lista dos nomes das campanhas únicas encontradas." 
                    />
                  </CardHeader>
                  <CardContent>
                    {campaignNames.map((name, index) => (
                      <div key={index}>{name}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MdCalendarToday className={`${iconSize} text-primary`} />
                      <span>Data de Disparo</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o dia do disparo da mensagem." 
                    />
                  </CardHeader>
                  <CardContent>{campaignDateValue}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaUsers className={`${iconSize} text-primary`} />
                      <span>Total Clientes</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o número total de clientes únicos encontrados." 
                    />
                  </CardHeader>
                  <CardContent>{totalClientesValue}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaPaperPlane className={`${iconSize} text-primary`} />
                      <span>Total Disparos</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o número total de mensagens que foram enviadas. Considerando que um cliente pode te varios números cadastrados." 
                    />
                  </CardHeader>
                  <CardContent>{totalDisparos}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MdChatBubbleOutline className={`${iconSize} text-primary`} />
                      <span>Total Respostas</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o número total de clientes que responderam a mensagem." 
                    />
                  </CardHeader>
                  <CardContent>{totalRespostas}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className={`${iconSize} text-primary`} />
                      <span>Custo Total</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe um média do valor gasto com o envio das mensagens nas campanhas desse arquivo CSV carregado. Calculo: Total de disparos x 0,1 (Custo por mensagem no Blip)" 
                    />
                  </CardHeader>
                  <CardContent>{custoTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaShoppingCart className={`${iconSize} text-primary`} />
                      <span>Total de Vendas</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o valor total de vendas encontradas. Esse valor é uma soma das Venda IA + Vendas Manual" 
                    />
                  </CardHeader>
                  <CardContent>
                    {!isNaN(totalVendas) ? totalVendas : 'N/A'}
                  </CardContent>
                </Card>

                <Card className={"lg:col-span-2 bg-primary border-primary/50 text-white"}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaChartLine className={`${iconSize} text-white`} />
                      <span>Média de valor vendido</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe uma estimativa de valor baseado no número de vendas. Para esse calculo cada venda é multiplicada por R$ 149,90. Calculo: Total de Vendas x 149,90." 
                      className="text-white"
                    />
                  </CardHeader>
                  <CardContent>{mediaValorVendido.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  </CardContent>
                </Card>

                <Card className={"lg:col-span-2"}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaPercent className="h-3 w-3 text-primary" />
                      <span>Percentual de Respostas (Respostas/Clientes)</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o percentual de respostas. Esse percentual é calculado dividindo o total de respostas pelo total de clientes únicos. Calculo: (Total de respostas / Total de clientes)*100." 
                    />
                  </CardHeader>
                  <CardContent>
                    {percentualRespostas.toFixed(2)}%
                  </CardContent>
                </Card>

                <Card className={"lg:col-span-2"}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IoFunnelOutline className={`${iconSize} text-primary`} />
                      <span>Taxa de Conversão (Vendas/Clientes)</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o percentual da taxa de conversão da campanha. Esse percentual é calculado dividindo o total de vendas pelo total de clientes únicos. Calculo: (Total de vendas / Total de clientes)*100."
                    />
                  </CardHeader>
                  <CardContent>
                    {taxaConversaoClientes.toFixed(2)}%
                    <Progress value={taxaConversaoClientes}  />
                  </CardContent>
                </Card>

                <Card className={"lg:col-span-2"}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IoFunnelSharp className={`${iconSize} text-primary`} />
                      <span>Taxa de Conversão (Vendas/Respostas)</span>
                    </div>
                    <InfoTooltip 
                      description="Esta seção exibe o percentual da taxa de conversão com base no número de respostas. Esse percentual é calculado dividindo o total de vendas pelo total de respostas. Calculo: (Total de vendas / Total de respostas)*100."
                    />
                  </CardHeader>
                  <CardContent>
                    {taxaConversaoRespostas.toFixed(2)}%
                    <Progress value={taxaConversaoRespostas}  />
                  </CardContent>
                </Card>

                {/* Gráfico */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaChartBar className={`${iconSize} text-primary`} />
                      <span>Gráfico 1 de Status</span>
                    </div>
                    <InfoTooltip 
                      description="Esse grafico exibe o número de cada status da campanha." 
                    />
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <BarChart 
                        accessibilityLayer 
                        width={600} 
                        height={300} 
                        data={chartData}
                        margin={{left: 0,}}
                      >
                        <XAxis 
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(valor) => valor.slice(0, 7)}
                          fontSize={12}
                        />
                        <YAxis />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent 
                            className="font-mono font-medium justify-start"
                          />}
                        />
                        <Bar 
                          dataKey="valor"
                          fill="var(--color-desktop)"
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            offset={5}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Tabela */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BsTable className={`${iconSize} text-primary`} />
                      <span>Tabela de Status</span>
                    </div>
                    <InfoTooltip 
                      description="Essa tabela exibe o número de cada status da campanha." 
                    />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead className="pl-8">Núm Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chartData.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="pl-8">{item.valor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );

}