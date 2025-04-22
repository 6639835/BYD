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

// Update nav dots on scroll
window.addEventListener('scroll', function() {
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
    
    // Animate elements when they come into view
    document.querySelectorAll('.kpi-card, .card').forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        
        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            el.style.animation = 'fadeInUp 0.8s ease forwards';
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.opacity = '1';
            }, 300);
        }
    });
});

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

// 初始化图表和引用对象
let charts = {};

// 初始化各图表
function initCharts() {
    // 主图表 - 车型销量排行
    const mainChart = echarts.init(document.getElementById('main-chart'));
    const mainOption = {
        grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: '{b}: {c} 辆',
            backgroundColor: 'rgba(16, 20, 40, 0.85)',
            borderColor: 'rgba(0, 230, 118, 0.3)',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'value',
            name: '销量（辆）',
            nameTextStyle: {
                color: 'rgba(255, 255, 255, 0.6)'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.6)'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: salesData.models.slice().reverse(),
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.9)',
                interval: 0
            }
        },
        series: [{
            name: '销量',
            type: 'bar',
            data: salesData.sales.slice().reverse(),
            label: {
                show: true,
                position: 'right',
                formatter: '{c} 辆',
                color: 'rgba(255, 255, 255, 0.9)'
            },
            itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: function(params) {
                    const colorList = themes.color;
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: colorList[params.dataIndex % colorList.length] + '80' },
                        { offset: 1, color: colorList[params.dataIndex % colorList.length] }
                    ]);
                }
            }
        }],
        animationDuration: 2000,
        animationEasing: 'elasticOut'
    };
    mainChart.setOption(mainOption);

    // 饼图 - 销量类型分布
    const pieChart = echarts.init(document.getElementById('pie-chart'));
    const pieOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 辆 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        series: [
            {
                name: '销量类型',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#000',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { 
                        value: salesData.types['DM-i混动'], 
                        name: 'DM-i混动',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#3eecac'},
                            {offset: 1, color: '#3ba272'}
                        ])}
                    },
                    { 
                        value: salesData.types['EV纯电'], 
                        name: 'EV纯电',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#ee74e1'},
                            {offset: 1, color: '#9a60b4'}
                        ])}
                    },
                    { 
                        value: salesData.types['燃油车'], 
                        name: '燃油车',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#fac858'},
                            {offset: 1, color: '#fc8452'}
                        ])}
                    }
                ]
            }
        ],
        animationDuration: 1500,
        animationEasing: 'elasticOut'
    };
    pieChart.setOption(pieOption);

    // 趋势图 - 月度销量趋势
    const trendChart = echarts.init(document.getElementById('trend-chart'));
    const trendOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['1月', '2月', '3月'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            top: 'bottom'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['秦PLUS DM-i', '宋PLUS DM-i', '元PLUS', '海豚', '汉EV'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.6)',
                rotate: 45,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: '销量',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.6)'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '1月',
                type: 'bar',
                emphasis: {
                    focus: 'series'
                },
                data: salesData.monthlyTrend['1月'].slice(0, 5),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#5470c6'},
                        {offset: 1, color: '#73c0de'}
                    ])
                }
            },
            {
                name: '2月',
                type: 'bar',
                emphasis: {
                    focus: 'series'
                },
                data: salesData.monthlyTrend['2月'].slice(0, 5),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#91cc75'},
                        {offset: 1, color: '#3ba272'}
                    ])
                }
            },
            {
                name: '3月',
                type: 'bar',
                emphasis: {
                    focus: 'series'
                },
                data: salesData.monthlyTrend['3月'].slice(0, 5),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#ee6666'},
                        {offset: 1, color: '#fc8452'}
                    ])
                }
            }
        ],
        animationDuration: 1500,
        animationEasing: 'elasticOut'
    };
    trendChart.setOption(trendOption);

    // 保存图表引用
    charts = {
        'main-chart': mainChart,
        'pie-chart': pieChart,
        'trend-chart': trendChart
    };

    // 窗口调整大小事件
    window.addEventListener('resize', function() {
        mainChart.resize();
        pieChart.resize();
        trendChart.resize();
    });

    // Apply smooth animations to all charts
    setTimeout(() => {
        for (let key in charts) {
            if (charts[key]) {
                charts[key].dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: 0
                });
                setTimeout(() => {
                    charts[key].dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: 0
                    });
                }, 1000);
            }
        }
    }, 2500);

    return charts;
}

