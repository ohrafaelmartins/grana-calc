#!/bin/bash

# ========================================
# GranaCalc - Deploy Automation Script
# ========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLUSTER_NAME="grana-calc"
IMAGE_NAME="grana-calc"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="${NAMESPACE:-default}"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_dependencies() {
    print_header "Checking Dependencies"

    local deps=("docker" "kubectl" "kind")
    local missing=()

    for dep in "${deps[@]}"; do
        if command -v "$dep" &> /dev/null; then
            print_success "$dep is installed"
        else
            print_error "$dep is NOT installed"
            missing+=("$dep")
        fi
    done

    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
        exit 1
    fi
}

create_cluster() {
    print_header "Creating kind Cluster"

    if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
        print_info "Cluster '${CLUSTER_NAME}' already exists"
        read -p "Do you want to delete and recreate it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kind delete cluster --name "${CLUSTER_NAME}"
            print_success "Deleted existing cluster"
        else
            print_info "Using existing cluster"
            return
        fi
    fi

    cat <<EOF | kind create cluster --name "${CLUSTER_NAME}" --config=-
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

    print_success "Cluster created successfully"
    kubectl cluster-info --context "kind-${CLUSTER_NAME}"
}

build_image() {
    print_header "Building Docker Image"

    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

    print_success "Image built: ${IMAGE_NAME}:${IMAGE_TAG}"
}

load_image() {
    print_header "Loading Image to kind"

    kind load docker-image "${IMAGE_NAME}:${IMAGE_TAG}" --name "${CLUSTER_NAME}"

    print_success "Image loaded to kind cluster"
}

create_secrets() {
    print_header "Creating Kubernetes Secrets"

    if kubectl get secret grana-calc-secrets -n "${NAMESPACE}" &> /dev/null; then
        print_info "Secret 'grana-calc-secrets' already exists"
        read -p "Do you want to recreate it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kubectl delete secret grana-calc-secrets -n "${NAMESPACE}"
        else
            return
        fi
    fi

    # Generate secure random secrets
    SESSION_SECRET=$(openssl rand -base64 32)
    APP_PASSWORD=$(openssl rand -base64 24)

    kubectl create secret generic grana-calc-secrets \
        --from-literal=NODE_ENV=production \
        --from-literal=SESSION_SECRET="${SESSION_SECRET}" \
        --from-literal=APP_PASSWORD="${APP_PASSWORD}" \
        -n "${NAMESPACE}"

    print_success "Secrets created successfully"
}

deploy_app() {
    print_header "Deploying Application"

    kubectl apply -f k8s/configmap.yaml -n "${NAMESPACE}"
    print_success "ConfigMap applied"

    kubectl apply -f k8s/deployment.yaml -n "${NAMESPACE}"
    print_success "Deployment and Services applied"

    kubectl apply -f k8s/hpa.yaml -n "${NAMESPACE}"
    print_success "HPA applied"

    print_info "Waiting for deployment to be ready..."
    kubectl rollout status deployment/grana-calc-deployment -n "${NAMESPACE}" --timeout=120s

    print_success "Application deployed successfully"
}

install_metrics_server() {
    print_header "Installing Metrics Server"

    if kubectl get deployment metrics-server -n kube-system &> /dev/null; then
        print_info "Metrics server already installed"
        return
    fi

    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

    # Patch for kind (insecure TLS)
    kubectl patch -n kube-system deployment metrics-server --type=json \
        -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

    print_info "Waiting for metrics-server to be ready..."
    kubectl wait --for=condition=available --timeout=60s deployment/metrics-server -n kube-system

    print_success "Metrics server installed"
}

show_status() {
    print_header "Deployment Status"

    echo -e "\n${BLUE}Pods:${NC}"
    kubectl get pods -n "${NAMESPACE}" -l app=grana-calc

    echo -e "\n${BLUE}Services:${NC}"
    kubectl get services -n "${NAMESPACE}" -l app=grana-calc

    echo -e "\n${BLUE}Deployments:${NC}"
    kubectl get deployments -n "${NAMESPACE}" -l app=grana-calc

    echo -e "\n${BLUE}HPA:${NC}"
    kubectl get hpa -n "${NAMESPACE}" grana-calc-hpa
}

show_access_info() {
    print_header "Access Information"

    echo -e "\n${GREEN}Application is ready!${NC}\n"
    echo -e "${BLUE}Access methods:${NC}\n"
    echo -e "1. ${YELLOW}NodePort (Recommended):${NC}"
    echo -e "   URL: ${GREEN}http://localhost:30000${NC}\n"

    echo -e "2. ${YELLOW}Port Forward:${NC}"
    echo -e "   Run: ${GREEN}kubectl port-forward service/grana-calc-service 3000:80${NC}"
    echo -e "   URL: ${GREEN}http://localhost:3000${NC}\n"

    echo -e "${BLUE}Useful commands:${NC}\n"
    echo -e "  View logs:    ${GREEN}kubectl logs -f deployment/grana-calc-deployment${NC}"
    echo -e "  Get pods:     ${GREEN}kubectl get pods${NC}"
    echo -e "  Scale up:     ${GREEN}kubectl scale deployment/grana-calc-deployment --replicas=5${NC}"
    echo -e "  Delete all:   ${GREEN}kubectl delete -f k8s/${NC}"
}

# Main execution
main() {
    print_header "GranaCalc - Kubernetes Deployment"

    check_dependencies
    create_cluster
    build_image
    load_image
    create_secrets
    install_metrics_server
    deploy_app
    show_status
    show_access_info

    print_success "Deployment completed successfully! 🎉"
}

# Parse command line arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    clean)
        print_header "Cleaning up"
        kubectl delete -f k8s/ -n "${NAMESPACE}" 2>/dev/null || true
        kind delete cluster --name "${CLUSTER_NAME}" 2>/dev/null || true
        print_success "Cleanup completed"
        ;;
    status)
        show_status
        show_access_info
        ;;
    logs)
        kubectl logs -f deployment/grana-calc-deployment -n "${NAMESPACE}"
        ;;
    *)
        echo "Usage: $0 {deploy|clean|status|logs}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application (default)"
        echo "  clean   - Delete all resources and cluster"
        echo "  status  - Show deployment status"
        echo "  logs    - Show application logs"
        exit 1
        ;;
esac
