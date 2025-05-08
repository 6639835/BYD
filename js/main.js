// Scroll function
function scrollToSection(selector) {
    const section = document.querySelector(selector);
    if (section) {
        window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Debounce function to limit how often a function is called
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Update nav dots on scroll - using debounce for better performance
const handleScroll = debounce(function() {
    const heroSection = document.querySelector('.hero-section');
    const dashboard = document.querySelector('.dashboard');
    const detailSection = document.querySelector('.detail-section');
    const compareSection = document.querySelector('.compare-section');
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    
    // Reset all nav dots
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Set active dot based on scroll position
    if (scrollPosition < dashboard.offsetTop) {
        document.getElementById('nav-hero').classList.add('active');
    } else if (scrollPosition < detailSection.offsetTop) {
        document.getElementById('nav-dashboard').classList.add('active');
    } else if (scrollPosition < compareSection.offsetTop) {
        document.getElementById('nav-detail').classList.add('active');
    } else {
        document.getElementById('nav-compare').classList.add('active');
    }

    // Parallax effect
    if (heroSection) {
        heroSection.style.backgroundPosition = `50% ${window.pageYOffset * 0.5}px`;
    }
}, 10);

window.addEventListener('scroll', handleScroll);
// Call once on load to set initial state
window.addEventListener('load', handleScroll);

// 数据
const allPeriodsData = {
    "2024-Q1": {
        models: [
            '秦PLUS DM-i', '宋PLUS DM-i', '元PLUS', '海豚', 
            '汉EV', '唐DM-i', '海豹DM-i', '宋Pro DM-i', 
            '驱逐舰05', '元UP'
        ],
        sales: [108000, 92000, 80000, 75000, 62000, 55000, 50000, 45000, 40000, 35000],
        monthlyTrend: {
            '1月': [38000, 31000, 26000, 25000, 21000, 18000, 16000, 15000, 13000, 12000],
            '2月': [32000, 28000, 24000, 23000, 19000, 17000, 15000, 14000, 12000, 11000],
            '3月': [38000, 33000, 30000, 27000, 22000, 20000, 19000, 16000, 15000, 12000]
        },
        types: {
            'DM-i混动': 335000,
            'EV纯电': 215000,
            '燃油车': 70000
        },
        modelTypes: {
            '秦PLUS DM-i': 'DM-i混动',
            '宋PLUS DM-i': 'DM-i混动',
            '元PLUS': 'EV纯电',
            '海豚': 'EV纯电',
            '汉EV': 'EV纯电',
            '唐DM-i': 'DM-i混动',
            '海豹DM-i': 'DM-i混动',
            '宋Pro DM-i': 'DM-i混动',
            '驱逐舰05': 'EV纯电',
            '元UP': '燃油车'
        },
        yearOnYear: {
            '秦PLUS DM-i': '+15.2%',
            '宋PLUS DM-i': '+12.8%',
            '元PLUS': '+18.5%',
            '海豚': '+22.3%',
            '汉EV': '+8.7%',
            '唐DM-i': '+10.5%',
            '海豹DM-i': '+25.1%',
            '宋Pro DM-i': '+9.8%',
            '驱逐舰05': '新上市',
            '元UP': '-5.2%'
        },
        monthOnMonth: {
            '秦PLUS DM-i': '+5.1%',
            '宋PLUS DM-i': '+3.8%',
            '元PLUS': '+7.2%',
            '海豚': '+8.5%',
            '汉EV': '+2.1%',
            '唐DM-i': '+1.7%',
            '海豹DM-i': '+12.3%',
            '宋Pro DM-i': '+0.5%',
            '驱逐舰05': '+18.7%',
            '元UP': '-1.8%'
        }
    },
    "2023-Q4": {
        models: [
            '秦PLUS DM-i', '宋PLUS DM-i', '元PLUS', '海豚', 
            '汉EV', '唐DM-i', '海豹', '宋Pro DM-i', 
            '秦L', '元UP'
        ],
        sales: [102000, 89000, 75000, 69000, 60000, 53000, 47000, 44000, 38000, 36000],
        monthlyTrend: {
            '10月': [35000, 30000, 25000, 23000, 20000, 18000, 15000, 15000, 12000, 12000],
            '11月': [33000, 29000, 24000, 22000, 20000, 17000, 16000, 14000, 13000, 12000],
            '12月': [34000, 30000, 26000, 24000, 20000, 18000, 16000, 15000, 13000, 12000]
        },
        types: {
            'DM-i混动': 320000,
            'EV纯电': 195000,
            '燃油车': 76000
        },
        modelTypes: {
            '秦PLUS DM-i': 'DM-i混动',
            '宋PLUS DM-i': 'DM-i混动',
            '元PLUS': 'EV纯电',
            '海豚': 'EV纯电',
            '汉EV': 'EV纯电',
            '唐DM-i': 'DM-i混动',
            '海豹': 'EV纯电',
            '宋Pro DM-i': 'DM-i混动',
            '秦L': 'DM-i混动',
            '元UP': '燃油车'
        },
        yearOnYear: {
            '秦PLUS DM-i': '+12.1%',
            '宋PLUS DM-i': '+10.5%',
            '元PLUS': '+15.8%',
            '海豚': '+18.7%',
            '汉EV': '+7.2%',
            '唐DM-i': '+9.3%',
            '海豹': '+22.4%',
            '宋Pro DM-i': '+8.1%',
            '秦L': '+11.2%',
            '元UP': '-3.8%'
        },
        monthOnMonth: {
            '秦PLUS DM-i': '+3.8%',
            '宋PLUS DM-i': '+2.5%',
            '元PLUS': '+5.8%',
            '海豚': '+7.2%',
            '汉EV': '+1.5%',
            '唐DM-i': '+0.9%',
            '海豹': '+10.1%',
            '宋Pro DM-i': '-0.8%',
            '秦L': '+5.3%',
            '元UP': '-2.2%'
        }
    },
    "2023-Q3": {
        models: [
            '秦PLUS DM-i', '宋PLUS DM-i', '元PLUS', '海豚', 
            '汉EV', '唐DM-i', '海豹', '秦L', 
            '宋Pro DM-i', '元UP'
        ],
        sales: [98000, 85000, 72000, 65000, 58000, 50000, 45000, 42000, 40000, 37000],
        monthlyTrend: {
            '7月': [32000, 27000, 24000, 21000, 19000, 16000, 15000, 14000, 13000, 12000],
            '8月': [33000, 28000, 24000, 22000, 19000, 17000, 15000, 14000, 13000, 12000],
            '9月': [33000, 30000, 24000, 22000, 20000, 17000, 15000, 14000, 14000, 13000]
        },
        types: {
            'DM-i混动': 310000,
            'EV纯电': 180000,
            '燃油车': 79000
        },
        modelTypes: {
            '秦PLUS DM-i': 'DM-i混动',
            '宋PLUS DM-i': 'DM-i混动',
            '元PLUS': 'EV纯电',
            '海豚': 'EV纯电',
            '汉EV': 'EV纯电',
            '唐DM-i': 'DM-i混动',
            '海豹': 'EV纯电',
            '秦L': 'DM-i混动',
            '宋Pro DM-i': 'DM-i混动',
            '元UP': '燃油车'
        },
        yearOnYear: {
            '秦PLUS DM-i': '+10.8%',
            '宋PLUS DM-i': '+9.2%',
            '元PLUS': '+14.1%',
            '海豚': '+16.5%',
            '汉EV': '+6.8%',
            '唐DM-i': '+8.5%',
            '海豹': '+20.3%',
            '秦L': '+10.5%',
            '宋Pro DM-i': '+7.3%',
            '元UP': '-2.1%'
        },
        monthOnMonth: {
            '秦PLUS DM-i': '+2.5%',
            '宋PLUS DM-i': '+1.8%',
            '元PLUS': '+4.2%',
            '海豚': '+5.8%',
            '汉EV': '+1.2%',
            '唐DM-i': '+0.5%',
            '海豹': '+8.7%',
            '秦L': '+4.2%',
            '宋Pro DM-i': '-1.2%',
            '元UP': '-1.5%'
        }
    },
    "2023-Q2": {
        models: [
            '秦PLUS DM-i', '宋PLUS DM-i', '元PLUS', '汉EV', 
            '海豚', '唐DM-i', '秦L', '宋Pro DM-i', 
            '元UP', '海豹'
        ],
        sales: [95000, 82000, 70000, 56000, 62000, 48000, 40000, 38000, 38000, 42000],
        monthlyTrend: {
            '4月': [31000, 27000, 23000, 18000, 20000, 16000, 13000, 12000, 13000, 14000],
            '5月': [32000, 27000, 23000, 19000, 21000, 16000, 13000, 13000, 12000, 14000],
            '6月': [32000, 28000, 24000, 19000, 21000, 16000, 14000, 13000, 13000, 14000]
        },
        types: {
            'DM-i混动': 298000,
            'EV纯电': 172000,
            '燃油车': 81000
        },
        modelTypes: {
            '秦PLUS DM-i': 'DM-i混动',
            '宋PLUS DM-i': 'DM-i混动',
            '元PLUS': 'EV纯电',
            '汉EV': 'EV纯电',
            '海豚': 'EV纯电',
            '唐DM-i': 'DM-i混动',
            '秦L': 'DM-i混动',
            '宋Pro DM-i': 'DM-i混动',
            '元UP': '燃油车',
            '海豹': 'EV纯电'
        },
        yearOnYear: {
            '秦PLUS DM-i': '+9.5%',
            '宋PLUS DM-i': '+8.3%',
            '元PLUS': '+12.7%',
            '汉EV': '+6.2%',
            '海豚': '+15.3%',
            '唐DM-i': '+7.8%',
            '秦L': '+9.8%',
            '宋Pro DM-i': '+6.5%',
            '元UP': '-0.8%',
            '海豹': '+18.2%'
        },
        monthOnMonth: {
            '秦PLUS DM-i': '+1.8%',
            '宋PLUS DM-i': '+1.5%',
            '元PLUS': '+3.5%',
            '汉EV': '+0.8%',
            '海豚': '+4.7%',
            '唐DM-i': '+0.2%',
            '秦L': '+3.5%',
            '宋Pro DM-i': '-0.5%',
            '元UP': '-1.0%',
            '海豹': '+7.2%'
        }
    }
};

// 默认数据周期
let currentPeriod = "2024-Q1";
// 获取当前周期的销售数据
let salesData = allPeriodsData[currentPeriod];

// 计算总销量和混动占比
const totalSales = salesData.sales.reduce((a, b) => a + b, 0);
const hybridSales = salesData.sales.reduce((total, sales, index) => {
    return salesData.modelTypes[salesData.models[index]] === 'DM-i混动' ? total + sales : total;
}, 0);
const hybridPercent = (hybridSales / totalSales * 100).toFixed(1);

// 配置echarts主题
const themes = {
    color: ['#00e676', '#2979ff', '#ff4081', '#ffc400', '#00b0ff',
            '#4caf50', '#f44336', '#9c27b0', '#ff6d00', '#42a5f5'],
    backgroundColor: 'transparent',
    textStyle: {
        color: '#fff'
    },
    title: {
        textStyle: {
            color: '#fff'
        }
    },
    line: {
        itemStyle: {
            borderWidth: 1
        },
        lineStyle: {
            width: 2
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: true
    },
    radar: {
        itemStyle: {
            borderWidth: 1
        },
        lineStyle: {
            width: 2
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: true
    },
    bar: {
        itemStyle: {
            barBorderWidth: 0,
            barBorderColor: '#ccc'
        }
    },
    pie: {
        itemStyle: {
            borderWidth: 0,
            borderColor: '#ccc'
        }
    },
    gauge: {
        itemStyle: {
            borderWidth: 0,
            borderColor: '#ccc'
        }
    }
};

// Create chart instances
window.chartInstances = {
    mainChart: echarts.init(document.getElementById('main-chart')),
    pieChart: echarts.init(document.getElementById('pie-chart')),
    trendChart: echarts.init(document.getElementById('trend-chart')),
    comparisonChart: echarts.init(document.getElementById('comparison-chart')),
    trendComparisonChart: echarts.init(document.getElementById('trend-comparison-chart')),
    chartjsComparison: null, // Will be initialized later
    chartjsRadar: null       // Will be initialized later
};

// 初始化图表和引用对象
let charts = {};

// 初始化各图表
function initCharts() {
    // Create main bar chart
    const mainChart = echarts.init(document.getElementById('main-chart'));
    
    const mainOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return `${params[0].name}: ${params[0].value.toLocaleString()} 辆`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: [],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12
            }
        },
        series: [{
            name: '销量',
            type: 'bar',
            data: [],
            barWidth: '60%',
            barGap: '-100%',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#00a854' },
                    { offset: 1, color: '#1976d2' }
                ]),
                borderRadius: [0, 4, 4, 0]
            },
            label: {
                show: true,
                position: 'right',
                color: 'rgba(255, 255, 255, 0.7)',
                formatter: function(params) {
                    return params.value.toLocaleString();
                }
            },
            z: 2
        },
        {
            name: '背景',
            type: 'bar',
            data: [],
            barWidth: '60%',
            barGap: '-100%',
            itemStyle: {
                color: 'rgba(255, 255, 255, 0.03)',
                borderRadius: [0, 4, 4, 0]
            },
            z: 1
        }]
    };
    
    mainChart.setOption(mainOption);
    
    // Create pie chart
    const pieChart = echarts.init(document.getElementById('pie-chart'));
    
    const pieOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        series: [{
            name: '销量类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderColor: 'rgba(25, 32, 65, 0.7)',
                borderWidth: 2
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            labelLine: {
                show: false
            },
            data: []
        }]
    };
    
    pieChart.setOption(pieOption);
    
    // Create trend chart
    const trendChart = echarts.init(document.getElementById('trend-chart'));
    
    const trendOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: [],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            top: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                formatter: function(value) {
                    return value / 1000 + 'k';
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: []
    };
    
    trendChart.setOption(trendOption);
    
    // Responsive resize
    window.addEventListener('resize', function() {
        mainChart.resize();
        pieChart.resize();
        trendChart.resize();
    });
    
    // Initialize comparison charts
    const comparisonChart = echarts.init(document.getElementById('comparison-chart'));
    const trendComparisonChart = echarts.init(document.getElementById('trend-comparison-chart'));
    
    // Initial chart update with default data
    updateAllCharts("2024-Q1");
    
    // Store chart instances for future reference
    window.chartInstances = {
        mainChart,
        pieChart,
        trendChart,
        comparisonChart,
        trendComparisonChart
    };
}

