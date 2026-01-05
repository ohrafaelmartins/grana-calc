#!/bin/bash

# ========================================
# GranaCalc - Validation Script
# ========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

ERRORS=0

validate_file_exists() {
    if [ -f "$1" ]; then
        print_success "File exists: $1"
    else
        print_error "File missing: $1"
        ((ERRORS++))
    fi
}

validate_file_not_empty() {
    if [ -s "$1" ]; then
        print_success "File not empty: $1"
    else
        print_error "File is empty: $1"
        ((ERRORS++))
    fi
}

validate_executable() {
    if [ -x "$1" ]; then
        print_success "File is executable: $1"
    else
        print_error "File is not executable: $1"
        ((ERRORS++))
    fi
}

validate_html() {
    if grep -q "<!DOCTYPE html>" "$1"; then
        print_success "HTML has DOCTYPE"
    else
        print_error "HTML missing DOCTYPE"
        ((ERRORS++))
    fi

    if grep -q "<meta name=\"viewport\"" "$1"; then
        print_success "HTML has viewport meta tag"
    else
        print_error "HTML missing viewport meta tag"
        ((ERRORS++))
    fi
}

validate_css() {
    if grep -q ":root" "$1"; then
        print_success "CSS has root variables"
    else
        print_error "CSS missing root variables"
        ((ERRORS++))
    fi

    if grep -q "@media" "$1"; then
        print_success "CSS has media queries (responsive)"
    else
        print_error "CSS missing media queries"
        ((ERRORS++))
    fi
}

validate_js() {
    if grep -q "addEventListener" "$1"; then
        print_success "JavaScript has event listeners"
    else
        print_error "JavaScript missing event listeners"
        ((ERRORS++))
    fi

    if grep -q "function" "$1"; then
        print_success "JavaScript has functions"
    else
        print_error "JavaScript missing functions"
        ((ERRORS++))
    fi
}

validate_docker() {
    if grep -q "FROM" "$1"; then
        print_success "Dockerfile has FROM instruction"
    else
        print_error "Dockerfile missing FROM instruction"
        ((ERRORS++))
    fi

    if grep -q "EXPOSE" "$1"; then
        print_success "Dockerfile exposes port"
    else
        print_error "Dockerfile missing EXPOSE"
        ((ERRORS++))
    fi
}

validate_k8s() {
    if grep -q "apiVersion:" "$1"; then
        print_success "K8s manifest has apiVersion"
    else
        print_error "K8s manifest missing apiVersion"
        ((ERRORS++))
    fi

    if grep -q "kind:" "$1"; then
        print_success "K8s manifest has kind"
    else
        print_error "K8s manifest missing kind"
        ((ERRORS++))
    fi
}

print_header "GranaCalc - Project Validation"

# Core files
print_header "Validating Core Files"
validate_file_exists "index.html"
validate_file_exists "styles.css"
validate_file_exists "script.js"
validate_file_not_empty "index.html"
validate_file_not_empty "styles.css"
validate_file_not_empty "script.js"

# HTML validation
print_header "Validating HTML"
validate_html "index.html"

# CSS validation
print_header "Validating CSS"
validate_css "styles.css"

# JavaScript validation
print_header "Validating JavaScript"
validate_js "script.js"

# Docker files
print_header "Validating Docker Files"
validate_file_exists "Dockerfile"
validate_file_exists "docker-compose.yml"
validate_file_exists "nginx.conf"
validate_docker "Dockerfile"

# Kubernetes files
print_header "Validating Kubernetes Manifests"
validate_file_exists "k8s/deployment.yaml"
validate_file_exists "k8s/configmap.yaml"
validate_file_exists "k8s/secrets.yaml"
validate_file_exists "k8s/hpa.yaml"
validate_file_exists "k8s/ingress.yaml"
validate_k8s "k8s/deployment.yaml"

# Scripts
print_header "Validating Scripts"
validate_file_exists "deploy.sh"
validate_executable "deploy.sh"

# Configuration files
print_header "Validating Configuration Files"
validate_file_exists ".env"
validate_file_exists ".env.example"
validate_file_exists "package.json"

# Documentation
print_header "Validating Documentation"
validate_file_exists "README.md"
validate_file_exists "QUICKSTART.md"
validate_file_exists "CONTRIBUTING.md"
validate_file_exists "LICENSE"
validate_file_exists "k8s/README.md"

# .gitignore
print_header "Validating Git Files"
validate_file_exists ".gitignore"

# Final summary
print_header "Validation Summary"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║   ✓ ALL VALIDATIONS PASSED! 🎉        ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${GREEN}Project is ready to use!${NC}"
    echo ""
    echo "Quick start:"
    echo "  1. Open directly:    open index.html"
    echo "  2. Docker:           docker-compose up -d"
    echo "  3. Kubernetes:       ./deploy.sh deploy"
    echo ""
    exit 0
else
    echo -e "${RED}"
    echo "╔════════════════════════════════════════╗"
    echo "║   ✗ VALIDATION FAILED                 ║"
    echo "║   Errors found: $ERRORS                   ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${RED}Please fix the errors above before proceeding.${NC}"
    echo ""
    exit 1
fi
