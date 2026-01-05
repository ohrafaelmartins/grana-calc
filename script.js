// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    salaryType: 'monthly', // 'monthly' or 'hourly'
    paymentType: 'cash',   // 'cash' or 'installment'
    salary: 0,
    itemValue: 0,
    workDays: 5,
    hoursPerDay: 8,
    installmentValue: 0,
    installmentCount: 0,
    charts: {
        pie: null,
        bar: null
    }
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    // Form inputs
    salary: document.getElementById('salary'),
    salaryLabel: document.getElementById('salaryLabel'),
    itemValue: document.getElementById('itemValue'),
    workDays: document.getElementById('workDays'),
    hoursPerDay: document.getElementById('hoursPerDay'),
    installmentValue: document.getElementById('installmentValue'),
    installmentCount: document.getElementById('installmentCount'),
    installmentFields: document.getElementById('installmentFields'),

    // Buttons
    calculateBtn: document.getElementById('calculateBtn'),
    salaryToggleBtns: document.querySelectorAll('.toggle-group')[0].querySelectorAll('.toggle-btn'),
    paymentToggleBtns: document.querySelectorAll('.toggle-group')[1].querySelectorAll('.toggle-btn'),

    // Results
    resultsSection: document.getElementById('resultsSection'),
    hoursNeeded: document.getElementById('hoursNeeded'),
    daysNeeded: document.getElementById('daysNeeded'),
    weeksNeeded: document.getElementById('weeksNeeded'),
    hourlyRate: document.getElementById('hourlyRate'),
    impactAssessment: document.getElementById('impactAssessment'),
    timeline: document.getElementById('timeline'),
    reflectionMessage: document.getElementById('reflectionMessage'),

    // Charts
    pieChart: document.getElementById('pieChart'),
    barChart: document.getElementById('barChart'),
    pieChartLegend: document.getElementById('pieChartLegend')
};

// ========================================
// EVENT LISTENERS
// ========================================
function initEventListeners() {
    // Salary type toggle
    elements.salaryToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.salaryToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.salaryType = btn.dataset.value;

            // Update label
            elements.salaryLabel.textContent = state.salaryType === 'monthly'
                ? 'Salário Mensal (R$)'
                : 'Valor por Hora (R$)';
        });
    });

    // Payment type toggle
    elements.paymentToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.paymentToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.paymentType = btn.dataset.value;

            // Show/hide installment fields
            if (state.paymentType === 'installment') {
                elements.installmentFields.classList.remove('hidden');
            } else {
                elements.installmentFields.classList.add('hidden');
            }
        });
    });

    // Calculate button
    elements.calculateBtn.addEventListener('click', handleCalculate);

    // Enter key on inputs
    const inputs = [elements.salary, elements.itemValue, elements.workDays,
                   elements.hoursPerDay, elements.installmentValue, elements.installmentCount];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleCalculate();
                }
            });
        }
    });
}

// ========================================
// CALCULATION FUNCTIONS
// ========================================
function validateInputs() {
    const salary = parseFloat(elements.salary.value);
    const itemValue = parseFloat(elements.itemValue.value);
    const workDays = parseInt(elements.workDays.value);
    const hoursPerDay = parseFloat(elements.hoursPerDay.value);

    if (!salary || salary <= 0) {
        alert('Por favor, informe um salário válido.');
        return false;
    }

    if (!itemValue || itemValue <= 0) {
        alert('Por favor, informe um valor válido para o bem/serviço.');
        return false;
    }

    if (!workDays || workDays <= 0 || workDays > 7) {
        alert('Por favor, informe dias de trabalho entre 1 e 7.');
        return false;
    }

    if (!hoursPerDay || hoursPerDay <= 0 || hoursPerDay > 24) {
        alert('Por favor, informe horas por dia entre 1 e 24.');
        return false;
    }

    if (state.paymentType === 'installment') {
        const installmentValue = parseFloat(elements.installmentValue.value);
        const installmentCount = parseInt(elements.installmentCount.value);

        if (!installmentValue || installmentValue <= 0) {
            alert('Por favor, informe um valor válido para a parcela.');
            return false;
        }

        if (!installmentCount || installmentCount <= 0) {
            alert('Por favor, informe um número válido de parcelas.');
            return false;
        }
    }

    return true;
}

