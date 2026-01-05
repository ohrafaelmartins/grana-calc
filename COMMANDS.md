# 🚀 Comandos Rápidos - GranaCalc

Referência rápida de comandos para usar o GranaCalc.

## 📂 Navegação

```bash
# Ir para o diretório do projeto
cd /tmp/grana-calc

# Listar arquivos
ls -la
```

## 🌐 Uso Local (Browser)

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows (Git Bash/WSL)
start index.html

# Python HTTP Server
python3 -m http.server 3000
# Acesse: http://localhost:3000

# Node.js HTTP Server
npx http-server -p 3000
# Acesse: http://localhost:3000
```

## 🐳 Docker

### Docker Run (Manual)
```bash
# Build
docker build -t grana-calc:latest .

# Run
docker run -d -p 3000:3000 --name grana-calc grana-calc:latest

# Logs
docker logs -f grana-calc

# Stop & Remove
docker stop grana-calc
docker rm grana-calc

# Restart
docker restart grana-calc

# Exec (shell no container)
docker exec -it grana-calc sh
```

### Docker Compose (Recomendado)
```bash
# Start (background)
docker-compose up -d

# Start (foreground com logs)
docker-compose up

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild & Start
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

### Docker Úteis
```bash
# Ver containers rodando
docker ps

# Ver todas as imagens
docker images

# Remover imagem
docker rmi grana-calc:latest

# Limpar containers parados
docker container prune

# Limpar tudo (cuidado!)
docker system prune -a
```

## ☸️ Kubernetes

### Deploy Automatizado
```bash
# Deploy completo (recomendado)
./deploy.sh deploy

# Ver status
./deploy.sh status

# Ver logs
./deploy.sh logs

# Limpar tudo
./deploy.sh clean
```

### kind (Cluster Management)
```bash
# Criar cluster
kind create cluster --name grana-calc

# Listar clusters
kind get clusters

# Deletar cluster
kind delete cluster --name grana-calc

# Carregar imagem no kind
kind load docker-image grana-calc:latest --name grana-calc
```

### kubectl (Resource Management)
```bash
# Ver todos os recursos
kubectl get all

# Ver pods
kubectl get pods
kubectl get pods -w  # watch mode

# Ver services
kubectl get services
kubectl get svc

# Ver deployments
kubectl get deployments
kubectl get deploy

# Ver logs
kubectl logs -f deployment/grana-calc-deployment
kubectl logs -f <pod-name>
kubectl logs <pod-name> --previous  # logs do pod anterior

# Descrever recursos (troubleshooting)
kubectl describe pod <pod-name>
kubectl describe deployment grana-calc-deployment
kubectl describe service grana-calc-service

# Ver eventos
kubectl get events --sort-by='.lastTimestamp'

# Exec em pod (shell)
kubectl exec -it <pod-name> -- sh
kubectl exec -it <pod-name> -- wget -qO- http://localhost:3000/health
```

### kubectl (Apply/Delete)
```bash
# Aplicar todos os manifestos
kubectl apply -f k8s/

# Aplicar arquivo específico
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deletar recursos
kubectl delete -f k8s/
kubectl delete deployment grana-calc-deployment
kubectl delete service grana-calc-service
```

### kubectl (Scaling)
```bash
# Escalar manualmente
kubectl scale deployment grana-calc-deployment --replicas=5

# Ver HPA
kubectl get hpa
kubectl get hpa grana-calc-hpa -w

# Descrever HPA
kubectl describe hpa grana-calc-hpa

# Ver métricas (requer metrics-server)
kubectl top nodes
kubectl top pods
```

### kubectl (Rollout)
```bash
# Status do rollout
kubectl rollout status deployment/grana-calc-deployment

# Histórico
kubectl rollout history deployment/grana-calc-deployment

# Rollback (última versão)
kubectl rollout undo deployment/grana-calc-deployment

# Rollback (versão específica)
kubectl rollout undo deployment/grana-calc-deployment --to-revision=2

# Restart (zero downtime)
kubectl rollout restart deployment/grana-calc-deployment
```

### kubectl (Port Forward)
```bash
# Port forward para service
kubectl port-forward service/grana-calc-service 3000:80

# Port forward para pod
kubectl port-forward <pod-name> 3000:3000

# Background
kubectl port-forward service/grana-calc-service 3000:80 &
```

