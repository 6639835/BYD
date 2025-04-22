// 数据分析页面的JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素引用
    const analysisForm = document.getElementById('analysis-form');
    const analysisType = document.getElementById('analysis-type');
    const modelCheckboxes = document.querySelectorAll('.model-checkbox');
    const quarterCheckboxes = document.querySelectorAll('.quarter-checkbox');
    const selectAllModelsBtn = document.getElementById('select-all-models');
    const deselectAllModelsBtn = document.getElementById('deselect-all-models');
    const selectAllQuartersBtn = document.getElementById('select-all-quarters');
    const deselectAllQuartersBtn = document.getElementById('deselect-all-quarters');
    const selectRecentQuartersBtn = document.getElementById('select-recent-quarters');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noDataMessage = document.getElementById('no-data-message');
    const analysisResults = document.getElementById('analysis-results');
    const comparisonChartCard = document.getElementById('comparison-chart-card');
    const growthChartCard = document.getElementById('growth-chart-card');
    const shareChartCard = document.getElementById('share-chart-card');

    // Chart.js 实例
    let comparisonChart = null;
    let sharePieChart = null;
    let currentData = null;

    // 初始化：默认选择前5个车型和所有季度
    function initCheckboxes() {
        // 选择前5个车型
        let selectedModels = 0;
        modelCheckboxes.forEach(checkbox => {
            if (selectedModels < 5) {
                checkbox.checked = true;
                selectedModels++;
            }
        });

        // 选择所有季度
        quarterCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    }

    // 全选/取消全选处理函数
    selectAllModelsBtn.addEventListener('click', function() {
        modelCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });

    deselectAllModelsBtn.addEventListener('click', function() {
        modelCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    selectAllQuartersBtn.addEventListener('click', function() {
        quarterCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });

    deselectAllQuartersBtn.addEventListener('click', function() {
        quarterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    selectRecentQuartersBtn.addEventListener('click', function() {
        // 先取消全选
        quarterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 选择最后4个季度（如果有）
        const totalQuarters = quarterCheckboxes.length;
        const startIndex = Math.max(0, totalQuarters - 4);
        
        for (let i = startIndex; i < totalQuarters; i++) {
            quarterCheckboxes[i].checked = true;
        }
    });

    // 分析类型切换时的UI调整
    analysisType.addEventListener('change', function() {
        const type = this.value;
        const modelsGroup = document.getElementById('models-select-group');
        
        if (type === 'quarterly_growth') {
            // 增长分析不需要选择车型
            modelsGroup.style.display = 'none';
        } else {
            modelsGroup.style.display = 'block';
        }
    });

    // 表单提交处理
    analysisForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取选中的车型和季度
        const selectedModels = Array.from(modelCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
            
        const selectedQuarters = Array.from(quarterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const type = analysisType.value;
        
        // 验证数据：市场份额和车型比较需要车型
        if ((type === 'model_comparison' || type === 'market_share') && selectedModels.length === 0) {
            showToast('请至少选择一个车型', 'error');
            return;
        }
        
        // 所有分析类型都需要季度
        if (selectedQuarters.length === 0) {
            showToast('请至少选择一个季度', 'error');
            return;
        }
        
        // 显示加载指示器
        loadingIndicator.style.display = 'flex';
        noDataMessage.style.display = 'none';
        analysisResults.style.display = 'none';
        
        // 构建API请求URL
        let url = `/api/sales/analysis?type=${type}`;
        
        if (selectedModels.length > 0) {
            selectedModels.forEach(model => {
                url += `&models=${encodeURIComponent(model)}`;
            });
        }
        
        selectedQuarters.forEach(quarter => {
            url += `&quarters=${encodeURIComponent(quarter)}`;
        });
        
        // 发送请求
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }
                return response.json();
            })
            .then(data => {
                // 保存当前数据用于导出
                currentData = data;
                
                // 隐藏所有结果卡片
                comparisonChartCard.style.display = 'none';
                growthChartCard.style.display = 'none';
                shareChartCard.style.display = 'none';
                
                // 根据分析类型显示相应图表
                if (type === 'model_comparison') {
                    renderComparisonChart(data);
                    comparisonChartCard.style.display = 'block';
                } else if (type === 'quarterly_growth') {
                    renderGrowthAnalysis(data);
                    growthChartCard.style.display = 'block';
                } else if (type === 'market_share') {
                    renderMarketShareAnalysis(data);
                    shareChartCard.style.display = 'block';
                }
                
                // 显示数据表格
                renderDataTable(data, type);
                
                // 显示结果，隐藏加载指示器
                loadingIndicator.style.display = 'none';
                analysisResults.style.display = 'block';
            })
            .catch(error => {
                console.error('获取数据时发生错误:', error);
                loadingIndicator.style.display = 'none';
                noDataMessage.style.display = 'block';
                showToast('获取数据时发生错误', 'error');
            });
    });

    // 渲染车型比较图表
    function renderComparisonChart(data) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        const chartType = localStorage.getItem('preferredChartType') || 'bar';
        
        // 销量数据准备
        const datasets = data.data.map((item, index) => {
            // 生成随机颜色
            const hue = (index * 137) % 360;
            const color = `hsl(${hue}, 70%, 60%)`;
            
            return {
                label: item.model,
                data: item.sales.map(s => s.sales),
                backgroundColor: color,
                borderColor: color,
                borderWidth: chartType === 'line' ? 2 : 1,
                fill: false
            };
        });
        
        // 如果已有图表，销毁它
        if (comparisonChart) {
            comparisonChart.destroy();
        }
        
        // 创建新图表
        comparisonChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: data.quarters,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '销量（台）'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000) {
                                    return value / 1000 + 'k';
                                }
                                return value;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '季度'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                const formattedValue = new Intl.NumberFormat().format(value);
                                return `${label}: ${formattedValue} 台`;
                            }
                        }
                    }
                }
            }
        });
        
        // 切换图表类型事件处理
        document.getElementById('toggle-chart-type').addEventListener('click', function() {
            const newType = comparisonChart.config.type === 'bar' ? 'line' : 'bar';
            localStorage.setItem('preferredChartType', newType);
            
            // 保存当前数据
            const currentData = comparisonChart.data;
            
            // 销毁当前图表
            comparisonChart.destroy();
            
            // 创建新图表类型
            comparisonChart = new Chart(ctx, {
                type: newType,
                data: currentData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '销量（台）'
                            },
                            ticks: {
                                callback: function(value) {
                                    if (value >= 1000) {
                                        return value / 1000 + 'k';
                                    }
                                    return value;
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '季度'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    const formattedValue = new Intl.NumberFormat().format(value);
                                    return `${label}: ${formattedValue} 台`;
                                }
                            }
                        }
                    }
                }
            });
        });
        
        // 下载图表事件处理
        document.getElementById('download-chart').addEventListener('click', function() {
            const canvas = document.getElementById('comparison-chart');
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = '车型销量比较.png';
            link.href = image;
            link.click();
        });
    }

    // 渲染季度增长分析
    function renderGrowthAnalysis(data) {
        const growthTabButtons = document.querySelector('.growth-tab-buttons');
        const growthTabContent = document.querySelector('.growth-tab-content');
        
        // 清空现有内容
        growthTabButtons.innerHTML = '';
        growthTabContent.innerHTML = '';
        
        // 没有数据时显示提示
        if (!data.growth_data || data.growth_data.length === 0) {
            growthTabContent.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-chart-line"></i></div><h3>暂无增长分析数据</h3><p>请选择至少两个连续季度</p></div>';
            return;
        }
        
        // 为每个季度比较创建标签页
        data.growth_data.forEach((item, index) => {
            // 创建标签按钮
            const button = document.createElement('button');
            button.className = 'growth-tab-button' + (index === 0 ? ' active' : '');
            button.dataset.target = `growth-tab-${index}`;
            button.textContent = item.quarter_comparison;
            growthTabButtons.appendChild(button);
            
            // 创建标签内容面板
            const panel = document.createElement('div');
            panel.className = 'growth-tab-panel' + (index === 0 ? ' active' : '');
            panel.id = `growth-tab-${index}`;
            
            // 创建增长率表格
            let tableHtml = `
                <table class="growth-table">
                    <thead>
                        <tr>
                            <th>车型</th>
                            <th>前期销量</th>
                            <th>当期销量</th>
                            <th>增长率</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            item.items.forEach(model => {
                const growthClass = model.growth_rate >= 0 ? 'positive' : 'negative';
                const growthIcon = model.growth_rate >= 0 ? 'arrow-up' : 'arrow-down';
                
                tableHtml += `
                    <tr>
                        <td>${model.model}</td>
                        <td>${new Intl.NumberFormat().format(model.previous_sales)}</td>
                        <td>${new Intl.NumberFormat().format(model.current_sales)}</td>
                        <td>
                            <div class="growth-rate-cell ${growthClass}">
                                <i class="fas fa-${growthIcon}"></i>
                                ${Math.abs(model.growth_rate).toFixed(2)}%
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            panel.innerHTML = tableHtml;
            growthTabContent.appendChild(panel);
        });
        
        // 标签页切换事件处理
        document.querySelectorAll('.growth-tab-button').forEach(button => {
            button.addEventListener('click', function() {
                // 移除所有活动状态
                document.querySelectorAll('.growth-tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.growth-tab-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // 设置当前活动标签
                this.classList.add('active');
                document.getElementById(this.dataset.target).classList.add('active');
            });
        });
        
        // 下载图表事件处理
        document.getElementById('download-growth-chart').addEventListener('click', function() {
            // 创建一个包含所有增长数据的CSV文件
            let csvContent = "车型,季度比较,前期销量,当期销量,增长率\n";
            
            data.growth_data.forEach(item => {
                item.items.forEach(model => {
                    csvContent += `${model.model},${item.quarter_comparison},${model.previous_sales},${model.current_sales},${model.growth_rate}%\n`;
                });
            });
            
            // 创建并下载文件
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, '季度增长分析.csv');
        });
    }

    // 渲染市场份额分析
    function renderMarketShareAnalysis(data) {
        if (!data.share_data || data.share_data.length === 0) {
            document.querySelector('#share-chart-card .card-body').innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-chart-pie"></i></div><h3>暂无市场份额数据</h3><p>请选择至少一个季度进行分析</p></div>';
            return;
        }
        
        // 季度选择器填充
        const shareQuarterSelect = document.getElementById('share-quarter-select');
        shareQuarterSelect.innerHTML = '';
        
        data.share_data.forEach(quarterData => {
            const option = document.createElement('option');
            option.value = quarterData.quarter;
            option.textContent = quarterData.quarter;
            shareQuarterSelect.appendChild(option);
        });
        
        // 渲染初始数据（第一个季度）
        renderShareDataForQuarter(data.share_data[0]);
        
        // 季度变更事件
        shareQuarterSelect.addEventListener('change', function() {
            const selectedQuarter = this.value;
            const quarterData = data.share_data.find(item => item.quarter === selectedQuarter);
            if (quarterData) {
                renderShareDataForQuarter(quarterData);
            }
        });
        
        // 下载按钮事件
        document.getElementById('download-share-chart').addEventListener('click', function() {
            const canvas = document.getElementById('share-pie-chart');
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = '市场份额分析.png';
            link.href = image;
            link.click();
        });
    }
    
    // 为特定季度渲染市场份额数据
    function renderShareDataForQuarter(quarterData) {
        const ctx = document.getElementById('share-pie-chart').getContext('2d');
        const tableBody = document.querySelector('#share-data-table tbody');
        
        // 准备饼图数据
        const labels = quarterData.items.map(item => item.model);
        const values = quarterData.items.map(item => item.share);
        const backgroundColors = generateColors(labels.length);
        
        // 如果已有图表，销毁它
        if (sharePieChart) {
            sharePieChart.destroy();
        }
        
        // 创建新图表
        sharePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                }
            }
        });
        
        // 填充表格
        tableBody.innerHTML = '';
        quarterData.items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.model}</td>
                <td>${new Intl.NumberFormat().format(item.sales)}</td>
                <td>${item.share.toFixed(2)}%</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // 渲染数据表格
    function renderDataTable(data, type) {
        const tableHead = document.getElementById('analysis-table-head');
        const tableBody = document.getElementById('analysis-table-body');
        
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        
        if (type === 'model_comparison') {
            // 车型比较表格
            let headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th>车型</th>';
            
            data.quarters.forEach(quarter => {
                headerRow.innerHTML += `<th>${quarter}</th>`;
            });
            
            tableHead.appendChild(headerRow);
            
            // 表体行
            data.data.forEach(modelData => {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${modelData.model}</td>`;
                
                modelData.sales.forEach(sale => {
                    row.innerHTML += `<td>${new Intl.NumberFormat().format(sale.sales)}</td>`;
                });
                
                tableBody.appendChild(row);
            });
        } else if (type === 'quarterly_growth') {
            // 季度增长表格
            let headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th>季度比较</th><th>车型</th><th>前期销量</th><th>当期销量</th><th>增长率</th>';
            tableHead.appendChild(headerRow);
            
            // 表体行
            data.growth_data.forEach(growth => {
                growth.items.forEach(item => {
                    let row = document.createElement('tr');
                    const growthClass = item.growth_rate >= 0 ? 'positive' : 'negative';
                    
                    row.innerHTML = `
                        <td>${growth.quarter_comparison}</td>
                        <td>${item.model}</td>
                        <td>${new Intl.NumberFormat().format(item.previous_sales)}</td>
                        <td>${new Intl.NumberFormat().format(item.current_sales)}</td>
                        <td class="${growthClass}">${item.growth_rate >= 0 ? '+' : ''}${item.growth_rate.toFixed(2)}%</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            });
        } else if (type === 'market_share') {
            // 市场份额表格
            let headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th>季度</th><th>车型</th><th>销量</th><th>市场份额</th>';
            tableHead.appendChild(headerRow);
            
            // 表体行
            data.share_data.forEach(quarterData => {
                quarterData.items.forEach(item => {
                    let row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${quarterData.quarter}</td>
                        <td>${item.model}</td>
                        <td>${new Intl.NumberFormat().format(item.sales)}</td>
                        <td>${item.share.toFixed(2)}%</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            });
        }
        
        // 导出数据按钮事件
        document.getElementById('export-data').addEventListener('click', function() {
            exportTableToCSV(type);
        });
    }
    
    // 将表格导出为CSV
    function exportTableToCSV(type) {
        const tableHead = document.getElementById('analysis-table-head');
        const tableBody = document.getElementById('analysis-table-body');
        
        let headers = [];
        let rows = [];
        
        // 获取表头
        const headerCells = tableHead.querySelectorAll('th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent);
        });
        
        // 获取表格数据
        const bodyRows = tableBody.querySelectorAll('tr');
        bodyRows.forEach(row => {
            let rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(cell.textContent);
            });
            rows.push(rowData);
        });
        
        // 生成CSV内容
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.join(',') + '\n';
        });
        
        // 创建并下载文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, getExportFileName(type));
    }
    
    // 生成文件名
    function getExportFileName(type) {
        const date = new Date().toISOString().split('T')[0];
        
        if (type === 'model_comparison') {
            return `车型销量比较_${date}.csv`;
        } else if (type === 'quarterly_growth') {
            return `季度增长分析_${date}.csv`;
        } else if (type === 'market_share') {
            return `市场份额分析_${date}.csv`;
        }
        
        return `销量数据_${date}.csv`;
    }
    
    // 生成随机颜色
    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    }
    
    // 显示提示消息
    function showToast(message, type = 'info') {
        // 使用现有的toast显示函数（假设工具库中已定义）
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
    
    // 初始化页面
    initCheckboxes();
}); 