function calculateHourlyRate(salary, workDays, hoursPerDay) {
    // Se já for por hora, retorna o próprio valor
    if (state.salaryType === 'hourly') {
        return salary;
    }

    // Calcula horas mensais (considerando ~4.33 semanas por mês)
    const hoursPerWeek = workDays * hoursPerDay;
    const hoursPerMonth = hoursPerWeek * 4.33;

    return salary / hoursPerMonth;
}

function calculateWorkTime(itemValue, hourlyRate, workDays, hoursPerDay) {
    const hoursNeeded = itemValue / hourlyRate;
    const daysNeeded = hoursNeeded / hoursPerDay;
    const weeksNeeded = daysNeeded / workDays;

    return {
        hours: hoursNeeded,
        days: daysNeeded,
        weeks: weeksNeeded
    };
}

function calculateSalaryPercentage(value, salary) {
    // Se for horário, converte para mensal
    let monthlySalary = salary;
    if (state.salaryType === 'hourly') {
        const hoursPerWeek = state.workDays * state.hoursPerDay;
        const hoursPerMonth = hoursPerWeek * 4.33;
        monthlySalary = salary * hoursPerMonth;
    }

    return (value / monthlySalary) * 100;
}

function getImpactAssessment(percentage, isInstallment = false) {
    const assessments = isInstallment ? {
        ranges: [
            { max: 5, class: 'very-safe', icon: '🟢', title: 'Muito segura', message: 'Cabe com folga' },
            { max: 10, class: 'safe', icon: '🟢', title: 'Segura', message: 'Sustentável' },
            { max: 15, class: 'moderate', icon: '🟡', title: 'Moderada', message: 'Exige controle' },
            { max: 20, class: 'risky', icon: '🟠', title: 'Arriscada', message: 'Reduz margem' },
            { max: 30, class: 'imprudent', icon: '🔴', title: 'Imprudente', message: 'Alto risco' },
            { max: Infinity, class: 'very-imprudent', icon: '🔴', title: 'Muito imprudente', message: 'Endividamento provável' }
        ]
    } : {
        ranges: [
            { max: 5, class: 'very-safe', icon: '🟢', title: 'Muito segura', message: 'Impacto irrelevante' },
            { max: 10, class: 'safe', icon: '🟢', title: 'Segura', message: 'Compra tranquila' },
            { max: 20, class: 'moderate', icon: '🟡', title: 'Moderada', message: 'Exige planejamento' },
            { max: 30, class: 'risky', icon: '🟠', title: 'Arriscada', message: 'Avaliar prioridade' },
            { max: 50, class: 'imprudent', icon: '🔴', title: 'Imprudente', message: 'Evite se possível' },
            { max: Infinity, class: 'very-imprudent', icon: '🔴', title: 'Muito imprudente', message: 'Compromete estabilidade' }
        ]
    };

    for (let range of assessments.ranges) {
        if (percentage <= range.max) {
            return range;
        }
    }
}