// 图表刷新动画
function refreshChart(chartId) {
    const refreshButton = document.querySelector(`.refresh[onclick="refreshChart('${chartId}')"]`);
    refreshButton.style.transition = 'transform 0.5s ease';
    refreshButton.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        if (charts[chartId]) {
            charts[chartId].clear();
            switch (chartId) {
                case 'main-chart':
                    charts[chartId].setOption({
                        series: [{
                            data: salesData.sales.slice().reverse()
                        }]
                    });
                    break;
                case 'pie-chart':
                    charts[chartId].setOption({
                        series: [{
                            data: [
                                {
                                    value: salesData.types['DM-i混动'],
                                    name: 'DM-i混动',
                                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#3eecac'},
                                        {offset: 1, color: '#3ba272'}
                                    ])}
                                },
                                {
                                    value: salesData.types['EV纯电'],
                                    name: 'EV纯电',
                                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#ee74e1'},
                                        {offset: 1, color: '#9a60b4'}
                                    ])}
                                },
                                {
                                    value: salesData.types['燃油车'],
                                    name: '燃油车',
                                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#fac858'},
                                        {offset: 1, color: '#fc8452'}
                                    ])}
                                }
                            ]
                        }]
                    });
                    break;
                case 'trend-chart':
                    charts[chartId].setOption({
                        series: [
                            {
                                data: salesData.monthlyTrend['1月'].slice(0, 5)
                            },
                            {
                                data: salesData.monthlyTrend['2月'].slice(0, 5)
                            },
                            {
                                data: salesData.monthlyTrend['3月'].slice(0, 5)
                            }
                        ]
                    });
                    break;
            }
        }
        
        setTimeout(() => {
            refreshButton.style.transform = 'rotate(0deg)';
        }, 500);
    }, 300);
}

// 初始化所有图表
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    
    // 数字动画
    setTimeout(() => {
        new CountUp('total-sales', 0, totalSales).start();
        new CountUp('hybrid-percent', 0, hybridPercent, {
            suffix: '%'
        }).start();
    }, 1000);
});

// Particles.js 配置
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#0066ff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#0066ff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
    
    // 初始化周期选择器
    initPeriodSelector();
    
    // 初始化详细数据表格
    initDetailTable();
    
    // 绑定筛选事件
    bindFilterEvents();
    
    // 初始化对比图表
    setupComparisonCharts();
    updateComparisonChart();
    
    // 初始化分页显示
    const tableRows = document.querySelectorAll('#sales-table tbody tr');
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    updatePageDisplay(tableRows, visibleRows);
});

