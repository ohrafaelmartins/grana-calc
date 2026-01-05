# 💰 GranaCalc - Calculadora de Tempo de Trabalho

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**GranaCalc** é uma aplicação web financeira que ajuda usuários a compreenderem quanto tempo de trabalho é necessário para adquirir bens e serviços, promovendo educação financeira e decisões de compra conscientes.

## ✨ Funcionalidades

### 📊 Cálculos Financeiros
- **Valor da hora de trabalho** - Calcula automaticamente baseado no salário e carga horária
- **Tempo necessário** - Mostra horas, dias e semanas de trabalho necessárias
- **Comprometimento salarial** - Percentual do salário utilizado na compra
- **Comparação à vista vs parcelado** - Análise de impacto para ambas modalidades

### 🎯 Avaliação de Impacto
Sistema inteligente de classificação de compras:
- 🟢 **Muito Segura** - Impacto mínimo no orçamento
- 🟢 **Segura** - Compra sustentável
- 🟡 **Moderada** - Exige planejamento
- 🟠 **Arriscada** - Avaliar prioridades
- 🔴 **Imprudente** - Alto risco financeiro
- 🔴 **Muito Imprudente** - Compromete estabilidade

### 📈 Visualizações
- **Gráfico de Pizza** - Comprometimento do salário
- **Gráfico de Barras** - Progresso para objetivo
- **Linha do Tempo** - Visualização semanal do alcance
- **Mensagens Reflexivas** - Insights personalizados

### 🎨 Design
- Interface moderna inspirada em fintechs
- Totalmente responsivo (desktop e mobile)
- Paleta profissional: azuis, verdes e cinzas
- Animações suaves e experiência fluida

## 🚀 Início Rápido

### Opção 1: Abrir Diretamente no Navegador
```bash
# Basta abrir o arquivo index.html no navegador
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Opção 2: Servidor Local com Python
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# Acesse: http://localhost:3000
```

### Opção 3: Servidor Local com Node.js
```bash
# Instale http-server globalmente
npm install -g http-server

# Execute
http-server -p 3000

# Acesse: http://localhost:3000
```

## 🐳 Docker

### Build e Run
```bash
# Build da imagem
docker build -t grana-calc:latest .

# Executar container
docker run -d -p 3000:3000 --name grana-calc grana-calc:latest

# Acesse: http://localhost:3000
```

### Docker Compose
```bash
# Iniciar aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down
```

## ☸️ Kubernetes (kind)

### 1. Criar Cluster kind
```bash
# Instalar kind (se necessário)
# macOS: brew install kind
# Linux: https://kind.sigs.k8s.io/docs/user/quick-start/

# Criar cluster
kind create cluster --name grana-calc
```

### 2. Build e Carregar Imagem
```bash
# Build da imagem
docker build -t grana-calc:latest .

# Carregar no kind
kind load docker-image grana-calc:latest --name grana-calc
```

### 3. Criar Secrets
```bash
# Criar secrets a partir do arquivo
kubectl create secret generic grana-calc-secrets \
  --from-literal=NODE_ENV=production \
  --from-literal=SESSION_SECRET=sua-chave-super-secreta \
  --from-literal=APP_PASSWORD=sua-senha-forte

# Ou aplicar o arquivo YAML (não recomendado para produção)
kubectl apply -f k8s/secrets.yaml
```

### 4. Deploy da Aplicação
```bash
# Aplicar todos os manifestos
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/hpa.yaml

# Verificar status
kubectl get pods
kubectl get services
kubectl get deployments
```

### 5. Acessar a Aplicação
```bash
# Via NodePort (porta 30000)
kubectl get nodes -o wide
# Acesse: http://<NODE-IP>:30000

# Ou via Port Forward
kubectl port-forward service/grana-calc-service 3000:80
# Acesse: http://localhost:3000
```

### 6. Comandos Úteis
```bash
# Ver logs
kubectl logs -f deployment/grana-calc-deployment

# Escalar manualmente
kubectl scale deployment grana-calc-deployment --replicas=3

# Ver autoscaling
kubectl get hpa

# Deletar tudo
kubectl delete -f k8s/
```

## 📁 Estrutura do Projeto

```
grana-calc/
├── index.html              # Estrutura HTML principal
├── styles.css              # Estilos CSS responsivos
├── script.js               # Lógica JavaScript
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de configuração
├── Dockerfile              # Configuração Docker
├── docker-compose.yml      # Orquestração Docker
├── nginx.conf              # Configuração Nginx
├── README.md               # Documentação
└── k8s/                    # Manifestos Kubernetes
    ├── deployment.yaml     # Deployment e Services
    ├── secrets.yaml        # Secrets
    ├── configmap.yaml      # ConfigMap
    ├── ingress.yaml        # Ingress (opcional)
    └── hpa.yaml            # Horizontal Pod Autoscaler
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
SESSION_SECRET=sua-chave-secreta
APP_PASSWORD=sua-senha-forte
```

## 🛡️ Segurança

### Headers de Segurança (Nginx)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: no-referrer-when-downgrade`

### Kubernetes Secrets
**⚠️ IMPORTANTE**: Nunca commite secrets em produção!

Use uma das seguintes abordagens:
- **Sealed Secrets**: https://github.com/bitnami-labs/sealed-secrets
- **External Secrets**: https://external-secrets.io/
- **Vault**: https://www.vaultproject.io/
- **Cloud Provider Secret Manager** (AWS Secrets Manager, GCP Secret Manager, etc.)

## 📊 Monitoramento

### Health Checks
```bash
# Docker
curl http://localhost:3000/health

# Kubernetes
kubectl exec -it <pod-name> -- wget -qO- http://localhost:3000/health
```

### Logs
```bash
# Docker
docker logs -f grana-calc

# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs -f deployment/grana-calc-deployment
kubectl logs -f -l app=grana-calc
```

## 🎓 Como Usar

1. **Informe seus dados financeiros:**
   - Salário (mensal ou por hora)
   - Dias trabalhados por semana
   - Horas por dia

2. **Detalhes da compra:**
   - Valor do bem/serviço
   - Forma de pagamento (à vista ou parcelado)
   - Se parcelado: valor e número de parcelas

3. **Analise os resultados:**
   - Tempo de trabalho necessário
   - Impacto no seu orçamento
   - Gráficos e visualizações
   - Mensagem reflexiva personalizada

## 🌐 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna (Flexbox, Grid)
- **JavaScript (ES6+)** - Lógica e interatividade
- **Chart.js** - Gráficos interativos
- **Docker** - Containerização
- **Kubernetes** - Orquestração
- **Nginx** - Servidor web

## 📱 Responsividade

Suporte completo para:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 🚧 Roadmap Futuro

- [ ] Modo escuro
- [ ] Histórico de cálculos
- [ ] Export para PDF
- [ ] Comparação de múltiplos produtos
- [ ] Integração com APIs de inflação
- [ ] PWA (Progressive Web App)
- [ ] Multilíngue (i18n)

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

## 🤝 Contribuindo

Contribuições são bem-vindas! Para mudanças importantes:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**GranaCalc Team** - Educação Financeira para Decisões Conscientes

---

💰 **GranaCalc** © 2026 - Transformando a forma como você enxerga o dinheiro
