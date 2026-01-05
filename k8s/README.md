# ☸️ Kubernetes Deployment Guide

Este guia detalha como fazer deploy do GranaCalc em um cluster Kubernetes usando kind (Kubernetes in Docker).

## 📋 Pré-requisitos

- Docker instalado
- kubectl instalado
- kind instalado

```bash
# Instalar kind (macOS)
brew install kind

# Instalar kind (Linux)
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Verificar instalação
kind version
kubectl version --client
docker version
```

## 🚀 Deploy Passo a Passo

### 1. Criar Cluster kind

```bash
# Criar cluster
kind create cluster --name grana-calc --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
- role: worker
- role: worker
EOF

# Verificar cluster
kubectl cluster-info --context kind-grana-calc
kubectl get nodes
```

### 2. Build e Carregar Imagem Docker

```bash
# Navegar para o diretório do projeto
cd /tmp/grana-calc

# Build da imagem
docker build -t grana-calc:latest .

# Verificar imagem criada
docker images | grep grana-calc

# Carregar imagem no kind
kind load docker-image grana-calc:latest --name grana-calc

# Verificar imagem carregada
docker exec -it grana-calc-control-plane crictl images | grep grana-calc
```

### 3. Criar Secrets do Kubernetes

**⚠️ IMPORTANTE**: Nunca use secrets em texto plano em produção!

```bash
# Opção 1: Criar secrets via linha de comando (RECOMENDADO)
kubectl create secret generic grana-calc-secrets \
  --from-literal=NODE_ENV=production \
  --from-literal=SESSION_SECRET=$(openssl rand -base64 32) \
  --from-literal=APP_PASSWORD=$(openssl rand -base64 24)

# Opção 2: Aplicar arquivo YAML (apenas para desenvolvimento)
kubectl apply -f k8s/secrets.yaml

# Verificar secrets criados
kubectl get secrets
kubectl describe secret grana-calc-secrets
```

### 4. Deploy dos Recursos

```bash
# Aplicar ConfigMap
kubectl apply -f k8s/configmap.yaml

# Aplicar Deployment e Services
kubectl apply -f k8s/deployment.yaml

# Aplicar HPA (Horizontal Pod Autoscaler)
kubectl apply -f k8s/hpa.yaml

# Verificar recursos criados
kubectl get all
kubectl get configmap
kubectl get hpa
```

### 5. Verificar Status do Deploy

```bash
# Ver pods
kubectl get pods -w
# Aguarde até todos os pods estarem Running

# Ver deployments
kubectl get deployments

# Ver services
kubectl get services

# Ver logs
kubectl logs -f deployment/grana-calc-deployment

# Descrever pod (para troubleshooting)
kubectl describe pod <pod-name>
```

### 6. Acessar a Aplicação

#### Opção A: Via NodePort (Porta 30000)

```bash
# A aplicação estará disponível em:
# http://localhost:30000

# Se estiver em ambiente remoto, use o IP do node:
kubectl get nodes -o wide
# Acesse: http://<NODE-IP>:30000
```

#### Opção B: Via Port Forward

```bash
# Forward local para o service
kubectl port-forward service/grana-calc-service 3000:80

# Acesse: http://localhost:3000
```

#### Opção C: Via Ingress (Opcional)

```bash
# Instalar nginx-ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Aguardar ingress controller ficar pronto
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Aplicar ingress
kubectl apply -f k8s/ingress.yaml

# Adicionar entrada no /etc/hosts
echo "127.0.0.1 grana-calc.local" | sudo tee -a /etc/hosts

# Acesse: http://grana-calc.local
```

## 🔍 Verificações de Saúde

### Health Checks

```bash
# Via kubectl exec
kubectl exec -it <pod-name> -- wget -qO- http://localhost:3000/health

# Via curl (com port-forward ativo)
curl http://localhost:3000/health
```

### Liveness e Readiness Probes

```bash
# Ver eventos dos pods
kubectl get events --sort-by='.lastTimestamp'

# Descrever pod para ver probe status
kubectl describe pod <pod-name>
```

## 📊 Monitoramento

### Logs

