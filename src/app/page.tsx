"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from "@/components/ui/toaster"
import InfoTooltip from "@/components/InfoTooltip";
import { Progress } from "@/components/ui/progress"
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

const costPerMessage = 0.10;
const averageSaleValue = 149.9;

export default function Home() {
  const [csvData, setCsvData] = useState<CampaignData[]>([]);

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

  const campaignNames = [...new Set(csvData.map((row) => row["Campanha"]).filter(Boolean))];

  const campaignDate = () => {
    const datesEnvio = csvData.map((row) => row["Dt.Envio"]).filter(Boolean);
    const datesInclusao = csvData.map((row) => row["Dt.Inclusão"]).filter(Boolean);

    const rawDate = datesEnvio.length > 0 ? datesEnvio[0] : datesInclusao.length > 0 ? datesInclusao[0] : null;

    const timeZone = 'America/Sao_Paulo'; // Ajuste para o fuso horário desejado

    // return rawDate
    //   ? format(utcToZonedTime(new Date(rawDate), timeZone), 'dd/MM/yyyy', { locale: ptBR })
    //   : "N/A";
    return rawDate ? format(new Date(rawDate), 'dd/MM/yyyy', { locale: ptBR }) : "N/A";
  };

//Calcula o total de clientes únicos filtrando apenas 1 linha por campanha que existe e somando os valores usando a coluna Qtd.Cli.Campanha
  // const totalClientes = () => {
  //   const uniqueCampaigns = [...new Set(csvData.map((row) => row["Campanha"]).filter(Boolean))];
  //   let total = 0;
  //   uniqueCampaigns.forEach(campaignName => {
  //     const campaignData = csvData.filter(row => row["Campanha"] === campaignName);
  //     if (campaignData && campaignData.length > 0) {
  //       // const qtdCliCampanha = parseInt(campaignData.reduce((sum, row) => sum + Number(row["Qtd.Cli.Campanha"] || 0), 0), 10);
  //       const qtdCliCampanha = parseInt(campaignData.reduce((sum, row) => sum + Number(row["Qtd.Cli.Campanha"] || "0"), 0).toString(), 10);
  //       if (!isNaN(qtdCliCampanha)) {
  //         total += qtdCliCampanha;
  //       }
  //     }
  //   });
  //   return total;
  // };


//Calcula o total de clientes únicos usando a coluna CPFs/CNPJs
  const totalClientes = () => {
    let total = 0;
    // Cria um conjunto (Set) de CPFs/CNPJs únicos
    const uniqueCPFs = new Set(csvData.map(row => row["CNPJ/CPF"]).filter(Boolean));
    // Retorna o tamanho do conjunto (número de CPFs únicos)
    total = uniqueCPFs.size;
    return total;
  };
  
  


  const totalClientesValue = totalClientes();
  const totalDisparos = csvData.length;
  const totalRespostas = csvData.filter((row) => row["Nome WhatsApp"]).length;

  const statusCounts = () => {
    const uniqueClientsMap = new Map();
    const statusCountsMap = new Map();
    let totalVendasCalc = 0;

    const filteredData = csvData.filter(row => row["Nome WhatsApp"]);

    filteredData.forEach((row) => {
      const client = row["CNPJ/CPF"];
      const status = row["Status"];

      if (!client) return;

      if (!uniqueClientsMap.has(client)) {
        uniqueClientsMap.set(client, true);
        statusCountsMap.set(status, (statusCountsMap.get(status) || 0) + 1);
      }

      if (status === "Venda IA" || status === "Venda manual") {
        totalVendasCalc += 1;
      }
    });

    const data: { name: string; valor: number }[] = [];
    statusCountsMap.forEach((valor: number, key: string) => {
      data.push({ name: key, valor: valor });
    });

    return { data, totalVendasCalc };
  };

  const { data: chartData, totalVendasCalc } = statusCounts();

  const totalVendas = totalVendasCalc;
  const mediaValorVendido = totalVendas * averageSaleValue;
  const percentualRespostas = (totalRespostas / totalClientesValue) * 100 || 0;
  const taxaConversaoClientes = (totalVendas / totalClientesValue) * 100 || 0;
  const taxaConversaoRespostas = (totalVendas / totalRespostas) * 100 || 0;
  const custoTotal = totalDisparos * costPerMessage;
  const iconSize = "h-4 w-4"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="container mx-auto px-4">
        <div {...getRootProps()} className="rounded-md border-2 border-dashed border-primary/30 p-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Arraste o arquivo aqui...</p>
          ) : (
            <p>Arraste e solte o arquivo CSV aqui, ou clique para selecionar o arquivo</p>
          )}
        </div>

        {csvData.length > 0 && (
          <div className="mt-10 mb-10 grid grid-cols- md:grid-cols-2 lg:grid-cols-6 gap-4">



            <Card className={"lg:col-span-4"}>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaBullhorn className={`${iconSize} text-primary`} />
                <span>Campanhas</span>
              </div>
              <InfoTooltip 
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
              />
            </CardHeader>
              <CardContent>{campaignDate()}</CardContent>
            </Card>



            <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaUsers className={`${iconSize} text-primary`} />
                <span>Total Clientes</span>
              </div>
              <InfoTooltip 
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
              />
              </CardHeader>
              <CardContent>
                {percentualRespostas.toFixed(2)}%
                {/*<Progress value={percentualRespostas}  /> */}
              </CardContent>
            </Card>



            <Card className={"lg:col-span-2"}>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IoFunnelOutline className={`${iconSize} text-primary`} />
                  <span>Taxa de Conversão (Vendas/Clientes)</span>
                </div>
                <InfoTooltip 
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
              />
              </CardHeader>
              <CardContent>
                {taxaConversaoRespostas.toFixed(2)}%
                <Progress value={taxaConversaoRespostas}  />
              </CardContent>
            </Card>
            


            {/* ############################### Inicio do Grafico 1 ############################### */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaChartBar className={`${iconSize} text-primary`} />
                  <span>Gráfico 1 de Status</span>
                </div>
                <InfoTooltip 
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
                  // className="text-background bg-background"
                >
                    {/* <CartesianGrid vertical={true} /> */}
                    {/* <CartesianGrid horizontal={true} /> */}
                    <XAxis 
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(valor) => valor.slice(0, 7)}
                      fontSize={12}
                    />
                    <YAxis />
                    {/* <Tooltip /> */}
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent 
                        // hideLabel 
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
            {/* ############################### Fim do Grafico ############################### */}

            {/* ############################### Inicio do Grafico 2 ############################### */}
            {/* <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                          <CardHeader>Gráfico de Status</CardHeader>
                          <CardContent>
                            <BarChart width={600} height={300} data={chartData}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </CardContent>
                        </Card> */}
            {/* ############################### Fim do Grafico ############################### */}

            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BsTable className={`${iconSize} text-primary`} />
                  <span>Tabela de Status</span>
                </div>
                <InfoTooltip 
                description="Esta seção exibe a lista de campanhas únicas encontradas no arquivo CSV carregado." 
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
        )}
      </div>
      <Toaster />
    </div>
  );
}