### kubectl (Secrets & ConfigMaps)
```bash
# Ver secrets
kubectl get secrets
kubectl describe secret grana-calc-secrets

# Ver secret decodificado (cuidado!)
kubectl get secret grana-calc-secrets -o jsonpath='{.data.SESSION_SECRET}' | base64 -d

# Criar secret
kubectl create secret generic grana-calc-secrets \
  --from-literal=NODE_ENV=production \
  --from-literal=SESSION_SECRET=your-secret

# Ver configmaps
kubectl get configmaps
kubectl describe configmap grana-calc-config

# Editar resources
kubectl edit deployment grana-calc-deployment
kubectl edit configmap grana-calc-config
```

## 📦 NPM Scripts

```bash
# Instalar dependências (se usar Node.js)
npm install

# Iniciar servidor local
npm start

# Build Docker
npm run docker:build

# Run Docker
npm run docker:run

# Stop Docker
npm run docker:stop

# Docker Compose up
npm run compose:up

# Docker Compose down
npm run compose:down

# Kubernetes deploy
npm run k8s:deploy

# Kubernetes clean
npm run k8s:clean

# Kubernetes status
npm run k8s:status
```

## 🔧 Validação & Debug

```bash
# Validar projeto
./validate.sh

# Ver versões
docker --version
docker-compose --version
kubectl version --client
kind version

# Health check
curl http://localhost:3000/health
curl http://localhost:30000/health  # NodePort K8s

# Test responsiveness
curl -I http://localhost:3000
```

## 🧹 Limpeza

```bash
# Limpar Docker
docker stop grana-calc
docker rm grana-calc
docker rmi grana-calc:latest

# Limpar Docker Compose
docker-compose down -v

# Limpar Kubernetes
kubectl delete -f k8s/

# Limpar kind cluster
kind delete cluster --name grana-calc

# Limpar tudo
./deploy.sh clean
```

## 📊 Monitoramento

```bash
# Logs em tempo real (Docker)
docker logs -f grana-calc

# Logs em tempo real (K8s)
kubectl logs -f deployment/grana-calc-deployment

# Stats (Docker)
docker stats grana-calc

# Resources (K8s)
kubectl top pods
kubectl top nodes

# Watch pods
watch kubectl get pods

# Stream events
kubectl get events -w
```

## 🔍 Troubleshooting

```bash
# Docker não inicia
docker ps -a
docker logs grana-calc
docker inspect grana-calc

# Kubernetes pod crashando
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous
kubectl get events

# ImagePullBackOff
kind load docker-image grana-calc:latest --name grana-calc
kubectl rollout restart deployment/grana-calc-deployment

# Port já em uso
lsof -i :3000
kill -9 <PID>

# Metrics server não funciona (kind)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch -n kube-system deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

## 🌍 Acesso URLs

```bash
# Local (Browser direto)
file:///tmp/grana-calc/index.html

# Python/Node Server
http://localhost:3000

# Docker / Docker Compose
http://localhost:3000

# Kubernetes NodePort
http://localhost:30000

# Kubernetes Port Forward
kubectl port-forward service/grana-calc-service 3000:80
http://localhost:3000

# Ingress (se configurado)
http://grana-calc.local
```

## 📚 Documentação

```bash
# Ver README principal
cat README.md

# Quick start
cat QUICKSTART.md

# Kubernetes guide
cat k8s/README.md

# Contribuir
cat CONTRIBUTING.md

# Resumo do projeto
cat PROJECT_SUMMARY.md

# Este arquivo
cat COMMANDS.md
```

## ⚡ One-Liners Úteis

```bash
# Deploy completo K8s
./deploy.sh deploy && kubectl get all

# Build + Run Docker
docker build -t grana-calc:latest . && docker run -d -p 3000:3000 --name grana-calc grana-calc:latest

# Ver tudo no Kubernetes
kubectl get all,configmap,secret,ingress,hpa

# Restart completo Docker
docker-compose down && docker-compose up -d --build && docker-compose logs -f

# Reload no kind
docker build -t grana-calc:latest . && kind load docker-image grana-calc:latest --name grana-calc && kubectl rollout restart deployment/grana-calc-deployment
```

---

💰 **GranaCalc** - Comandos Rápidos
📅 Atualizado: Janeiro 2026