// Update all charts with period data
function updateAllCharts(period) {
    const { mainChart, pieChart, trendChart } = window.chartInstances;
    const periodData = allPeriodsData[period];
    
    if (!periodData) return;
    
    // Update main chart
    const mainOption = mainChart.getOption();
    mainOption.yAxis[0].data = periodData.models;
    mainOption.series[0].data = periodData.sales;
    
    // Add background bars with same value
    const backgroundData = periodData.sales.map(() => 120000);
    mainOption.series[1].data = backgroundData;
    
    mainChart.setOption(mainOption, true);
    
    // Update pie chart
    const pieOption = pieChart.getOption();
    const pieData = Object.entries(periodData.types).map(([name, value]) => {
        return {
            name,
            value
        };
    });
    
    pieOption.series[0].data = pieData;
    pieOption.series[0].itemStyle.borderColor = 'rgba(25, 32, 65, 0.7)';
    
    // Set distinct colors for pie chart segments
    pieOption.series[0].data[0].itemStyle = {
        color: '#00a854'
    };
    pieOption.series[0].data[1].itemStyle = {
        color: '#1976d2'
    };
    pieOption.series[0].data[2].itemStyle = {
        color: '#ff4081'
    };
    
    pieChart.setOption(pieOption, true);
    
    // Update trend chart
    const trendOption = trendChart.getOption();
    const months = Object.keys(periodData.monthlyTrend);
    const series = [];
    
    // Get top 5 models for trend chart
    const top5Models = periodData.models.slice(0, 5);
    
    trendOption.legend.data = top5Models;
    trendOption.xAxis.data = months;
    trendOption.series = top5Models.map((model, index) => {
        const monthlyData = months.map(month => periodData.monthlyTrend[month][index]);
        
        return {
            name: model,
            type: 'line',
            data: monthlyData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                width: 3
            },
            areaStyle: {
                opacity: 0.1
            }
        };
    });
    
    // Set distinct colors for trend lines
    const colors = ['#00e676', '#2979ff', '#ff4081', '#ffab00', '#00b0ff'];
    trendOption.color = colors;
    
    trendChart.setOption(trendOption, true);
    
    // Update comparison charts if they exist
    updateComparisonChart();
    
    // Update Chart.js charts if they exist
    if (window.chartInstances.chartjsComparison) {
        setupChartJsBarChart();
    }
    
    if (window.chartInstances.chartjsRadar) {
        setupChartJsRadarChart();
    }
}