// 详细数据表格初始化
function initDetailTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    salesData.models.forEach((model, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${model}</td>
            <td>${salesData.modelTypes[model]}</td>
            <td>${salesData.sales[index].toLocaleString()}</td>
            <td class="${salesData.yearOnYear[model].startsWith('+') ? 'positive' : 'negative'}">${salesData.yearOnYear[model]}</td>
            <td class="${salesData.monthOnMonth[model].startsWith('+') ? 'positive' : 'negative'}">${salesData.monthOnMonth[model]}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 数据筛选功能
function filterTable() {
    const searchInput = document.getElementById('model-search').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const tableRows = document.querySelectorAll('#sales-table tbody tr');
    
    tableRows.forEach(row => {
        const model = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const type = row.querySelector('td:nth-child(3)').textContent;
        
        const matchesSearch = model.includes(searchInput);
        const matchesType = typeFilter === 'all' || 
            (typeFilter === 'dm-i' && type === 'DM-i混动') ||
            (typeFilter === 'ev' && type === 'EV纯电') ||
            (typeFilter === 'ice' && type === '燃油车');
        
        row.style.display = matchesSearch && matchesType ? '' : 'none';
    });
}

// 绑定搜索和筛选事件
function bindFilterEvents() {
    const searchInput = document.getElementById('model-search');
    const typeFilter = document.getElementById('type-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTable();
            currentPage = 1;
            const tableRows = document.querySelectorAll('#sales-table tbody tr');
            const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
            updatePageDisplay(tableRows, visibleRows);
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filterTable();
            currentPage = 1;
            const tableRows = document.querySelectorAll('#sales-table tbody tr');
            const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
            updatePageDisplay(tableRows, visibleRows);
        });
    }
}

// 表格分页功能
let currentPage = 1;
const itemsPerPage = 6;

function changePage(direction) {
    const tableRows = document.querySelectorAll('#sales-table tbody tr');
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    const totalPages = Math.ceil(visibleRows.length / itemsPerPage);
    
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    updatePageDisplay(tableRows, visibleRows);
}

function updatePageDisplay(allRows, visibleRows) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(visibleRows.length / itemsPerPage);
    
    // 更新页码显示
    const pageIndicator = document.querySelector('.page-indicator');
    if (pageIndicator) {
        pageIndicator.textContent = `${currentPage} / ${totalPages || 1}`;
    }
    
    // 显示当前页的行
    allRows.forEach((row, index) => {
        if (row.style.display !== 'none') {
            const visibleIndex = visibleRows.indexOf(row);
            row.style.display = (visibleIndex >= startIndex && visibleIndex < endIndex) ? '' : 'none';
        }
    });
}

// 数据导出功能
function exportData(format) {
    alert(`正在导出${format === 'excel' ? 'Excel' : 'PDF'}格式数据，请稍候...`);
    // 实际项目中应该实现真正的导出功能
    setTimeout(() => {
        alert(`${format === 'excel' ? 'Excel' : 'PDF'}格式数据导出成功!`);
    }, 1500);
}

// 设置对比图表
function setupComparisonCharts() {
    // 对比图表
    const comparisonChart = echarts.init(document.getElementById('comparison-chart'));
    const comparisonOption = {
        title: {
            text: '车型销量对比',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 16
            },
            left: 'center'
        },
        legend: {
            data: ['总销量'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            bottom: 5
        },
        radar: {
            indicator: [
                { name: '总销量', max: 120000 },
                { name: '1月销量', max: 40000 },
                { name: '2月销量', max: 40000 },
                { name: '3月销量', max: 40000 },
                { name: '同比增长', max: 30 }
            ],
            shape: 'polygon',
            splitNumber: 5,
            axisName: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: []
    };
    comparisonChart.setOption(comparisonOption);

    // 趋势对比图表
    const trendComparisonChart = echarts.init(document.getElementById('trend-comparison-chart'));
    const trendComparisonOption = {
        title: {
            text: '月度销量趋势对比',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 16
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            bottom: 5
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.6)'
            }
        },
        yAxis: {
            type: 'value',
            name: '销量',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.6)'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: []
    };
    trendComparisonChart.setOption(trendComparisonOption);

    // 添加到charts引用
    charts['comparison-chart'] = comparisonChart;
    charts['trend-comparison-chart'] = trendComparisonChart;

    // 窗口调整大小事件
    window.addEventListener('resize', function() {
        comparisonChart.resize();
        trendComparisonChart.resize();
    });
}

