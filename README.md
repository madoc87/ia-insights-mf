# Firebase Studio!!

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

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

# ia-insights-mf