// Refresh individual chart
function refreshChart(chartId) {
    // Special handling for Chart.js charts
    if (chartId === 'chartjs-comparison') {
        refreshChartJs('bar');
        return;
    } else if (chartId === 'chartjs-radar') {
        refreshChartJs('radar');
        return;
    }

    // Handle ECharts instances
    const chart = echarts.getInstanceByDom(document.getElementById(chartId));
    if (chart) {
        chart.clear();
        
        const activePeriod = document.querySelector('.period-option.active').getAttribute('data-period');
        updateAllCharts(activePeriod);
        
        // Add animation effect
        const chartElement = document.getElementById(chartId);
        chartElement.style.animation = 'fadeIn 0.5s';
        setTimeout(() => {
            chartElement.style.animation = '';
        }, 500);
    }
}

// Main initialization function
function initApp() {
    // Only initialize if DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }
}

// Initialize all components
function initializeComponents() {
    initPageLoader();
    initParticles();
    initPeriodSelector();
    initScrollAnimations();
    initScrollSpy();
    // Initialize chart instances first
    initChartInstances();
    // Then setup charts
    setupComparisonCharts();
    setupChartJsComparison();
    initDetailTable();
    bindFilterEvents();
    updateAllCharts('2024-Q1');
    
    // Add window resize handler for all charts
    window.addEventListener('resize', function() {
        // Resize ECharts instances
        Object.keys(window.chartInstances).forEach(key => {
            const chart = window.chartInstances[key];
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    });
    
    // Remove loader after everything is initialized
    setTimeout(() => {
        document.getElementById('page-loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('page-loader').style.display = 'none';
        }, 500);
    }, 800);
}

// Start app
initApp();

// Page loader
function initPageLoader() {
    window.addEventListener('load', function() {
        const loader = document.getElementById('page-loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 1000);
    });
}

// Initialize particles background
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: {
                type: "circle",
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 5 }
            },
            opacity: {
                value: 0.2,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00a854",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.3 } },
                bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
    });
}