// 车型对比功能
function updateComparisonChart() {
    const model1Element = document.getElementById('model-select-1');
    const model2Element = document.getElementById('model-select-2');
    const model3Element = document.getElementById('model-select-3');
    
    if (!model1Element || !model2Element || !model3Element) return;
    
    const model1 = model1Element.value;
    const model2 = model2Element.value;
    const model3 = model3Element.value;
    
    const selectedModels = [model1, model2, model3];
    const uniqueModels = [...new Set(selectedModels)]; // 去重
    
    // 获取当前周期的月份名称（处理不同周期的月份差异）
    const monthKeys = Object.keys(salesData.monthlyTrend);
    
    // 更新雷达图数据
    const comparisonData = uniqueModels.map(model => {
        const index = salesData.models.indexOf(model);
        // 处理同比增长率的数字值（去掉+和%）
        let yearOnYearValue = salesData.yearOnYear[model];
        if (yearOnYearValue === '新上市') {
            yearOnYearValue = 0;
        } else {
            yearOnYearValue = parseFloat(yearOnYearValue.replace(/%|\+/g, ''));
        }
        
        return {
            name: model,
            value: [
                salesData.sales[index],
                salesData.monthlyTrend[monthKeys[0]][index],
                salesData.monthlyTrend[monthKeys[1]][index],
                salesData.monthlyTrend[monthKeys[2]][index],
                yearOnYearValue
            ]
        };
    });
    
    const radarSeries = [{
        type: 'radar',
        data: comparisonData.map((item, i) => {
            return {
                value: item.value,
                name: item.name,
                areaStyle: {
                    opacity: 0.2
                },
                lineStyle: {
                    width: 2
                }
            };
        })
    }];
    
    // 更新趋势图数据
    const trendSeries = uniqueModels.map(model => {
        const index = salesData.models.indexOf(model);
        return {
            name: model,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            data: [
                salesData.monthlyTrend[monthKeys[0]][index],
                salesData.monthlyTrend[monthKeys[1]][index],
                salesData.monthlyTrend[monthKeys[2]][index]
            ]
        };
    });
    
    // 更新图表
    charts['comparison-chart'].setOption({
        legend: {
            data: uniqueModels
        },
        series: radarSeries
    });
    
    charts['trend-comparison-chart'].setOption({
        legend: {
            data: uniqueModels
        },
        xAxis: {
            data: monthKeys
        },
        series: trendSeries
    });
}

// 周期选择器功能
function initPeriodSelector() {
    const periodOptions = document.querySelectorAll('.period-option');
    
    periodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有active类
            periodOptions.forEach(opt => opt.classList.remove('active'));
            
            // 添加active类到当前点击的选项
            this.classList.add('active');
            
            // 获取选择的周期
            const period = this.getAttribute('data-period');
            
            // 更新所有图表和数据
            updateAllCharts(period);
        });
    });
}

// 更新页面标题
function updatePageTitle() {
    const titleMap = {
        "2024-Q1": "2024年第一季度",
        "2023-Q4": "2023年第四季度",
        "2023-Q3": "2023年第三季度",
        "2023-Q2": "2023年第二季度"
    };
    
    const titleElement = document.querySelector('.header h1');
    if (titleElement) {
        titleElement.innerHTML = `比亚迪汽车<br>${titleMap[currentPeriod]}销量排行榜`;
    }
}

// 更新KPI数据
function updateKPIs() {
    // 重新计算总销量和混动占比
    const updatedTotalSales = salesData.sales.reduce((a, b) => a + b, 0);
    const updatedHybridSales = salesData.sales.reduce((total, sales, index) => {
        return salesData.modelTypes[salesData.models[index]] === 'DM-i混动' ? total + sales : total;
    }, 0);
    const updatedHybridPercent = (updatedHybridSales / updatedTotalSales * 100).toFixed(1);
    
    // 更新KPI数值
    new CountUp('total-sales', 0, updatedTotalSales).start();
    new CountUp('hybrid-percent', 0, updatedHybridPercent, {
        suffix: '%'
    }).start();
    
    // 更新热销车型信息
    const topModelIndex = salesData.sales.indexOf(Math.max(...salesData.sales));
    const topModel = salesData.models[topModelIndex];
    const topModelSales = salesData.sales[topModelIndex];
    
    const hotModelElement = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    const hotModelSalesElement = document.querySelector('.kpi-card:nth-child(2) .kpi-change');
    
    if (hotModelElement && hotModelSalesElement) {
        hotModelElement.textContent = topModel;
        hotModelSalesElement.textContent = `${topModelSales.toLocaleString()} 辆`;
    }
}

