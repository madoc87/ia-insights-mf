# **App Name**: Campaign Insights

## Core Features:

- CSV Upload: Upload a CSV file containing campaign data.
- Campaign Info Display: Display campaign names and the date of the campaign from the 'Campanha' and 'Dt.Envio'/'Dt.Inclusão' columns.
- Status Chart: Generate a bar chart showing the count of each unique 'Status' value, after removing duplicate clients based on the 'Nome WhatsApp' column.
- Cost Calculation: Calculate and display the total cost of the campaign by multiplying the total number of rows in the CSV by a fixed cost per message (R$0.10). Format the output as currency.
- Key Metrics Display: Calculate and display key metrics: Total Clientes (total unique values from 'CNPJ/CPF' column), Total Disparos (total values in 'Telefone' column), Total Respostas (total filled values in 'Nome WhatsApp' column), Total de Vendas (sum of 'Venda IA' and 'Venda Manual' columns), Média de valor vendido (Total de Vendas * 149.9, formatted as currency), Percentual de Respostas ((Total Respostas / Total Clientes) * 100, with '%'), Taxa de Conversão (Vendas/Clientes) ((Total de Vendas / Total Clientes) * 100, with '%'), Taxa de Conversão (Vendas/Respostas) ((Total de Vendas / Total Respostas) * 100, with '%').

## Style Guidelines:

- Primary color: White or light grey for the background.
- Secondary color: Black or dark grey for text and key elements.
- Accent color: Blue (#3498db) for interactive elements and highlights.
- Dashboard layout: Mimic the layout from the provided image 'Dashboard Layout.jpeg', adapting the color scheme to the defined palette.
- Use simple and clean icons for each metric and chart.
- Maintain clear and readable typography for all text elements.

## Original User Request:
Preciso de um sistema onde eu faça o upload de um arquivo CSV e ele gere um dashboard em com várias informações sobre esse arquivo que é o resultado de uma campanha que estamos fazendo na empresa.

Vou usar a fonte de dados como um CSV que é basicamente uma tabela com várias colunas e linhas com todos os clientes e as informações deles referente a essa campanha.

Dentre as várias colunas as mais importantes para o primeiro gráfico que vou precisar criar são:
Status;
Nome WhatsApp;
CPF;

A primeira informação que preciso é de um gráfico de barras agrupado pela coluna status.

Onde temos vários tipos de status e nesse gráfico precisamos mostrar os números de cada um deles.

Cada linha é referente a um número de telefone, mas temos mais de um telefone por cliente, alguns clientes tem apenas 1 telefone, outros têm 2, outros têm 3, etc.
Preciso de uma forma de agrupar esses status para exibir no gráfico, mas sem repetir os status do mesmo cliente, visto que no sistema atual onde alimento essas informações quando altero o status de uma linha se o mesmo cliente tiver em outras linhas também (ou seja esse cliente tem vários telefones na campanha) esse status é repetido em todas as linhas desse cliente.

Ou seja, se o cliente Fabrício tem 2 telefones nessa campanha ele irá aparecer em duas linhas, onde na coluna CPF as duas linhas estarão repetindo o mesmo número já que é o mesmo cliente assim como o status será igual também nas duas linhas, só o que mudará é a coluna telefone.

No sistema atual para verificar o número correto dos status do cliente realizo um filtro removendo todas as linhas em branco da coluna Nome WhatsApp, pois essa coluna só é preenchida em apenas uma das linhas de cada cliente, depois disso tenho só os clientes que responderam na campanha e então faço o agrupamento por status e assim tenho os números de quantos clientes respondem a essa campanha e também os valores por status de cada um desses clientes.

Preciso saber como fazer isso no em Python, não necessariamente precisa ser feito dessa mesma forma, mas preciso desse gráfico onde cada uma das barras seja o total de cada status da campanha e que ela não tenha as linhas repetidas dos clientes, para ter o número exato dos status por cliente.

Além desse gráfico preciso de um outro nesse mesmo dashboard onde deverá ser calculado o valor total de custo com base no número total de linhas dessa tabela, multiplicado por um valor fixo. Que será de 0,10 que é o custo de cada mensagem que enviamos, então como cada linha representa um número, então devo multiplicar o número total de linhas (ou seja o número total de telefones que enviamos mensagem) por 0,10 centavos. Com isso tenho o valor do custo dessa campanha.

Exemplo, arquivo CSV tem 608 linha, depois de realizar os filtros e ter o número de linhas, como posso fazer o cálculo que preciso usando esse valor e multiplicar por um valor fixo? Nesse caso preciso calcular o valor do custo da campanha, que deverá ser o número de linhas, ou seja, "608 * 0,10", onde 0,10 é o valor de cada mensagem que foi enviada. Então preciso que no final esse painel mostre o resultado dessa conta, no formato de moeda que será: R$ 60,80.

Segue abaixo uma parte do arquivo CSV com apenas algumas linhas mas com todos os campos 

```
Seq.;Dt.Envio;Dt.Inclusão;Campanha;Tipo de venda;Status;Nome WhatsApp;Qtd.Cli.Campanha;Nome TMK;Cód.TMK;Tempo de Resposta;Qtd.Telefone;Telefone;CNPJ/CPF;Observação;Funil;Dt.Agenda;Dt.Troca;Dt.Funil;Tipo de Contato
5372;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;TATIANA ALVES CARNEIRO;795929;;1;5521979851313;05137189740;;Primeiro disparo;;;;
5373;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;ETIENE MERLO CHAVES;798110;;1;5561981480330;05467142771;;Primeiro disparo;;;;
5374;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;RAIMUNDA NONATA LIMA DE FARIA;808129;;1;5561999091990;08673217172;;Primeiro disparo;;;;
5375;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;NILTON OLIVEIRA;813535;;1;5561999221644;11995016896;;Primeiro disparo;;;;
5376;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;MARCIA TAVARES;821592;;1;5561999850786;21418063134;;Primeiro disparo;;;;
5377;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;ELAINE MORELO;827489;;1;5561996048647;26005973878;;Primeiro disparo;;;;
5378;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;ENEIDA MARIA REBEIRO GONSALVE;830547;;1;5561996176914;28928113172;;Primeiro disparo;;;;
5379;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;ROGERIO VITORINO DE ALMEIDA;833200;;1;5561981751622;31344801153;;Primeiro disparo;;;;
5380;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;EFIJANIA ALEVES DA SILVA;840801;;2;5561992180024;37968696100;;Primeiro disparo;;;;
5381;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;EFIJANIA ALEVES DA SILVA;840801;;2;5561993948131;37968696100;;Primeiro disparo;;;;
5382;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;MARIA DE FATIMA ALMEIDA;846659;;1;5561999045533;44314787104;;Primeiro disparo;;;;
5383;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;MARLENE DANTAS DE OLIVEIRA;855277;;1;5561985019707;53953703153;;Primeiro disparo;;;;
5384;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;ROSIMEIRE MENDES;859594;;1;5561992242209;58492461187;;Primeiro disparo;;;;
5385;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;WIGMAR AGUIAR DA COSTA;866367;;1;5561981744617;65137779768;;Primeiro disparo;;;;
5386;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;SIMONE SOARES;867502;;1;5561983219323;66517303120;;Primeiro disparo;;;;
5387;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Primeiro Disparo;;116;FABBIO UBIRATAN NUNES LARA;879006;;1;5561996182531;72569697168;;Primeiro disparo;;;;
5388;;2025-03-07 11:55:00;VENCIDOS 2445 - 01.12.2024 A 26.01.2025.05;;Venda manual;Bruno Ezequiel Costa Padi;116;BRUNO EZEQUIEL COSTA PADILHA;894935;23:59;2;5561981717739;87280337104;;Primeiro disparo;;;;
```

Segue em anexo a imagem com nome de "Dashboard Layout.jpeg" é de como o layout do dashboard deve se parecer, mas gostaria de alterar as cores para azul, preto e branco.

Atualmente tenho que abrir esse arquivo CSV em um programa de planilhas e fazer vários filtros e formulas para realizar o calculo de todas as informações que preciso esse é um trabalho demorado e repetitivo que tenho que fazer, preciso que esse sistema automatiza isso.

Cada arquivo CSV é composto por 1 ou mais campanhas, mas é sempre referente a um único dia.

No topo do dashboard deve ter o nome das campanhas que foram realizadas nesse dia essa informação está na coluna "Campanha". Caso tenha mais de 1 nome de campanha no arquivo deve ser mostrado todos os nomes;

Logo abaixo deve mostrar o dia do disparo com um label de "Disparo do dia:" da campanha que está na coluna "Dt.Envio" ou se essa coluna não tiver informação ela estará na coluna "Dt.Inclusão". Mas sempre deve priorizar a coluna "Dt.Envio".

Então abaixo vou listar outros 10 itens que esse dashboard deve mostrar onde terá o nome do campo e abaixo o que ele deve conter:
1 - Núm Disparos
Esse campo deve mostrar a soma dos disparos realizados desse dia, no caso do exemplo tivemos 2 disparos diferentes no mesmo dia, então esse campo deve mostrar "2";

2 - Total Clientes
Esse campo deve calcular quantos clientes tiveram nessa campanha para isso basta contar quantos CPFs únicos temos na coluna "CNPJ/CPF", nessa coluna as vezes o número do CPF é repetido, e esse campo deve mostrar apenas o números de quantos CPFs diferentes existem.

3 - Total Disparos
Esse campo deve mostrar o número de linhas que o arquivo tem, desconsiderando o nome dos campos, ou seja essa deverá ser a soma total de quantos números temos na coluna "Telefone";

4 - Total Respostas
Esse campo já foi explicado anteriormente, mas ele deve mostrar apenas o número total de linhas que tem algo preenchido na coluna "Nome WhatsApp"

5 - Total de Vendas
Para esse campo é 
a soma dos valores da soma dos números dos status "Venda IA" e "Venda manual"

6 - Custo Total

7 - Média de valor vendido

8 - Percentual de Respostas (Respostas/Clientes)

9 - Taxa de Conversão (Vendas/Clientes)

10 - Taxa de Conversão (Vendas/Respostas)