// Initialize period selector
function initPeriodSelector() {
    const periodOptions = document.querySelectorAll('.period-option');
    let currentPeriod = "2024-Q1";
    
    periodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            periodOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get selected period
            const period = this.getAttribute('data-period');
            currentPeriod = period;
            
            // Update page title
            updatePageTitle(period);
            
            // Update all charts with the new period data
            updateAllCharts(period);
            
            // Update KPIs
            updateKPIs(period);
            
            // Update detail table
            filterTable();
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    // Use Intersection Observer API for better performance
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('animated');
                    
                    // Use data attributes for animation if present
                    const animation = el.dataset.animation || 'fadeInUp';
                    const delay = el.dataset.delay || 0;
                    
                    el.style.animationDelay = `${delay}s`;
                    el.style.animationName = animation;
                    
                    // Stop observing after animation is triggered
                    animationObserver.unobserve(el);
                }
            });
        }, {
            root: null,
            threshold: 0.2,
            rootMargin: '-20% 0px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animated');
        });
    }
}

// Initialize scroll spy for navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset + window.innerHeight / 3;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navDots.forEach(dot => dot.classList.remove('active'));
                navDots[index].classList.add('active');
            }
        });
    });
}

// Initialize comparison charts
function setupComparisonCharts() {
    const comparisonChart = window.chartInstances.comparisonChart;
    const trendComparisonChart = window.chartInstances.trendComparisonChart;
    
    // Bar comparison chart
    const comparisonOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            top: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['总销量'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                formatter: function(value) {
                    return value / 1000 + 'k';
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: []
    };
    
    comparisonChart.setOption(comparisonOption);
    
    // Trend comparison chart
    const trendComparisonOption = trendComparisonChart.getOption();
    const months = Object.keys(allPeriodsData["2024-Q1"].monthlyTrend);
    
    trendComparisonOption.legend.data = months;
    trendComparisonOption.xAxis.data = months;
    trendComparisonOption.color = ['#00e676', '#2979ff', '#ff4081', '#ffab00', '#00b0ff'];
    
    trendComparisonOption.series = months.map((month, index) => {
        const data = [];
        const periods = Object.keys(allPeriodsData);
        
        periods.forEach((period, periodIndex) => {
            const modelIndex = allPeriodsData[period].models.indexOf(allPeriodsData["2024-Q1"].models[index]);
            const sales = modelIndex !== -1 ? allPeriodsData[period].sales[modelIndex] : 0;
            data.push(sales);
        });
        
        return {
            name: month,
            type: 'line',
            data: data,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                width: 3
            },
            areaStyle: {
                opacity: 0.1
            }
        };
    });
    
    trendComparisonChart.setOption(trendComparisonOption);
    
    // Responsive resize
    window.addEventListener('resize', function() {
        comparisonChart.resize();
        trendComparisonChart.resize();
    });
    
    // Initial update
    updateComparisonChart();
}