// 刷新所有图表
function refreshAllCharts() {
    if (charts['main-chart']) {
        charts['main-chart'].setOption({
            yAxis: {
                data: salesData.models.slice().reverse()
            },
            series: [{
                data: salesData.sales.slice().reverse()
            }]
        });
    }
    
    if (charts['pie-chart']) {
        charts['pie-chart'].setOption({
            series: [{
                data: [
                    { 
                        value: salesData.types['DM-i混动'], 
                        name: 'DM-i混动',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#3eecac'},
                            {offset: 1, color: '#3ba272'}
                        ])}
                    },
                    { 
                        value: salesData.types['EV纯电'], 
                        name: 'EV纯电',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#ee74e1'},
                            {offset: 1, color: '#9a60b4'}
                        ])}
                    },
                    { 
                        value: salesData.types['燃油车'], 
                        name: '燃油车',
                        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: '#fac858'},
                            {offset: 1, color: '#fc8452'}
                        ])}
                    }
                ]
            }]
        });
    }
    
    // 获取当前周期的月份名称
    const monthKeys = Object.keys(salesData.monthlyTrend);
    
    if (charts['trend-chart']) {
        charts['trend-chart'].setOption({
            legend: {
                data: monthKeys
            },
            xAxis: {
                data: salesData.models.slice(0, 5)
            },
            series: monthKeys.map((month, index) => {
                return {
                    name: month,
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    data: salesData.monthlyTrend[month].slice(0, 5),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: themes.color[index * 3 % themes.color.length]},
                            {offset: 1, color: themes.color[(index * 3 + 1) % themes.color.length]}
                        ])
                    }
                };
            })
        });
    }
    
    // 更新对比图表
    updateComparisonChart();
}

// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
    // 模拟加载延迟，确保动画效果显示
    setTimeout(function() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 1500); // 1.5秒后隐藏加载动画
    
    // 初始化滚动动画
    initScrollAnimations();
});

// 初始化滚动检测
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // 检查元素是否在视口中
    function checkInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // 元素距离视口顶部的距离阈值
            
            if (elementTop < window.innerHeight - elementVisible) {
                const animation = element.dataset.animation || 'fadeIn';
                const delay = element.dataset.delay || 0;
                
                element.classList.add('animated');
                
                // 通过设置延迟来控制动画序列
                element.style.transitionDelay = `${delay}s`;
            }
        });
    }
    
    // 初始检查
    checkInView();
    
    // 滚动时检查
    window.addEventListener('scroll', checkInView);
}

// 滚动监听实现
function initScrollSpy() {
    const sections = ['.hero-section', '.dashboard', '.detail-section', '.compare-section'];
    const navDots = document.querySelectorAll('.nav-dot');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach((section, index) => {
            const element = document.querySelector(section);
            if (element) {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < window.innerHeight / 2) {
                    current = section;
                    
                    // 更新导航点状态
                    navDots.forEach(dot => dot.classList.remove('active'));
                    navDots[index].classList.add('active');
                }
            }
        });
    });
}

// 更新所有图表和数据
function updateAllCharts(period) {
    currentPeriod = period;
    salesData = allPeriodsData[currentPeriod];
    
    // 更新页面标题
    updatePageTitle();
    
    // 重新计算KPI数据
    updateKPIs();
    
    // 刷新所有图表
    refreshAllCharts();
    
    // 更新详细数据表格
    initDetailTable();
} 