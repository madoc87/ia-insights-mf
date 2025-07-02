# **Nome do Aplicativo**: IA Insights

## Core Features (Recursos Principais):
- Upload de CSV: O sistema deve aceitar que seja enviado um arquivo CSV contendo dados da campanha.
- Exibição de Informações da Campanha: Exibir os nomes das campanhas e a data da campanha nas colunas "Campanha" e "Dt.Envio"/"Dt.Inclusão".
- Gráfico de Status: Gerar um gráfico de barras mostrando a contagem de cada valor único de "Status", após remover clientes duplicados com base na coluna "Nome WhatsApp".
- Cálculo de Custo: Calcular e exibir o custo total da campanha multiplicando o número total de linhas no CSV por um custo fixo por mensagem (R$ 0,10). Formatar a saída como moeda.
- Exibição das Métricas Chave: Calcular e exibir as métricas chave: Total de Clientes (total de valores únicos da coluna 'CNPJ/CPF'), Total de Disparos (total de valores da coluna 'Telefone'), Total de Respostas (total de valores preenchidos da coluna 'Nome WhatsApp'), Total de Vendas (soma das colunas 'Venda IA' e 'Venda Manual'), Valor médio vendido (Total de Vendas * 149,9, formatado como moeda), Porcentagem de Respostas ((Total de Respostas / Total de Clientes) * 100, com '%'), Taxa de Conversão (Vendas/Clientes) ((Total de Vendas / Total de Clientes) * 100, com '%'), Taxa de Conversão (Vendas/Respostas) ((Total de Vendas / Total de Respostas) * 100, com '%').