// Update comparison charts
function updateComparisonChart() {
    const { comparisonChart, trendComparisonChart } = window.chartInstances;
    const activePeriod = document.querySelector('.period-option.active').getAttribute('data-period');
    const periodData = allPeriodsData[activePeriod];
    
    if (!periodData) return;
    
    // Get selected models
    const model1 = document.getElementById('model-select-1').value;
    const model2 = document.getElementById('model-select-2').value;
    const model3 = document.getElementById('model-select-3').value;
    
    const selectedModels = [model1, model2, model3];
    
    // Update bar comparison chart
    const comparisonOption = comparisonChart.getOption();
    
    comparisonOption.legend.data = selectedModels;
    comparisonOption.series = selectedModels.map((model, index) => {
        const modelIndex = periodData.models.indexOf(model);
        const sales = modelIndex !== -1 ? periodData.sales[modelIndex] : 0;
        
        return {
            name: model,
            type: 'bar',
            barGap: 0,
            data: [sales],
            itemStyle: {
                borderRadius: [4, 4, 0, 0]
            },
            label: {
                show: true,
                position: 'top',
                color: 'rgba(255, 255, 255, 0.7)',
                formatter: function(params) {
                    return params.value.toLocaleString();
                }
            }
        };
    });
    
    // Set distinct colors for comparison chart bars
    const colors = ['#00e676', '#2979ff', '#ff4081', '#ffab00', '#00b0ff'];
    comparisonOption.color = colors;
    
    comparisonChart.setOption(comparisonOption, true);
    
    // Update trend comparison chart
    const trendComparisonOption = trendComparisonChart.getOption();
    const months = Object.keys(periodData.monthlyTrend);
    
    trendComparisonOption.legend.data = selectedModels;
    trendComparisonOption.xAxis.data = months;
    trendComparisonOption.color = colors;
    
    trendComparisonOption.series = selectedModels.map((model, index) => {
        const modelIndex = periodData.models.indexOf(model);
        const monthlyData = modelIndex !== -1 
            ? months.map(month => periodData.monthlyTrend[month][modelIndex])
            : months.map(() => 0);
        
        return {
            name: model,
            type: 'line',
            data: monthlyData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                width: 3
            },
            areaStyle: {
                opacity: 0.1
            }
        };
    });
    
    trendComparisonChart.setOption(trendComparisonOption, true);
}