function getTotalValueAlert(totalPercentage) {
    if (totalPercentage <= 20) {
        return { level: 'Normal', class: 'safe' };
    } else if (totalPercentage <= 30) {
        return { level: 'Atenção', class: 'moderate' };
    } else if (totalPercentage <= 50) {
        return { level: 'Risco', class: 'risky' };
    } else {
        return { level: 'Alto risco', class: 'very-imprudent' };
    }
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================
function displayResults(results) {
    // Update metrics cards
    elements.hoursNeeded.textContent = results.workTime.hours.toFixed(1);
    elements.daysNeeded.textContent = results.workTime.days.toFixed(1);
    elements.weeksNeeded.textContent = results.workTime.weeks.toFixed(1);
    elements.hourlyRate.textContent = `R$ ${results.hourlyRate.toFixed(2)}`;

    // Display impact assessment
    displayImpactAssessment(results);

    // Display charts
    displayCharts(results);

    // Display timeline
    displayTimeline(results);

    // Display reflection message
    displayReflectionMessage(results);

    // Show results section
    elements.resultsSection.classList.remove('hidden');

    // Smooth scroll to results
    setTimeout(() => {
        elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function displayImpactAssessment(results) {
    let html = '';

    if (state.paymentType === 'cash') {
        // À vista assessment
        const assessment = results.impact;
        html += `
            <div class="impact-item ${assessment.class}">
                <div class="impact-icon">${assessment.icon}</div>
                <div class="impact-details">
                    <h4>${assessment.title}</h4>
                    <p>${assessment.message}</p>
                </div>
                <div class="impact-percentage">${results.salaryPercentage.toFixed(1)}%</div>
            </div>
        `;
    } else {
        // Installment assessment
        const installmentAssessment = results.installmentImpact;
        const totalAlert = results.totalValueAlert;

        html += `
            <div class="impact-item ${installmentAssessment.class}">
                <div class="impact-icon">${installmentAssessment.icon}</div>
                <div class="impact-details">
                    <h4>Parcela: ${installmentAssessment.title}</h4>
                    <p>${installmentAssessment.message}</p>
                </div>
                <div class="impact-percentage">${results.installmentPercentage.toFixed(1)}%</div>
            </div>

            <div class="impact-item ${totalAlert.class}">
                <div class="impact-icon">⚠️</div>
                <div class="impact-details">
                    <h4>Valor Total: ${totalAlert.level}</h4>
                    <p>O valor total representa ${results.totalPercentage.toFixed(1)}% do seu salário</p>
                </div>
                <div class="impact-percentage">${results.totalPercentage.toFixed(1)}%</div>
            </div>
        `;
    }

    elements.impactAssessment.innerHTML = html;
}

function displayCharts(results) {
    // Destroy existing charts
    if (state.charts.pie) state.charts.pie.destroy();
    if (state.charts.bar) state.charts.bar.destroy();

    // Pie Chart - Salary Percentage
    const percentageUsed = state.paymentType === 'cash'
        ? results.salaryPercentage
        : results.installmentPercentage;
    const percentageRemaining = 100 - percentageUsed;

    const pieCtx = elements.pieChart.getContext('2d');
    state.charts.pie = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Comprometido', 'Disponível'],
            datasets: [{
                data: [percentageUsed, percentageRemaining],
                backgroundColor: [
                    'rgba(0, 168, 107, 0.9)',
                    'rgba(232, 245, 233, 0.9)'
                ],
                borderColor: [
                    'rgba(0, 168, 107, 1)',
                    'rgba(0, 199, 129, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });

    // Update legend
    elements.pieChartLegend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(0, 168, 107, 0.9);"></div>
            <span>Comprometido: ${percentageUsed.toFixed(1)}%</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(232, 245, 233, 0.9);"></div>
            <span>Disponível: ${percentageRemaining.toFixed(1)}%</span>
        </div>
    `;

    // Bar Chart - Progress
    const barCtx = elements.barChart.getContext('2d');
    const targetValue = state.paymentType === 'cash'
        ? results.itemValue
        : results.totalValue;

    state.charts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Objetivo'],
            datasets: [{
                label: 'Valor necessário (R$)',
                data: [targetValue],
                backgroundColor: 'rgba(0, 168, 107, 0.9)',
                borderColor: 'rgba(0, 168, 107, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            }
        }
    });
}

function displayTimeline(results) {
    const weeks = Math.ceil(results.workTime.weeks);
    let html = '';

    // Show up to 8 weeks in timeline
    const displayWeeks = Math.min(weeks, 8);

    for (let i = 1; i <= displayWeeks; i++) {
        const isCompleted = false; // User hasn't started yet
        const isCurrent = i === 1;
        const dotClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');

        html += `
            <div class="timeline-item">
                <div class="timeline-dot ${dotClass}">${i}</div>
                <div class="timeline-label">Semana ${i}</div>
            </div>
        `;
    }

    if (weeks > 8) {
        html += `
            <div class="timeline-item">
                <div class="timeline-dot">...</div>
                <div class="timeline-label">${weeks} semanas</div>
            </div>
        `;
    }

    elements.timeline.innerHTML = html;
}

function displayReflectionMessage(results) {
    const days = Math.ceil(results.workTime.days);
    const weeks = Math.ceil(results.workTime.weeks);
    const hours = Math.ceil(results.workTime.hours);

    let message = '';

    if (state.paymentType === 'cash') {
        if (results.salaryPercentage <= 10) {
            message = `Excelente escolha! Este item representa apenas ${hours} horas do seu trabalho (aproximadamente ${days} ${days === 1 ? 'dia' : 'dias'}). Uma compra consciente e sustentável.`;
        } else if (results.salaryPercentage <= 20) {
            message = `Compra moderada. Você precisará trabalhar ${days} ${days === 1 ? 'dia' : 'dias'} (${hours} horas) para adquirir este item. Certifique-se de que está alinhado com suas prioridades.`;
        } else if (results.salaryPercentage <= 30) {
            message = `Atenção! Este item consome ${weeks} ${weeks === 1 ? 'semana' : 'semanas'} do seu trabalho (${days} dias, ${hours} horas). Avalie se realmente compensa este investimento de tempo.`;
        } else {
            message = `Cuidado! Você precisará trabalhar ${weeks} ${weeks === 1 ? 'semana' : 'semanas'} (${days} dias) para pagar este item. Isso representa uma parcela significativa do seu esforço. Considere alternativas ou economia prévia.`;
        }
    } else {
        const monthsPayment = results.installmentCount;
        message = `Você assumirá um compromisso de ${monthsPayment} ${monthsPayment === 1 ? 'mês' : 'meses'}, com parcelas de R$ ${results.installmentValue.toFixed(2)}. `;

        if (results.installmentPercentage <= 10) {
            message += `A parcela é sustentável e cabe no seu orçamento mensal.`;
        } else if (results.installmentPercentage <= 15) {
            message += `Exigirá controle financeiro, mas é gerenciável.`;
        } else {
            message += `As parcelas reduzirão significativamente sua margem mensal. Avalie se consegue manter este compromisso.`;
        }

        message += ` O valor total (R$ ${results.totalValue.toFixed(2)}) equivale a ${weeks} ${weeks === 1 ? 'semana' : 'semanas'} de trabalho.`;
    }

    elements.reflectionMessage.textContent = message;
}

// ========================================
// MAIN CALCULATION HANDLER
// ========================================
function handleCalculate() {
    if (!validateInputs()) return;

    // Get input values
    const salary = parseFloat(elements.salary.value);
    const itemValue = parseFloat(elements.itemValue.value);
    const workDays = parseInt(elements.workDays.value);
    const hoursPerDay = parseFloat(elements.hoursPerDay.value);

    // Update state
    state.salary = salary;
    state.itemValue = itemValue;
    state.workDays = workDays;
    state.hoursPerDay = hoursPerDay;

    // Calculate hourly rate
    const hourlyRate = calculateHourlyRate(salary, workDays, hoursPerDay);

    // Prepare results object
    const results = {
        salary,
        itemValue,
        hourlyRate,
        workTime: null,
        salaryPercentage: 0,
        impact: null
    };

    if (state.paymentType === 'cash') {
        // À vista calculation
        results.workTime = calculateWorkTime(itemValue, hourlyRate, workDays, hoursPerDay);
        results.salaryPercentage = calculateSalaryPercentage(itemValue, salary);
        results.impact = getImpactAssessment(results.salaryPercentage, false);
    } else {
        // Installment calculation
        const installmentValue = parseFloat(elements.installmentValue.value);
        const installmentCount = parseInt(elements.installmentCount.value);
        const totalValue = installmentValue * installmentCount;

        state.installmentValue = installmentValue;
        state.installmentCount = installmentCount;

        results.installmentValue = installmentValue;
        results.installmentCount = installmentCount;
        results.totalValue = totalValue;
        results.itemValue = totalValue; // For timeline calculation

        // Calculate based on total value for work time
        results.workTime = calculateWorkTime(totalValue, hourlyRate, workDays, hoursPerDay);

        // Calculate percentages
        results.installmentPercentage = calculateSalaryPercentage(installmentValue, salary);
        results.totalPercentage = calculateSalaryPercentage(totalValue, salary);

        // Get assessments
        results.installmentImpact = getImpactAssessment(results.installmentPercentage, true);
        results.totalValueAlert = getTotalValueAlert(results.totalPercentage);
    }

    // Display results
    displayResults(results);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    console.log('GranaCalc initialized successfully! 💰');
});