## Style Guidelines (Diretrizes de Estilo):
- Cor primária: Branco ou cinza-claro para o fundo.
- Cor secundária: Preto ou cinza-escuro para texto e elementos-chave.
- Cor de destaque: Azul (#3498db) para elementos interativos e destaques.
- Layout do painel: Layout semelhante à imagem fornecida "Dashboard Layout.jpeg", adaptando ao esquema de cores à paleta definida.
- Uso de ícones simples e limpos para cada métrica e gráfico.
- Manter uma tipografia clara e legível para todos os elementos de texto.

## Demanda inicial:
Um sistema onde o usuário faça o upload de um arquivo CSV e será gerado um dashboard com algumas informações sobre o arquivo. Esse arquivo é o resultado de uma campanha realizada na empresa.

A fonte de dados será um CSV que é uma tabela com várias colunas e linhas com todos os clientes e as informações deles referente a essa campanha.

Dentre as várias colunas, as mais importantes para criar o primeiro gráfico são:
Status;
Nome WhatsApp;
CPF;

A primeira informação necessária é de um gráfico de barras agrupado pela coluna status.

Onde existem vários tipos de status e esse gráfico mostrará os números de cada um desses status.

Cada linha é referente a um número de telefone, mas no arquivo existe mais de um telefone por cliente, alguns clientes tem apenas 1 telefone, outros têm 2, outros têm 3, etc.
É necessário realizar uma forma de agrupar esses status para exibir no gráfico, mas sem repetir os status do mesmo cliente, visto que no sistema atual onde essas informações são alimentadas, quando é alterado o status de uma linha se o mesmo cliente tiver em outras linhas (ou seja esse cliente tem vários telefones na campanha) esse status é repetido em todas as linhas desse cliente.

Ou seja, se o cliente Fabrício tem 2 telefones nessa campanha ele irá aparecer em duas linhas, onde na coluna CPF as duas linhas estarão repetindo o mesmo número já que é o mesmo cliente, assim como o status será igual também nas duas linhas, só o que mudará é a coluna telefone.

No sistema atual para verificar o número correto dos status do cliente é realizado um filtro removendo todas as linhas em branco da coluna Nome WhatsApp, já que essa coluna só é preenchida em apenas uma das linhas de cada cliente, depois disso só restam os clientes que responderam na campanha e então é feito um agrupamento por status e assim restam apenas os números de quantos clientes respondem a essa campanha e também os valores por status de cada um desses clientes.

O sistema pode ser feito em Python no JS (React/Next). Não necessariamente precisa ser feito dessa mesma forma, mas é necessário um gráfico onde cada uma das barras seja o total de cada status da campanha e que não tenham as linhas repetidas dos clientes, assim restando o número exato dos status por cliente.

Além desse gráfico é preciso outro no mesmo dashboard, onde deverá ser calculado o valor total de custo com base no número total de linhas dessa tabela, multiplicado por um valor fixo. Que será de 0,10 que é o custo de cada mensagem que enviamos, então como cada linha representa um número, então devo multiplicar o número total de linhas (ou seja, o número total de telefones que enviamos mensagem) por 0,10 centavos. Isso resultará no valor do custo dessa campanha.

Exemplo: Um arquivo CSV tem 608 linha, após realizar todos os filtros, como é possível fazer o cálculo necessário usando esse valor e multiplicar por um valor fixo? 

Nesse caso é necessário calcular o valor do custo da campanha, que deverá ser o número de linhas, ou seja, "608 * 0,10", onde 0,10 é o valor de cada mensagem que foi enviada. 

Então no final o painel deverá mostrar o resultado dessa conta, no formato de moeda em Reais Brasileiro que será: R$ 60,80.

Segue abaixo uma parte do arquivo CSV com apenas algumas linhas, mas com todos os campos 

```
Seq.;Dt.Envio;Dt.Inclusão;Campanha;Tipo de venda;Status;Nome WhatsApp;Qtd.Cli.Campanha;Nome TMK;Cód.TMK;Tempo de Resposta;Qtd.Telefone;Telefone;CNPJ/CPF;Observação;Funil;Dt.Agenda;Dt.Troca;Dt.Funil;Tipo de Contato
5372;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Primeiro Disparo;;116;Gabriel Lima Santos;104827;;1;5511987654321;12345678901;;Primeiro disparo;;;;
5373;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Confirmar data;;116;Sofia Costa Almeida;293847;;1;5521987654322;23456789012;;Primeiro disparo;;;;
5374;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Desativar telefone;;116;Lucas Pereira Andrade;384756;;1;5531987654323;34567890123;;Primeiro disparo;;;;
5375;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Desativar telefone;;116;Isabela Martins Gomes;475869;;1;5541987654324;45678901234;;Primeiro disparo;;;;
5376;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Trocar depois;;116;Mateus Rodrigues Souza;568791;;1;5551987654325;56789012345;;Primeiro disparo;;;;
5377;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Bot;;116;Laura Azevedo Barbosa;657893;;1;5561987654326;67890123456;;Primeiro disparo;;;;
5378;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Confirmar pagamento;;116;Beatriz Ferreira Castro Lopes;784930;;1;5571987654327;78901234567;;Primeiro disparo;;;;
5379;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Trocar depois;;116;Pedro Rocha Pinto;839274;;1;5581987654328;89012345678;;Primeiro disparo;;;;
5380;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Venda IA;;116;Ana Clara Dias Mendes;928375;;2;5591987654329;90123456789;;Primeiro disparo;;;;
5381;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Trocar depois;;116;Ana Clara Dias Mendes;928375;;2;5512987654320;90123456789;;Primeiro disparo;;;;
5382;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Desativar cliente;;116;Julia Nogueira Ribeiro;193846;;1;5522987654321;11223344556;;Primeiro disparo;;;;
5383;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Bot;;116;Guilherme Alves Monteiro;284739;;1;5532987654322;22334455667;;Primeiro disparo;;;;
5384;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Venda IA;;116;Manuela Cunha Barros;374628;;1;5542987654323;33445566778;;Primeiro disparo;;;;
5385;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Venda manual;;116;Leonardo Correia Teixeira;485739;;1;5552987654324;44556677889;;Primeiro disparo;;;;
5386;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Já trocou em outra empresa;;116;Mariana Pinto Neves;573820;;1;5562987654325;55667788990;;Primeiro disparo;;;;
5387;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Já trocou em outra empresa;;116;Rafael Sousa Fernandes;694821;;1;5572987654326;66778899001;;Primeiro disparo;;;;
5388;;2025-03-07 11:55:00;VENCIDOS 2445-01.12 A 26.01;;Venda manual;Bruno Ezequiel Costa Padi;116;Arthur Melo Cavalcanti;783921;23:59;2;5582987654327;77889900112;;Primeiro disparo;;;;
```

Segue em anexo a imagem com nome de "Dashboard Layout.jpeg" é de como o layout do dashboard deve se parecer, mas as cores devem ser azul, preto e branco.

Atualmente é necessário abrir o arquivo CSV em um programa de planilhas e fazer vários filtros e fórmulas para realizar o cálculo de todas as informações, esse é um trabalho demorado e repetitivo, o sistema deverá automatizar esse processo.

Cada arquivo CSV é composto por 1 ou mais campanhas, mas é sempre referente a um único dia.

No topo do dashboard deverá ter o nome das campanhas que foram realizadas nesse dia, essa informação está na coluna "Campanha". Caso tenha mais de 1 nome de campanha no arquivo deve ser mostrado todos os nomes;

Logo abaixo deve mostrar o dia do disparo com um label de "Disparo do dia:" da campanha que está na coluna "Dt.Envio" ou se essa coluna não tiver informação ela estará na coluna "Dt.Inclusão". Mas sempre deve priorizar a coluna "Dt.Envio".

Então abaixo será listado outros 10 itens que esse dashboard deve mostrar onde terá o nome do campo e abaixo o que ele deve conter:

1 - Núm Disparos
Esse campo deve mostrar a soma dos disparos realizados desse dia, no caso do exemplo tivemos 2 disparos diferentes no mesmo dia, então esse campo deve mostrar "2";

2 - Total Clientes
Esse campo deve calcular quantos clientes tiveram nessa campanha, para isso basta contar quantos CPFs únicos temos na coluna "CNPJ/CPF", nessa coluna às vezes o número do CPF é repetido, e esse campo deve mostrar apenas o números de quantos CPFs diferentes existem.

3 - Total Disparos
Esse campo deve mostrar o número de linhas que o arquivo tem, desconsiderando o nome dos campos, ou seja, essa deverá ser a soma total de quantos números temos na coluna "Telefone";

4 - Total Respostas
Esse campo já foi explicado anteriormente, mas ele deve mostrar apenas o número total de linhas que tem algo preenchido na coluna "Nome WhatsApp"

5 - Total de Vendas
Esse campo é a soma dos valores das colunas com os status "Venda IA" e "Venda manual"

6 - Custo Total
Esta seção exibe uma média do valor gasto com o envio das mensagens nas campanhas desse arquivo CSV carregado. Calculo: Total de disparos x 0,1 (Custo por mensagem no Blip)

7 - Média de valor vendido
Esta seção exibe uma estimativa de valor baseado no número de vendas. Para esse cálculo cada venda é multiplicada por R$ 149,90. Calculo: Total de Vendas x 149,90.

8 - Percentual de Respostas (Respostas/Clientes)
Esta seção exibe o percentual de respostas. Esse percentual é calculado dividindo o total de respostas pelo total de clientes únicos. Calculo: (Total de respostas / Total de clientes)*100.

9 - Taxa de Conversão (Vendas/Clientes)
Esta seção exibe o percentual da taxa de conversão da campanha. Esse percentual é calculado dividindo o total de vendas pelo total de clientes únicos. Calculo: (Total de vendas / Total de clientes)*100.

10 - Taxa de Conversão (Vendas/Respostas)
Esta seção exibe o percentual da taxa de conversão com base no número de respostas. Esse percentual é calculado dividindo o total de vendas pelo total de respostas. Calculo: (Total de vendas / Total de respostas)*100.