// Initialize data table
function initDetailTable() {
    // Initial table population
    filterTable();
    
    // Bind search and filter events
    bindFilterEvents();
}

// Table search and filtering
function filterTable() {
    const searchTerm = document.getElementById('model-search').value.toLowerCase();
    const filterType = document.getElementById('type-filter').value;
    const tableBody = document.getElementById('table-body');
    const activePeriod = document.querySelector('.period-option.active').getAttribute('data-period');
    const periodData = allPeriodsData[activePeriod];
    
    if (!periodData) return;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Filter and sort data
    const tableData = periodData.models.map((model, index) => {
        return {
            rank: index + 1,
            model: model,
            type: periodData.modelTypes[model],
            sales: periodData.sales[index],
            yearOnYear: periodData.yearOnYear[model],
            monthOnMonth: periodData.monthOnMonth[model]
        };
    }).filter(item => {
        // Apply search filter
        const matchesSearch = item.model.toLowerCase().includes(searchTerm);
        
        // Apply type filter
        const matchesType = filterType === 'all' || 
            (filterType === 'dm-i' && item.type === 'DM-i混动') ||
            (filterType === 'ev' && item.type === 'EV纯电') ||
            (filterType === 'ice' && item.type === '燃油车');
            
        return matchesSearch && matchesType;
    });
    
    // Store filtered rows for pagination
    window.filteredRows = tableData;
    
    // Initialize pagination
    window.currentPage = 1;
    window.rowsPerPage = 10;
    
    // Display first page
    displayTablePage();
}

