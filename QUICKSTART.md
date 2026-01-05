# 🚀 Quick Start Guide

Guia rápido para começar a usar o GranaCalc em menos de 5 minutos!

## 📦 Opção 1: Uso Local (Mais Rápido)

### Método A: Abrir diretamente no navegador

```bash
# Clone ou baixe o projeto
cd grana-calc

# Abra o arquivo no navegador
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

✅ **Pronto!** O site abrirá diretamente no navegador.

### Método B: Servidor HTTP simples

```bash
# Com Python (já instalado na maioria dos sistemas)
cd grana-calc
python3 -m http.server 3000

# Acesse: http://localhost:3000
```

## 🐳 Opção 2: Docker (Recomendado para Testes)

```bash
# 1. Build da imagem
docker build -t grana-calc:latest .

# 2. Executar container
docker run -d -p 3000:3000 --name grana-calc grana-calc:latest

# 3. Acessar
# http://localhost:3000

# Ver logs
docker logs -f grana-calc

# Parar
docker stop grana-calc && docker rm grana-calc
```

**Ou use Docker Compose:**

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## ☸️ Opção 3: Kubernetes (Deploy Automatizado)

### Pré-requisitos
- Docker instalado
- kubectl instalado
- kind instalado

### Deploy com um único comando

```bash
# Torne o script executável (primeira vez apenas)
chmod +x deploy.sh

# Execute o deploy automatizado
./deploy.sh deploy

# OU use npm
npm run k8s:deploy
```

**O script fará automaticamente:**
1. ✅ Verificar dependências
2. ✅ Criar cluster kind
3. ✅ Build da imagem Docker
4. ✅ Carregar imagem no cluster
5. ✅ Criar secrets
6. ✅ Instalar metrics-server
7. ✅ Deploy da aplicação
8. ✅ Mostrar informações de acesso

**Acesse:** http://localhost:30000

### Comandos úteis após deploy

```bash
# Ver status
./deploy.sh status

# Ver logs
./deploy.sh logs

# Limpar tudo
./deploy.sh clean
```

## 🎯 Como Usar a Aplicação

### 1. Preencha seus dados financeiros

**Salário:**
- Escolha: Mensal ou Por hora
- Digite o valor

**Escala de trabalho:**
- Dias trabalhados/semana (ex: 5)
- Horas por dia (ex: 8)

### 2. Detalhes da compra

**Valor do produto:**
- Digite o valor do bem/serviço

**Forma de pagamento:**
- **À vista**: impacto imediato no salário
- **Parcelado**: preencha valor e número de parcelas

### 3. Clique em "Calcular"

### 4. Analise os resultados

Você verá:
- ⏰ **Horas de trabalho** necessárias
- 📅 **Dias de trabalho** equivalentes
- 📊 **Semanas** aproximadas
- 💵 **Valor da sua hora**
- 📋 **Avaliação de impacto** (segura, arriscada, etc.)
- 📈 **Gráficos visuais**
- 🗓️ **Linha do tempo**
- 💭 **Mensagem reflexiva** personalizada

## 📊 Exemplos de Uso

### Exemplo 1: Compra à vista

```
Salário mensal: R$ 3.000,00
Dias/semana: 5
Horas/dia: 8
Produto: R$ 500,00 (celular)
Pagamento: À vista

Resultado:
- 29.0 horas de trabalho
- 3.6 dias
- 0.7 semanas
- 16.7% do salário
- Classificação: Moderada
```

### Exemplo 2: Compra parcelada

```
Salário mensal: R$ 4.000,00
Dias/semana: 5
Horas/dia: 8
Produto: Parcelado
Parcela: R$ 300,00
Parcelas: 12x

Resultado:
- Total: R$ 3.600,00
- Parcela: 7.5% do salário/mês
- Classificação parcela: Segura
- Total equivale: 4.6 semanas de trabalho
```

### Exemplo 3: Salário por hora

```
Valor/hora: R$ 25,00
Dias/semana: 6
Horas/dia: 6
Produto: R$ 1.200,00
Pagamento: À vista

Resultado:
- 48.0 horas de trabalho
- 8.0 dias
- 1.3 semanas
```

## 🔍 Interpretando as Classificações

### À Vista

| % do Salário | Classificação | Ação |
|--------------|---------------|------|
| 0-5% | 🟢 Muito segura | Pode comprar tranquilamente |
| 5-10% | 🟢 Segura | Compra sustentável |
| 10-20% | 🟡 Moderada | Planeje e avalie |
| 20-30% | 🟠 Arriscada | Reconsidere a prioridade |
| 30-50% | 🔴 Imprudente | Evite se possível |
| >50% | 🔴 Muito imprudente | Alto risco financeiro |

### Parcelado

| Parcela (% salário) | Classificação | Ação |
|---------------------|---------------|------|
| 0-5% | 🟢 Muito segura | Cabe com folga |
| 5-10% | 🟢 Segura | Sustentável |
| 10-15% | 🟡 Moderada | Controle necessário |
| 15-20% | 🟠 Arriscada | Reduz margem |
| 20-30% | 🔴 Imprudente | Alto risco |
| >30% | 🔴 Muito imprudente | Endividamento provável |

## 🛠️ Troubleshooting

### Gráficos não aparecem
- Verifique conexão com internet (Chart.js é carregado via CDN)
- Tente recarregar a página

### Cálculos incorretos
- Verifique se todos os campos estão preenchidos
- Valores devem ser positivos
- Dias de trabalho: 1-7
- Horas por dia: 1-24

### Docker não inicia
```bash
# Verificar se porta 3000 está livre
lsof -i :3000

# Parar processo usando a porta
kill -9 <PID>
```

### Kubernetes - Pods não iniciam
```bash
# Ver eventos
kubectl get events --sort-by='.lastTimestamp'

# Ver logs
kubectl logs -f deployment/grana-calc-deployment

# Verificar imagem
kind load docker-image grana-calc:latest --name grana-calc
kubectl rollout restart deployment/grana-calc-deployment
```

## 📚 Próximos Passos

- 📖 Leia o [README.md](README.md) completo
- ☸️ Veja o [guia Kubernetes](k8s/README.md) detalhado
- 🤝 Confira [como contribuir](CONTRIBUTING.md)

## 💡 Dicas

1. **Use compras à vista** quando possível para ver impacto real
2. **Simule parcelamentos** antes de comprar
3. **Compare diferentes cenários** alterando valores
4. **Reflita sobre a mensagem** ao final do cálculo
5. **Compartilhe** com amigos para ajudá-los nas finanças

## 🆘 Precisa de Ajuda?

- 📖 Documentação completa: [README.md](README.md)
- 🐛 Reportar bug: Abra uma issue
- 💬 Dúvidas: Use as discussions
- 🤝 Contribuir: [CONTRIBUTING.md](CONTRIBUTING.md)

---

💰 **GranaCalc** - Transforme sua relação com o dinheiro!

Feito com ❤️ para educação financeira consciente.
