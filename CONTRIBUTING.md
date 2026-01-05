# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o GranaCalc! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportar Bugs

Antes de criar um issue, verifique se o bug já foi reportado.

**Inclua:**
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente (browser, OS, etc.)

### Sugerir Melhorias

Issues para sugestões são bem-vindas!

**Inclua:**
- Descrição detalhada da funcionalidade
- Casos de uso
- Mockups ou exemplos (se possível)

### Pull Requests

1. **Fork o repositório**
   ```bash
   git clone https://github.com/yourusername/grana-calc.git
   cd grana-calc
   ```

2. **Crie uma branch**
   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/meu-bugfix
   ```

3. **Faça suas alterações**
   - Mantenha o código limpo e documentado
   - Siga os padrões de código existentes
   - Adicione comentários quando necessário

4. **Teste suas alterações**
   - Teste em diferentes navegadores
   - Verifique responsividade (mobile/desktop)
   - Valide cálculos financeiros

5. **Commit suas mudanças**
   ```bash
   git add .
   git commit -m "Add: descrição clara da mudança"
   ```

   **Padrões de commit:**
   - `Add:` nova funcionalidade
   - `Fix:` correção de bug
   - `Update:` atualização de funcionalidade existente
   - `Refactor:` refatoração de código
   - `Docs:` documentação
   - `Style:` formatação, espaços em branco
   - `Test:` adição de testes

6. **Push para o GitHub**
   ```bash
   git push origin feature/minha-feature
   ```

7. **Abra um Pull Request**
   - Descreva claramente as mudanças
   - Referencie issues relacionados
   - Aguarde review

## 🎨 Padrões de Código

### HTML
- Use indentação de 4 espaços
- Sempre feche tags
- Use atributos semânticos
- IDs em camelCase, classes em kebab-case

### CSS
- Organize por seções (com comentários)
- Use variáveis CSS (custom properties)
- Mobile-first approach
- BEM naming quando apropriado

```css
/* ========================================
   SECTION NAME
   ======================================== */
.component-name {
    /* Layout */
    display: flex;

    /* Appearance */
    background: var(--primary-color);

    /* Typography */
    font-size: 1rem;
}
```

### JavaScript
- Use ES6+ features
- Const/let ao invés de var
- Arrow functions quando apropriado
- Nomes descritivos para variáveis e funções
- Funções pequenas e focadas
- Comentários para lógica complexa

```javascript
// ========================================
// SECTION NAME
// ========================================

/**
 * Calcula o valor por hora baseado no salário mensal
 * @param {number} monthlySalary - Salário mensal
 * @param {number} hoursPerMonth - Horas trabalhadas por mês
 * @returns {number} Valor por hora
 */
function calculateHourlyRate(monthlySalary, hoursPerMonth) {
    return monthlySalary / hoursPerMonth;
}
```

## 🧪 Testes

Antes de submeter PR, verifique:

### Testes Manuais
- [ ] Formulário valida inputs corretamente
- [ ] Cálculos estão precisos
- [ ] Gráficos renderizam corretamente
- [ ] Mensagens de avaliação corretas
- [ ] Timeline funciona como esperado
- [ ] Responsividade em mobile
- [ ] Responsividade em tablet
- [ ] Compatibilidade com browsers (Chrome, Firefox, Safari, Edge)

### Testes de Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Labels em campos de formulário
- [ ] Contraste de cores adequado
- [ ] Screen reader friendly

### Performance
- [ ] Carregamento rápido
- [ ] Sem memory leaks
- [ ] Gráficos otimizados

## 📁 Estrutura de Arquivos

```
grana-calc/
├── index.html          # Não modifique estrutura base sem discussão
├── styles.css          # Adicione estilos ao final da seção apropriada
├── script.js           # Mantenha organização por seções
├── README.md           # Atualize se adicionar funcionalidades
├── k8s/               # Manifests Kubernetes
├── .env.example       # Adicione novas variáveis aqui
└── deploy.sh          # Scripts de automação
```

## 🏷️ Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Mudanças incompatíveis
- **MINOR** (x.1.x): Nova funcionalidade compatível
- **PATCH** (x.x.1): Bug fixes

## 📝 Documentação

Se sua mudança afeta a forma de usar o GranaCalc:

- Atualize o README.md
- Adicione exemplos se necessário
- Documente novas variáveis de ambiente
- Atualize comentários no código

## 🎯 Prioridades

### Alta Prioridade
- Correções de bugs críticos
- Problemas de segurança
- Cálculos incorretos
- Problemas de acessibilidade

### Média Prioridade
- Novas funcionalidades
- Melhorias de UX
- Performance

### Baixa Prioridade
- Refatorações
- Melhorias de código
- Documentação adicional

## 💬 Comunicação

- **Issues**: Para bugs e sugestões
- **Discussions**: Para perguntas e ideias
- **Pull Requests**: Para código

## ✅ Checklist de PR

Antes de submeter, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Testei em múltiplos navegadores
- [ ] Testei responsividade
- [ ] Não quebrei funcionalidades existentes
- [ ] Comentários adicionados onde necessário
- [ ] README atualizado (se necessário)
- [ ] Commit messages claros
- [ ] Branch está atualizada com main

## 🙏 Agradecimentos

Toda contribuição é valiosa, seja código, documentação, testes ou feedback!

---

💰 Obrigado por contribuir com o GranaCalc!