// Display current page of table data
function displayTablePage() {
    const tableBody = document.getElementById('table-body');
    const filteredRows = window.filteredRows || [];
    const currentPage = window.currentPage || 1;
    const rowsPerPage = window.rowsPerPage || 10;
    
    // Calculate page bounds
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleRows = filteredRows.slice(startIndex, endIndex);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows for current page
    visibleRows.forEach(item => {
        const row = document.createElement('tr');
        
        // Apply styling for different types
        let typeClass = '';
        if (item.type === 'DM-i混动') typeClass = 'hybrid';
        else if (item.type === 'EV纯电') typeClass = 'electric';
        else if (item.type === '燃油车') typeClass = 'gasoline';
        
        // Create year-on-year and month-on-month change elements with proper styling
        const yoyChange = item.yearOnYear.startsWith('+') 
            ? `<span class="positive">${item.yearOnYear}</span>` 
            : (item.yearOnYear === '新上市' 
                ? `<span>${item.yearOnYear}</span>` 
                : `<span class="negative">${item.yearOnYear}</span>`);
                
        const momChange = item.monthOnMonth.startsWith('+') 
            ? `<span class="positive">${item.monthOnMonth}</span>` 
            : `<span class="negative">${item.monthOnMonth}</span>`;
        
        // Populate row
        row.innerHTML = `
            <td>${item.rank}</td>
            <td>${item.model}</td>
            <td class="${typeClass}">${item.type}</td>
            <td>${item.sales.toLocaleString()}</td>
            <td>${yoyChange}</td>
            <td>${momChange}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update pagination display
    updatePageDisplay(filteredRows.length, visibleRows.length);
}

// Bind filter and search events
function bindFilterEvents() {
    const searchInput = document.getElementById('model-search');
    const typeFilter = document.getElementById('type-filter');
    
    // Add input event for search box
    searchInput.addEventListener('input', filterTable);
    
    // Add change event for type filter
    typeFilter.addEventListener('change', filterTable);
}

// Change page in pagination
function changePage(direction) {
    const currentPage = window.currentPage || 1;
    const filteredRows = window.filteredRows || [];
    const rowsPerPage = window.rowsPerPage || 10;
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    
    // Calculate new page
    let newPage = currentPage + direction;
    
    // Boundary check
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    
    // Update current page
    window.currentPage = newPage;
    
    // Update table display
    displayTablePage();
}

// Update page indicator
function updatePageDisplay(totalRows, visibleRows) {
    const pageIndicator = document.querySelector('.page-indicator');
    const currentPage = window.currentPage || 1;
    const rowsPerPage = window.rowsPerPage || 10;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    
    pageIndicator.textContent = `${currentPage} / ${totalPages > 0 ? totalPages : 1}`;
}

// Export data function
function exportData(format) {
    const activePeriod = document.querySelector('.period-option.active').getAttribute('data-period');
    const periodName = activePeriod === '2024-Q1' ? '2024年第一季度' : 
                       activePeriod === '2023-Q4' ? '2023年第四季度' : 
                       activePeriod === '2023-Q3' ? '2023年第三季度' : '2023年第二季度';
                       
    // Show alert for demo purposes
    alert(`导出${periodName}数据为${format === 'excel' ? 'Excel' : 'PDF'}格式`);
    
    // In a real implementation, this would generate and download the file
}

// Update page title based on selected period
function updatePageTitle(period) {
    const periodName = period === '2024-Q1' ? '2024年第一季度' : 
                      period === '2023-Q4' ? '2023年第四季度' : 
                      period === '2023-Q3' ? '2023年第三季度' : '2023年第二季度';
                      
    document.title = `比亚迪汽车 - ${periodName}销量数据分析`;
}

// Update KPIs with period data
function updateKPIs(period = '2024-Q1') {
    const periodData = allPeriodsData[period];
    
    if (!periodData) return;
    
    // Calculate total sales
    const totalSales = periodData.sales.reduce((sum, sales) => sum + sales, 0);
    
    // Calculate hybrid percentage
    const hybridSales = periodData.types['DM-i混动'] || 0;
    const hybridPercent = Math.round((hybridSales / totalSales) * 100);
    
    // Update KPI displays with CountUp animation
    const totalSalesEl = document.getElementById('total-sales');
    const hybridPercentEl = document.getElementById('hybrid-percent');
    
    // Use CountUp for smooth animations
    const totalSalesCounter = new CountUp('total-sales', 0, totalSales, 0, 2, {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.'
    });
    
    const hybridPercentCounter = new CountUp('hybrid-percent', 0, hybridPercent, 0, 1.5, {
        useEasing: true,
        useGrouping: true,
        suffix: '%'
    });
    
    // Start animations
    if (!totalSalesCounter.error) {
        totalSalesCounter.start();
    } else {
        totalSalesEl.textContent = totalSales.toLocaleString();
    }
    
    if (!hybridPercentCounter.error) {
        hybridPercentCounter.start();
    } else {
        hybridPercentEl.textContent = hybridPercent + '%';
    }
}

// Utility function to generate gradient colors
function getGradientColor(ctx, colorFrom, colorTo) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorFrom);
    gradient.addColorStop(1, colorTo);
    return gradient;
}

// Utility function to format large numbers
function formatNumber(number) {
    if (number >= 10000) {
        return (number / 10000).toFixed(1) + '万';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k';
    }
    return number.toString();
}

// Add CSS class utility
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        element.className += ' ' + className;
    }
}

// Remove CSS class utility
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        element.className = element.className.replace(
            new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '
        );
    }
}

// Toggle CSS class utility
function toggleClass(element, className) {
    if (element.classList) {
        element.classList.toggle(className);
    } else {
        const classes = element.className.split(' ');
        const existingIndex = classes.indexOf(className);
        
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
        }
        
        element.className = classes.join(' ');
    }
}

// Add Chart.js implementation for model comparison
function setupChartJsComparison() {
    // First, check if we need to create the container
    if (!document.querySelector('.chartjs-container')) {
        const container = document.querySelector('.compare-section .container');
        if (!container) return;
        
        const chartjsSection = document.createElement('div');
        chartjsSection.className = 'chartjs-container';
        chartjsSection.innerHTML = `
            <h3 class="section-title">Chart.js 可视化</h3>
            <div class="charts-grid">
                <div class="card animate-on-scroll" data-animation="fadeIn">
                    <div class="card-title">
                        <span>车型销量对比 (Chart.js)</span>
                        <button class="refresh" onclick="refreshChartJs('bar')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 16H2V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            刷新
                        </button>
                    </div>
                    <div class="chart-container">
                        <canvas id="chartjs-comparison"></canvas>
                    </div>
                </div>
                
                <div class="card animate-on-scroll" data-animation="fadeIn" data-delay="0.2">
                    <div class="card-title">
                        <span>车型类型分布 (Chart.js)</span>
                        <button class="refresh" onclick="refreshChartJs('radar')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 16H2V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            刷新
                        </button>
                    </div>
                    <div class="chart-container">
                        <canvas id="chartjs-radar"></canvas>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(chartjsSection);
    }
    
    // Setup bar chart
    setupChartJsBarChart();
    
    // Setup radar chart
    setupChartJsRadarChart();
}

// Setup bar chart comparing top models across periods
function setupChartJsBarChart() {
    // Get current period
    const currentPeriod = document.querySelector('.period-option.active').getAttribute('data-period');
    
    // Get top 5 models for the current period
    const topModels = allPeriodsData[currentPeriod].models.slice(0, 5);
    
    // Get data for all periods for these models
    const datasets = [];
    const periods = Object.keys(allPeriodsData);
    
    const colors = [
        'rgba(0, 168, 84, 0.8)',   // Green
        'rgba(25, 118, 210, 0.8)',  // Blue
        'rgba(245, 124, 0, 0.8)',   // Orange
        'rgba(156, 39, 176, 0.8)',  // Purple
        'rgba(211, 47, 47, 0.8)'    // Red
    ];
    
    // Create a dataset for each period
    periods.forEach((period, index) => {
        const data = [];
        
        // Get sales data for each top model in this period
        topModels.forEach(model => {
            const modelIndex = allPeriodsData[period].models.indexOf(model);
            if (modelIndex !== -1) {
                data.push(allPeriodsData[period].sales[modelIndex]);
            } else {
                data.push(0); // Model not found in this period
            }
        });
        
        datasets.push({
            label: period,
            data: data,
            backgroundColor: colors[index],
            borderColor: colors[index].replace('0.8', '1'),
            borderWidth: 1
        });
    });
    
    // Get the canvas element
    const canvas = document.getElementById('chartjs-comparison');
    if (!canvas) return;
    
    // Check if Chart instance already exists and destroy it
    if (window.chartInstances.chartjsComparison instanceof Chart) {
        window.chartInstances.chartjsComparison.destroy();
    }
    
    // Create the Chart.js chart
    window.chartInstances.chartjsComparison = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: topModels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                title: {
                    display: true,
                    text: '车型销量周期对比',
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Setup radar chart showing vehicle type distribution
function setupChartJsRadarChart() {
    // Get the canvas element
    const canvas = document.getElementById('chartjs-radar');
    if (!canvas) return;
    
    // Check if Chart instance already exists and destroy it
    if (window.chartInstances.chartjsRadar instanceof Chart) {
        window.chartInstances.chartjsRadar.destroy();
    }
    
    // Prepare data
    const periods = Object.keys(allPeriodsData);
    const vehicleTypes = ['DM-i混动', 'EV纯电', '燃油车'];
    
    const datasets = periods.map((period, index) => {
        const typeData = allPeriodsData[period].types;
        
        // Make sure we have all three types, with 0 as fallback
        const data = [
            typeData['DM-i混动'] || 0,
            typeData['EV纯电'] || 0,
            typeData['燃油车'] || 0
        ];
        
        // Normalize to percentages
        const total = data.reduce((sum, val) => sum + val, 0);
        const percentages = data.map(val => Math.round((val / total) * 100));
        
        const colors = [
            'rgba(0, 168, 84, 0.7)',
            'rgba(25, 118, 210, 0.7)',
            'rgba(245, 124, 0, 0.7)',
            'rgba(156, 39, 176, 0.7)',
            'rgba(211, 47, 47, 0.7)'
        ];
        
        return {
            label: period,
            data: percentages,
            fill: true,
            backgroundColor: colors[index].replace('0.7', '0.2'),
            borderColor: colors[index],
            pointBackgroundColor: colors[index],
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colors[index]
        };
    });
    
    // Create the radar chart
    window.chartInstances.chartjsRadar = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: vehicleTypes,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        backdropColor: 'transparent',
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: '各周期车型类型分布对比 (%)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Refresh Chart.js chart by type (bar or radar)
function refreshChartJs(type) {
    if (type === 'radar') {
        setupChartJsRadarChart();
    } else {
        setupChartJsBarChart();
    }
}

// Update window.chartInstances on init
function initChartInstances() {
    window.chartInstances = {
        mainChart: echarts.init(document.getElementById('main-chart')),
        pieChart: echarts.init(document.getElementById('pie-chart')),
        trendChart: echarts.init(document.getElementById('trend-chart')),
        comparisonChart: echarts.init(document.getElementById('comparison-chart')),
        trendComparisonChart: echarts.init(document.getElementById('trend-comparison-chart')),
        chartjsComparison: null, // Will be initialized later
        chartjsRadar: null       // Will be initialized later
    };
} 