```bash
# Logs de um pod específico
kubectl logs <pod-name>

# Logs de todos os pods do deployment
kubectl logs -f deployment/grana-calc-deployment

# Logs de um pod específico (follow)
kubectl logs -f <pod-name>

# Logs anteriores (se pod crashou)
kubectl logs <pod-name> --previous

# Logs de todos os pods com label app=grana-calc
kubectl logs -f -l app=grana-calc
```

### Métricas

```bash
# Ver uso de recursos dos pods
kubectl top pods

# Ver uso de recursos dos nodes
kubectl top nodes

# Ver HPA status
kubectl get hpa
kubectl describe hpa grana-calc-hpa
```

## 🔧 Operações Comuns

### Escalar Deployment

```bash
# Escalar manualmente para 5 réplicas
kubectl scale deployment grana-calc-deployment --replicas=5

# Ver status do scaling
kubectl get pods -w

# Verificar HPA
kubectl get hpa -w
```

### Atualizar Aplicação

```bash
# Build nova versão
docker build -t grana-calc:v2.0.0 .

# Carregar no kind
kind load docker-image grana-calc:v2.0.0 --name grana-calc

# Atualizar imagem no deployment
kubectl set image deployment/grana-calc-deployment \
  grana-calc=grana-calc:v2.0.0

# Ver rollout status
kubectl rollout status deployment/grana-calc-deployment

# Ver histórico de rollouts
kubectl rollout history deployment/grana-calc-deployment
```

### Rollback

```bash
# Rollback para versão anterior
kubectl rollout undo deployment/grana-calc-deployment

# Rollback para revisão específica
kubectl rollout undo deployment/grana-calc-deployment --to-revision=2

# Ver status do rollback
kubectl rollout status deployment/grana-calc-deployment
```

### Reiniciar Deployment

```bash
# Reiniciar todos os pods do deployment
kubectl rollout restart deployment/grana-calc-deployment
```

## 🧹 Limpeza

### Deletar Recursos

```bash
# Deletar todos os recursos do projeto
kubectl delete -f k8s/

# Ou deletar individualmente
kubectl delete deployment grana-calc-deployment
kubectl delete service grana-calc-service
kubectl delete service grana-calc-nodeport
kubectl delete configmap grana-calc-config
kubectl delete secret grana-calc-secrets
kubectl delete hpa grana-calc-hpa
```

### Deletar Cluster kind

```bash
# Deletar cluster
kind delete cluster --name grana-calc

# Verificar clusters
kind get clusters
```

## 🐛 Troubleshooting

### Pod não inicia

```bash
# Ver eventos
kubectl get events --sort-by='.lastTimestamp'

# Descrever pod
kubectl describe pod <pod-name>

# Ver logs
kubectl logs <pod-name>

# Verificar imagem
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].image}'
```

### ImagePullBackOff

```bash
# Verificar se imagem foi carregada no kind
docker exec -it grana-calc-control-plane crictl images | grep grana-calc

# Recarregar imagem
kind load docker-image grana-calc:latest --name grana-calc

# Reiniciar deployment
kubectl rollout restart deployment/grana-calc-deployment
```

### Service não acessível

```bash
# Verificar endpoints
kubectl get endpoints

# Testar dentro do cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- \
  wget -qO- http://grana-calc-service

# Verificar labels
kubectl get pods --show-labels
kubectl get service grana-calc-service -o yaml
```

### HPA não funciona

```bash
# Instalar metrics-server para kind
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Patch para funcionar com kind (insecure TLS)
kubectl patch -n kube-system deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

# Verificar metrics-server
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods
```

## 📚 Recursos Adicionais

- [kind Documentation](https://kind.sigs.k8s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🔒 Segurança em Produção

Para ambientes de produção, considere:

1. **Secrets Management**:
   - Use Sealed Secrets ou External Secrets Operator
   - Integre com Vault ou cloud provider secret manager

2. **Network Policies**:
   - Implemente Network Policies para isolar pods
   - Use service mesh (Istio, Linkerd)

3. **RBAC**:
   - Configure Role-Based Access Control
   - Princípio do menor privilégio

4. **TLS/SSL**:
   - Use cert-manager para certificados
   - Configure Ingress com TLS

5. **Security Context**:
   - Run containers as non-root
   - Use read-only root filesystem

---

💰 **GranaCalc** - Deploy Kubernetes Production-Ready
